import React from 'react';
import EntityModal from '../EntityModal';
import DiagnosisForm from '../forms/DiagnosisForm';

const DiagnosisModal = ({ open, handleClose, entityData }) => {
    return (
        <EntityModal
            open={open}
            handleClose={handleClose}
            entityData={entityData}
            title="диагноз"
            FormComponent={DiagnosisForm}
        />
    );
};

export default DiagnosisModal;
