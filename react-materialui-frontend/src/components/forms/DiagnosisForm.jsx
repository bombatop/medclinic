import React from 'react';
import EntityForm from '../EntityForm';

const diagnosisFields = [
    { name: 'code', label: 'Код', required: true, type: 'text' },
    { name: 'name', label: 'Название', required: true, type: 'text' }
];

const DiagnosisForm = ({ entityId, onClose, entityData }) => (
    <EntityForm
        entityId={entityId}
        endpoint="diagnoses"
        fields={diagnosisFields}
        onClose={onClose}
        entityData={entityData}
    />
);

export default DiagnosisForm;
