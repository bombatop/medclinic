import React from 'react';
import EntityListTable from '../components/EntityListTable';
import TreatmentModal from '../components/modals/TreatmentModal';
import api from '../utils/http-common';

const fetchTreatments = (query, page, size, sortField, sortOrder) => {
    return api.get('/treatments', {
        params: {
            searchQuery: query,
            page: page - 1,
            size,
            sortField,
            sortOrder,
        },
    });
};

const TreatmentListTable = () => {
    const columns = [
        { field: 'code', label: 'Код' },
        { field: 'name', label: 'Наименование' },
    ];

    return (
        <EntityListTable
            title="Услуги"
            endpoint="treatments"
            fetchFunction={fetchTreatments}
            ModalComponent={TreatmentModal}
            columns={columns}
            searchPlaceholder="Поиск услуги..."
        />
    );
};

export default TreatmentListTable;
