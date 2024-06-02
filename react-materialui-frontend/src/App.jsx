import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { useSelector } from 'react-redux';
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
import PricesListTable from './pages/PricesListTable';
import JournalCalendar from './pages/JournalCalendar';
import JournalPage from './pages/JournalPage';
import JournalGeneralTab from './components/tabs/JournalGeneralTab';
import JournalDiagnosesTab from './components/tabs/JournalDiagnosesTab';
import JournalTreatmentsTab from './components/tabs/JournalTreatmentsTab';
import JournalFilesTab from './components/tabs/JournalFilesTab';
import JournalLinkTab from './components/tabs/JournalLinkTab';

import Signup from './pages/Signup';
import Login from './pages/Login';

function App() {
    const [isDrawerOpen, setDrawerOpen] = useState(true);
    const auth = useSelector((state) => state.auth);

    const toggleDrawer = () => {
        setDrawerOpen(!isDrawerOpen);
    };

    const ProtectedRoute = ({ children }) => {
        if (!auth.token) {
            return <Navigate to="/login" replace />;
        }
        return children;
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Box sx={{ display: 'flex', height: '100vh' }}>
                    {auth.token && <Header toggleDrawer={toggleDrawer} />}
                    <Box sx={{ display: 'flex', flexGrow: 1, pt: auth.token ? '64px' : '0' }}>
                        {auth.token && <Sidebar isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />}
                        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                            <Routes>
                                <Route path="signup" element={<Signup />} />
                                <Route path="login" element={<Login />} />
                                <Route
                                    path="/*"
                                    element={
                                        <ProtectedRoute>
                                            <Routes>
                                                <Route index element={<Navigate to="journals-table" replace />} />
                                                <Route path="patients" element={<PatientListTable />} />
                                                <Route path="treatments" element={<TreatmentListTable />} />
                                                <Route path="diagnoses" element={<DiagnosisListTable />} />
                                                <Route path="agencies" element={<AgencyListTable />} />
                                                <Route path="prices" element={<PricesListTable />} />
                                                <Route path="journals-table" element={<JournalListTable />} />
                                                <Route path="journals-calendar" element={<JournalCalendar />} />
                                                <Route path="journals/:journalId" element={<JournalPage />}>
                                                    <Route index element={<Navigate to="general" replace />} />
                                                    <Route path="general" element={<JournalGeneralTab />} />
                                                    <Route path="diagnoses" element={<JournalDiagnosesTab />} />
                                                    <Route path="services" element={<JournalTreatmentsTab />} />
                                                    <Route path="files" element={<JournalFilesTab />} />
                                                    <Route path="links" element={<JournalLinkTab />} />
                                                </Route>
                                            </Routes>
                                        </ProtectedRoute>
                                    }
                                />
                            </Routes>
                        </Box>
                    </Box>
                </Box>
            </Router>
        </ThemeProvider>
    );
}

export default App;