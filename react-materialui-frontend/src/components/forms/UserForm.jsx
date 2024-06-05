import React from 'react';
import EntityForm from '../EntityForm';

const userFields = [
    { name: 'surname', label: 'Фамилия', required: true, type: "text" },
    { name: 'name', label: 'Имя', required: true, type: "text" },
    { name: 'patronymic', label: 'Отчество', required: true, type: "text" },
    { name: 'phoneNumber', label: 'Телефон', required: true, type: "text" },
    { name: 'email', label: 'Почта', required: true, type: "text" },
    { name: 'username', label: 'Логин', required: true, type: "text" }
];

const UserForm = ({ entityId, onClose, entityData }) => (
    <EntityForm
        entityId={entityId}
        endpoint="users"
        fields={userFields}
        onClose={onClose}
        entityData={entityData}
    />
);

export default UserForm;
