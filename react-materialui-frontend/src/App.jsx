import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import theme from './theme';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PatientListTable from './pages/PatientListTable';
import JournalListTable from './pages/JournalListTable';
import JournalCalendar from './pages/JournalCalendar';

function App() {
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setDrawerOpen(!isDrawerOpen);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Box sx={{ display: 'flex', height: '100vh' }}>
                    <Header toggleDrawer={toggleDrawer} />
                    <Box sx={{ display: 'flex', flexGrow: 1, pt: '64px' }}>
                        <Sidebar isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
                        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                            <Routes>
                                <Route path="/patients" element={<PatientListTable />} />
                                <Route path="/journals-table" element={<JournalListTable />} />
                                <Route path="/journals-calendar" element={<JournalCalendar />} />
                            </Routes>
                        </Box>
                    </Box>
                </Box>
            </Router>
        </ThemeProvider>
    );
}

export default App;