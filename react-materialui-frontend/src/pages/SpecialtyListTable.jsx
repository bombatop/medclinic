import React from 'react';
import EntityListTable from '../components/EntityListTable';
import SpecialtyModal from '../components/modals/SpecialtyModal';
import api from '../utils/http-common';

const fetchSpecialties = (query, page, size, sortField, sortOrder) => {
    return api.get('/specialties', {
        params: {
            searchQuery: query,
            page: page - 1,
            size,
            sortField,
            sortOrder,
        },
    });
};

const DiagnosisListTable = () => {
    const columns = [
        { field: 'name', label: 'Название' },
    ];

    return (
        <EntityListTable
            title="Специальности"
            endpoint="specialties"
            fetchFunction={fetchSpecialties}
            ModalComponent={SpecialtyModal}
            columns={columns}
            searchPlaceholder="Поиск специальности..."
        />
    );
};

export default DiagnosisListTable;
