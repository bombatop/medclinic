import React from 'react';
import EntityModal from '../EntityModal';
import JournalForm from '../forms/JournalForm';

const JournalModal = ({ open, handleClose, data }) => {
    return (
        <EntityModal
            open={open}
            handleClose={handleClose}
            journalData={data}
            title="журнал"
            FormComponent={JournalForm}
        />
    );
};

export default JournalModal;
