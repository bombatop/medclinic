import React from 'react';
import EntityListTable from '../components/EntityListTable';
import AgencyModal from '../components/modals/AgencyModal';
import api from '../utils/http-common';

const fetchAgencies = (query, page, size, sortField, sortOrder) => {
    return api.get('/agencies', {
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
            title="Страховые агентства"
            endpoint="agencies"
            fetchFunction={fetchAgencies}
            ModalComponent={AgencyModal}
            columns={columns}
            searchPlaceholder="Поиск агентства..."
        />
    );
};

export default DiagnosisListTable;
