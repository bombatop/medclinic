import React from 'react';
import EntityModal from '../EntityModal';
import PatientForm from '../forms/PatientForm';

const PatientModal = ({ open, handleClose, entityData }) => {
    return (
        <EntityModal
            open={open}
            handleClose={handleClose}
            entityData={entityData}
            title="пациента"
            FormComponent={PatientForm}
        />
    );
};

export default PatientModal;
