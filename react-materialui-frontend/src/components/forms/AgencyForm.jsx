import React from 'react';
import EntityForm from '../EntityForm';

const agencyFields = [
    { name: 'name', label: 'Название', required: true, type: 'text' }
];

const AgencyForm = ({ entityId, onClose, entityData }) => (
    <EntityForm 
        entityId={entityId}
        endpoint="agencies"
        fields={agencyFields}
        onClose={onClose}
        entityData={entityData}
    />
);

export default AgencyForm;
