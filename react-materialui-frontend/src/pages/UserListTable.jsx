import React from 'react';
import EntityListTable from '../components/EntityListTable';
import api from '../utils/http-common';
import UserModal from '../components/modals/UserModal';

const fetchUsers = (query, page, size, sortField, sortOrder) => {
    return api.get('/users', {
        params: {
            searchQuery: query,
            page: page - 1,
            size,
            sortField,
            sortOrder,
        },
    });
};

const UserListTable = () => {
    const columns = [
        { field: 'surname', label: 'Фамилия' },
        { field: 'name', label: 'Имя' },
        { field: 'patronymic', label: 'Отчество' },
        { field: 'phoneNumber', label: 'Телефон' },
        { field: 'email', label: 'Почта' },
        { field: 'username', label: 'Логин' }
    ];

    return (
        <EntityListTable
            title="Сотрудники"
            endpoint="users"
            fetchFunction={fetchUsers}
            ModalComponent={UserModal}
            columns={columns}
            searchPlaceholder="Поиск сотрудника..."
        />
    );
};

export default UserListTable;
