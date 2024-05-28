import React from 'react';
import EntityModal from '../EntityModal';
import AgencyForm from '../forms/AgencyForm';

const AgencyModal = ({ open, handleClose, entityData }) => {
    return (
        <EntityModal
            open={open}
            handleClose={handleClose}
            entityData={entityData}
            title="агентство"
            FormComponent={AgencyForm}
        />
    );
};

export default AgencyModal;
