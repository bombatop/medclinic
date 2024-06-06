import React from 'react';
import EntityListTable from '../components/EntityListTable';
import DiagnosisModal from '../components/modals/DiagnosisModal';
import api from '../utils/http-common';

const fetchDiagnoses = (query, page, size, sortField, sortOrder) => {
    return api.get('/diagnoses', {
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
        { field: 'code', label: 'Код' },
        { field: 'name', label: 'Наименование' },
    ];

    return (
        <EntityListTable
            title="Диагнозы"
            endpoint="diagnoses"
            fetchFunction={fetchDiagnoses}
            ModalComponent={DiagnosisModal}
            columns={columns}
            searchPlaceholder="Поиск диагноза..."
        />
    );
};

export default DiagnosisListTable;
