import React from 'react';
import EntityModal from '../EntityModal';
import UserForm from '../forms/UserForm';

const UserModal = ({ open, handleClose, entityData }) => {
    return (
        <EntityModal
            open={open}
            handleClose={handleClose}
            entityData={entityData}
            title="пациента"
            FormComponent={UserForm}
        />
    );
};

export default UserModal;
