import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Box } from '@mui/material';
import JournalForm from '../forms/JournalForm';

const JournalGeneralTab = () => {
    const { journalData } = useOutletContext();

    return (
        <Box sx={{ width: '100%', maxWidth: 500 }}>
            <JournalForm entityData={journalData} onClose={() => {}} />
        </Box>
    );
};

export default JournalGeneralTab;
