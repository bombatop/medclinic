import React from 'react';
import EntityForm from '../EntityForm';

const patientFields = [
    { name: 'surname', label: 'Фамилия', required: true, type: 'text' },
    { name: 'name', label: 'Имя', required: true, type: 'text' },
    { name: 'patronymic', label: 'Отчество', type: 'text' },
    { name: 'birthDate', label: 'Дата рождения', required: true, type: 'date' },
    { name: 'phoneNumber', label: 'Телефон', required: true, type: 'text' }
];

const PatientForm = ({ entityId, onClose, entityData }) => (
    <EntityForm
        entityId={entityId}
        endpoint="patients"
        fields={patientFields}
        onClose={onClose}
        entityData={entityData}
    />
);

export default PatientForm;
