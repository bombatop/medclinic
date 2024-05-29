import React, { useState, useEffect } from 'react';
import { useParams, Link, Outlet } from 'react-router-dom';
import { Box, Tabs, Tab, Typography, CircularProgress } from '@mui/material';
import api from '../utils/http-common';

const JournalPage = () => {
    const { journalId } = useParams();
    const [value, setValue] = useState(0);
    const [journalData, setJournalData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJournalData = async () => {
            try {
                const response = await api.get(`/journals/${journalId}`);
                setJournalData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching journal data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJournalData();
    }, [journalId]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h4" gutterBottom>
                Запись {journalId}
            </Typography>
            <Tabs value={value} onChange={handleChange} aria-label="journal tabs">
                <Tab label="Общее" component={Link} to={`/journals/${journalId}/general`} />
                <Tab label="Диагнозы" component={Link} to={`/journals/${journalId}/diagnoses`} />
                <Tab label="Услуги" component={Link} to={`/journals/${journalId}/services`} />
                <Tab label="Файлы" component={Link} to={`/journals/${journalId}/files`} />
            </Tabs>
            <Box sx={{ p: 2 }}>
                <Outlet context={{ journalData }} />
            </Box>
        </Box>
    );
};

export default JournalPage;
