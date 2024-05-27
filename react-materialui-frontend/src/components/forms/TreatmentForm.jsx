import React from 'react';
import EntityForm from '../EntityForm';

const treatmentFields = [
    { name: 'code', label: 'Код', required: true, type: 'text' },
    { name: 'name', label: 'Название', required: true, type: 'text' }
];

const TreatmentForm = ({ entityId, onClose, entityData }) => (
    <EntityForm
        entityId={entityId}
        endpoint="treatments"
        fields={treatmentFields}
        onClose={onClose}
        entityData={entityData}
    />
);

export default TreatmentForm;
