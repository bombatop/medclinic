import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import theme from './theme';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PatientListTable from './pages/PatientListTable';
import JournalListTable from './pages/JournalListTable';
import TreatmentListTable from './pages/TreatmentListTable';
import DiagnosisListTable from './pages/DiagnosisListTable';
import AgencyListTable from './pages/AgencyListTable';
import JournalCalendar from './pages/JournalCalendar';
import JournalPage from './pages/JournalPage';
import JournalGeneralTab from './components/tabs/JournalGeneralTab';
import JournalDiagnosesTab from './components/tabs/JournalDiagnosesTab';
import JournalTreatmentsTab from './components/tabs/JournalTreatmentsTab';
import JournalFilesTab from './components/tabs/JournalFilesTab';

function App() {
    const [isDrawerOpen, setDrawerOpen] = useState(true);

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
                                <Route index element={<Navigate to="journals-table" replace />} />
                                <Route path="patients" element={<PatientListTable />} />
                                <Route path="treatments" element={<TreatmentListTable />} />
                                <Route path="diagnoses" element={<DiagnosisListTable />} />
                                <Route path="agencies" element={<AgencyListTable />} />
                                <Route path="journals-table" element={<JournalListTable />} />
                                <Route path="journals-calendar" element={<JournalCalendar />} />
                                <Route path="journals/:journalId" element={<JournalPage />}>
                                    <Route index element={<Navigate to="general" replace />} />
                                    <Route path="general" element={<JournalGeneralTab />} />
                                    <Route path="diagnoses" element={<JournalDiagnosesTab />} />
                                    <Route path="services" element={<JournalTreatmentsTab />} />
                                    <Route path="files" element={<JournalFilesTab />} />
                                </Route>
                            </Routes>
                        </Box>
                    </Box>
                </Box>
            </Router>
        </ThemeProvider>
    );
}

export default App;