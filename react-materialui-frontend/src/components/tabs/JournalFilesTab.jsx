import React from 'react';
import { useOutletContext } from 'react-router-dom';

const JournalFilesTab = () => {
    const { journalData } = useOutletContext();

    return (
        <div>
            Файлы (пусто)
        </div>
    );
};

export default JournalFilesTab;
