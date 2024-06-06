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
import SpecialtyListTable from './pages/SpecialtyListTable';
import AgencyListTable from './pages/AgencyListTable';
import PricesListTable from './pages/PricesListTable';
import JournalPage from './pages/JournalDetails';
import JournalCalendar from './pages/JournalCalendar';
import JournalGeneralTab from './components/tabs/JournalGeneralTab';
import JournalDiagnosesTab from './components/tabs/JournalDiagnosesTab';
import JournalTreatmentsTab from './components/tabs/JournalTreatmentsTab';
import JournalFilesTab from './components/tabs/JournalFilesTab';
import JournalLinkTab from './components/tabs/JournalLinkTab';
import UserListTable from './pages/UserListTable';
import UserDetails from './pages/UserDetails';

import AuthTabs from './pages/AuthTabs';
import PublicRoute from './components/PublicRoute';

function App() {
    const [isDrawerOpen, setDrawerOpen] = useState(true);
    const auth = useSelector((state) => state.auth);

    const toggleDrawer = () => {
        setDrawerOpen(!isDrawerOpen);
    };

    const ProtectedRoute = ({ children }) => {
        if (!auth.token) {
            return <Navigate to="/auth" replace />;
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
                                <Route path="auth" element={<PublicRoute><AuthTabs /></PublicRoute>} />
                                <Route
                                    path="/*"
                                    element={
                                        <ProtectedRoute>
                                            <Routes>
                                                <Route index element={<Navigate to="journals-table" replace />} />
                                                <Route path="patients" element={<PatientListTable />} />
                                                <Route path="treatments" element={<TreatmentListTable />} />
                                                <Route path="diagnoses" element={<DiagnosisListTable />} />
                                                <Route path="specialties" element={<SpecialtyListTable />} />
                                                <Route path="agencies" element={<AgencyListTable />} />
                                                <Route path="prices" element={<PricesListTable />} />
                                                <Route path="users" element={<UserListTable />} />
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
                                                <Route path="users/:userId" element={<UserDetails />} />
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
