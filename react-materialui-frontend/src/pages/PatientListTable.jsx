import React from 'react';
import EntityListTable from '../components/EntityListTable';
import PatientModal from '../components/modals/PatientModal';
import api from '../utils/http-common';
import dayjs from 'dayjs';

const fetchPatients = (query, page, size, sortField, sortOrder) => {
    return api.get('/patients', {
        params: {
            searchQuery: query,
            page: page - 1,
            size,
            sortField,
            sortOrder,
        },
    });
};

const PatientsListTable = () => {
    const columns = [
        { field: 'surname', label: 'Фамилия' },
        { field: 'name', label: 'Имя' },
        { field: 'patronymic', label: 'Отчество' },
        { field: 'birthDate', label: 'Дата рождения', format: (value) => dayjs(value).format('DD.MM.YYYY') },
        { field: 'phoneNumber', label: 'Телефон' },
    ];

    return (
        <EntityListTable
            title="Картотека"
            endpoint="patients"
            fetchFunction={fetchPatients}
            ModalComponent={PatientModal}
            columns={columns}
            searchPlaceholder="Поиск пациента..."
        />
    );
};

export default PatientsListTable;
