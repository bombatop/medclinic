import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 240;

function Sidebar({ isOpen, toggleDrawer }) {
    const theme = useTheme();
    const location = useLocation();
    const [openSection, setOpenSection] = useState(null);

    useEffect(() => {
        if (!isOpen) {
            setOpenSection(null);
        }
    }, [isOpen]);

    const handleSectionClick = (section) => {
        if (openSection === section) {
            setOpenSection(null);
        } else {
            if (!isOpen) {
                toggleDrawer();
            }
            setOpenSection(section);
        }
    };

    const isCurrentPath = (path) => location.pathname === path;

    return (
        <Drawer
            variant="permanent"
            open={isOpen}
            sx={{
                width: isOpen ? drawerWidth : `calc(${theme.spacing(7)} + 1px)`,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: isOpen ? drawerWidth : `calc(${theme.spacing(7)} + 1px)`,
                    boxSizing: 'border-box',
                    transition: 'width 0.3s',
                    top: '64px',
                    height: 'calc(100% - 64px)',
                    overflowX: 'hidden',
                },
            }}
        >
            <List sx={{ paddingTop: '0px' }}>
                <ListItemButton onClick={() => handleSectionClick('reception')}>
                    <ListItemIcon><ScheduleIcon /></ListItemIcon>
                    <ListItemText primary="Прием" />
                    {openSection === 'reception' ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openSection === 'reception'} timeout="auto" unmountOnExit>
                    <ListItemButton
                        component={Link}
                        to="/patients"
                        sx={{ pl: 9, bgcolor: isCurrentPath('/patients') ? 'action.selected' : 'inherit' }}
                    >
                        <ListItemText primary="Картотека" />
                    </ListItemButton>
                    <List component="div" disablePadding>
                        <ListItemButton
                            component={Link}
                            to="/journals-table"
                            sx={{ pl: 9, bgcolor: isCurrentPath('/journals-table') ? 'action.selected' : 'inherit' }}
                        >
                            <ListItemText primary="Записи" />
                        </ListItemButton>
                        <ListItemButton
                            component={Link}
                            to="/journals-calendar"
                            sx={{ pl: 9, bgcolor: isCurrentPath('/journals-calendar') ? 'action.selected' : 'inherit' }}
                        >
                            <ListItemText primary="Расписание" />
                        </ListItemButton>
                    </List>
                </Collapse>

                <Divider />

                <ListItemButton onClick={() => handleSectionClick('references')}>
                    <ListItemIcon><LocalLibraryIcon /></ListItemIcon>
                    <ListItemText primary="Справочники" />
                    {openSection === 'references' ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openSection === 'references'} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton
                            component={Link}
                            to="/specialties"
                            sx={{ pl: 9, bgcolor: isCurrentPath('/specialties') ? 'action.selected' : 'inherit' }}
                        >
                            <ListItemText primary="Специальности" />
                        </ListItemButton>
                        <ListItemButton
                            component={Link}
                            to="/diagnoses"
                            sx={{ pl: 9, bgcolor: isCurrentPath('/diagnoses') ? 'action.selected' : 'inherit' }}
                        >
                            <ListItemText primary="Диагнозы" />
                        </ListItemButton>
                        <ListItemButton
                            component={Link}
                            to="/treatments"
                            sx={{ pl: 9, bgcolor: isCurrentPath('/treatments') ? 'action.selected' : 'inherit' }}
                        >
                            <ListItemText primary="Услуги" />
                        </ListItemButton>
                        <ListItemButton
                            component={Link}
                            to="/agencies"
                            sx={{ pl: 9, bgcolor: isCurrentPath('/agencies') ? 'action.selected' : 'inherit' }}
                        >
                            <ListItemText primary="Агентства" />
                        </ListItemButton>
                        <ListItemButton
                            component={Link}
                            to="/prices"
                            sx={{ pl: 9, bgcolor: isCurrentPath('/prices') ? 'action.selected' : 'inherit' }}
                        >
                            <ListItemText primary="Цены" />
                        </ListItemButton>
                    </List>
                </Collapse>

                <Divider />

                <ListItemButton onClick={() => handleSectionClick('staff')}>
                    <ListItemIcon><LocalHospitalIcon /></ListItemIcon>
                    <ListItemText primary="Персонал" />
                    {openSection === 'staff' ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openSection === 'staff'} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton
                            component={Link}
                            to="/users"
                            sx={{ pl: 9, bgcolor: isCurrentPath('/users') ? 'action.selected' : 'inherit' }}
                        >
                            <ListItemText primary="Сотрудники" />
                        </ListItemButton>
                    </List>
                </Collapse>

                <Divider />

            </List>
        </Drawer>
    );
}

export default Sidebar;
