import React from 'react';
import EntityModal from '../EntityModal';
import TreatmentForm from '../forms/TreatmentForm';

const TreatmentModal = ({ open, handleClose, entityData }) => {
    return (
        <EntityModal
            open={open}
            handleClose={handleClose}
            entityData={entityData}
            title="услугу"
            FormComponent={TreatmentForm}
        />
    );
};

export default TreatmentModal;
