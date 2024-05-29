import React from 'react';
import { useOutletContext } from 'react-router-dom';
import JournalForm from '../forms/JournalForm';

const JournalGeneralTab = () => {
    const { journalData, setJournalData } = useOutletContext();

    return (
        <JournalForm
            entityData={journalData}
            onClose={() => { }}
        />
    );
};

export default JournalGeneralTab;
