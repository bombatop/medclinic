import React from 'react';
import EntityModal from '../EntityModal';
import SpecialtyForm from '../forms/SpecialtyForm';

const SpecialtyModal = ({ open, handleClose, entityData }) => {
    return (
        <EntityModal
            open={open}
            handleClose={handleClose}
            entityData={entityData}
            title="специальность"
            FormComponent={SpecialtyForm}
        />
    );
};

export default SpecialtyModal;
