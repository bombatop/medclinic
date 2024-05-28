import React from 'react';
import { useOutletContext } from 'react-router-dom';

const JournalTreatmentsTab = () => {
    const { journalData } = useOutletContext();

    return (
        <div>
            Услуги (пусто)
        </div>
    );
};

export default JournalTreatmentsTab;
