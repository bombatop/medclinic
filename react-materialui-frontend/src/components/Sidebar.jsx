// components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
                    <List component="div" disablePadding>
                        <ListItemButton component={Link} to="/journals-table" sx={{ pl: 9}}>
                            <ListItemText primary="Записи" />
                        </ListItemButton>
                        <ListItemButton component={Link} to="/journals-calendar" sx={{ pl: 9 }}>
                            <ListItemText primary="Расписание" />
                        </ListItemButton>
                        <ListItemButton component={Link} to="/patients" sx={{ pl: 9 }}>
                            <ListItemText primary="Картотека" />
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
                        <ListItemButton component={Link} to="/treatments" sx={{ pl: 9 }}>
                            <ListItemText primary="Услуги" />
                        </ListItemButton>
                        <ListItemButton component={Link} to="/agencies" sx={{ pl: 9 }}>
                            <ListItemText primary="Агентства" />
                        </ListItemButton>
                        <ListItemButton component={Link} to="/prices" sx={{ pl: 9 }}>
                            <ListItemText primary="Цены" />
                        </ListItemButton>
                        <ListItemButton component={Link} to="/diagnoses" sx={{ pl: 9 }}>
                            <ListItemText primary="Диагнозы" />
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
                        <ListItemButton component={Link} to="/doctors" sx={{ pl: 9 }}>
                            <ListItemText primary="Доктора" />
                        </ListItemButton>
                    </List>
                </Collapse>

                <Divider />

            </List>
        </Drawer>
    );
}

export default Sidebar;
