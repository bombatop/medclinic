import React, { useState, useEffect } from 'react';
import api from "../utils/http-common";
import {
    Box, Table, TableBody, Button, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Typography,
    Pagination, Select, MenuItem
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Add as AddIcon
} from '@mui/icons-material';
import SortableTableCell from '../components/SortableTableCell';
import DebouncedAutocomplete from '../components/DebouncedAutocomplete';
import PriceModal from '../components/modals/PriceModal';

const fetchPrices = (agencyId, treatmentId, page, size, sortField, sortOrder, latestOnly) => {
    const params = {
        page: page - 1,
        size,
        sortField,
        sortOrder,
        latestOnly,
    };
    if (agencyId !== null) {
        params.agencyId = agencyId;
    }
    if (treatmentId !== null) {
        params.treatmentId = treatmentId;
    }

    console.log('Fetching prices with params:', params); // Log parameters for debugging

    return api.get('/prices', { params });
};

const fetchAgencies = async (query = '') => {
    try {
        const response = await api.get('/agencies', {
            params: { searchQuery: query, page: 0, size: 5 }
        });
        return response.data.content;
    } catch (error) {
        console.error('Error fetching agencies:', error);
        return [];
    }
};

const fetchTreatments = async (query = '') => {
    try {
        const response = await api.get('/treatments', {
            params: { searchQuery: query, page: 0, size: 5 }
        });
        return response.data.content;
    } catch (error) {
        console.error('Error fetching treatments:', error);
        return [];
    }
};

const PricesListTable = () => {
    const [prices, setPrices] = useState([]);
    const [selectedAgency, setSelectedAgency] = useState(null);
    const [selectedTreatment, setSelectedTreatment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [sortField, setSortField] = useState('agency.name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [latestOnly, setLatestOnly] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    const fetchData = async (agencyId, treatmentId, page = 1, size = 10, sortField = 'agency.name', sortOrder = 'asc', latestOnly = true) => {
        setLoading(true);
        try {
            const response = await fetchPrices(agencyId, treatmentId, page, size, sortField, sortOrder, latestOnly);
            setPrices(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData(
            selectedAgency?.id ?? null,
            selectedTreatment?.id ?? null,
            page, size, sortField, sortOrder, latestOnly
        );
    }, [page, size, sortField, sortOrder, selectedAgency, selectedTreatment, latestOnly]);

    const handleSort = (field) => {
        const isAsc = sortField === field && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortField(field);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/prices/${id}`);
            fetchData(selectedAgency?.id, selectedTreatment?.id, page, size, sortField, sortOrder, latestOnly);
        } catch (error) {
            console.error('Error deleting price:', error);
        }
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Цены
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    sx={{ minWidth: 120 }}
                    disabled={!selectedAgency}
                    onClick={handleOpenModal}
                >
                    Добавить
                </Button>
                <DebouncedAutocomplete
                    label="Агентство"
                    fetchOptions={fetchAgencies}
                    onChange={setSelectedAgency}
                    value={selectedAgency}
                    getOptionLabel={(agency) => agency.name}
                    noOptionsText={"Нет данных"}
                    sx={{ width: 400 }}
                    size="small"
                />
                <DebouncedAutocomplete
                    label="Услуга"
                    fetchOptions={fetchTreatments}
                    onChange={setSelectedTreatment}
                    value={selectedTreatment}
                    getOptionLabel={(treatment) => `${treatment.code} ${treatment.name}`}
                    noOptionsText={"Нет данных"}
                    sx={{ minWidth: 300 }}
                    fullWidth
                    size="small"
                />
                <Select
                    value={latestOnly}
                    onChange={(event) => setLatestOnly(event.target.value)}
                    sx={{ width: 200, minWidth: 200 }}
                    fullWidth
                    size="small"
                >
                    <MenuItem value={true}>Только последние</MenuItem>
                    <MenuItem value={false}>Все даты</MenuItem>
                </Select>
            </Box>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <SortableTableCell field="treatment.code" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort}>
                                Код услуги
                            </SortableTableCell>
                            <SortableTableCell field="treatment.name" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort}>
                                Наименование услуги
                            </SortableTableCell>
                            <SortableTableCell field="agency.name" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort}>
                                Агентство
                            </SortableTableCell>
                            <SortableTableCell field="date" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort}>
                                Дата
                            </SortableTableCell>
                            <SortableTableCell field="price" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort}>
                                Цена
                            </SortableTableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {prices.map((price) => (
                            <TableRow key={price.id}>
                                <TableCell>
                                    {price.treatment.code}
                                </TableCell>
                                <TableCell>
                                    {price.treatment.name}
                                </TableCell>
                                <TableCell>
                                    {price.agency.name}
                                </TableCell>
                                <TableCell>
                                    {new Date(price.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {price.price}
                                </TableCell>
                                <TableCell sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <IconButton onClick={() => handleDelete(price.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                />
                <Select
                    value={size}
                    onChange={(event) => setSize(event.target.value)}
                >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                </Select>
            </Box>
            <PriceModal
                open={modalOpen}
                onClose={handleCloseModal}
                selectedAgency={selectedAgency}
            />
        </Box>
    );
};

export default PricesListTable;