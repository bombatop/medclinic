import React from 'react';
import EntityForm from '../EntityForm';

const specialtyFields = [
    { name: 'name', label: 'Название', required: true, type: 'text' }
];

const SpecialtyForm = ({ entityId, onClose, entityData }) => (
    <EntityForm
        entityId={entityId}
        endpoint="specialties"
        fields={specialtyFields}
        onClose={onClose}
        entityData={entityData}
    />
);

export default SpecialtyForm;
