import React from 'react';
import { useOutletContext } from 'react-router-dom';

const JournalDiagnosesTab = () => {
    const { journalData } = useOutletContext();

    return (
        <div>
            Диагнозы (пусто)
        </div>
    );
};

export default JournalDiagnosesTab;
