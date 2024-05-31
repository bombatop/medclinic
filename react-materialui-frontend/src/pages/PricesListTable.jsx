import React, { useState, useEffect, useCallback } from 'react';
import api from "../utils/http-common";
import debounce from 'lodash.debounce';
import {
    Box, Table, TableBody, Button, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Typography,
    Pagination, Select, MenuItem, CircularProgress, TextField, InputAdornment
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import SortableTableCell from '../components/SortableTableCell';
import DebouncedAutocomplete from '../components/DebouncedAutocomplete';

const fetchPrices = (agencyId, query, page, size, sortField, sortOrder, latestOnly) => {
    const params = {
        searchQuery: query,
        page: page - 1,
        size,
        sortField,
        sortOrder,
        latestOnly,
    };
    if (agencyId !== null) {
        params.agencyId = agencyId;
    }
    console.log('fetch', params);
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

const PricesListTable = () => {
    const [prices, setPrices] = useState([]);
    const [selectedAgency, setSelectedAgency] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [sortField, setSortField] = useState('date');
    const [sortOrder, setSortOrder] = useState('asc');
    const [latestOnly, setLatestOnly] = useState(true);

    const fetchData = async (agencyId, query = '', page = 1, size = 10, sortField = 'date', sortOrder = 'asc', latestOnly = true) => {
        setLoading(true);
        try {
            const response = await fetchPrices(agencyId, query, page, size, sortField, sortOrder, latestOnly);
            setPrices(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    const debouncedFetchData = useCallback(debounce((agencyId, query, latestOnly) => {
        fetchData(agencyId, query, page, size, sortField, sortOrder, latestOnly);
    }, 300), [page, size, sortField, sortOrder, latestOnly]);

    useEffect(() => {
        if (selectedAgency) {
            fetchData(selectedAgency.id, searchQuery, page, size, sortField, sortOrder, latestOnly);
        } else {
            fetchData(null, searchQuery, page, size, sortField, sortOrder, latestOnly);
        }
    }, [page, size, sortField, sortOrder, selectedAgency, latestOnly]);

    useEffect(() => {
        debouncedFetchData(selectedAgency ? selectedAgency.id : null, searchQuery, latestOnly);
    }, [searchQuery, debouncedFetchData, selectedAgency, latestOnly]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setPage(1);
    };

    const handleSort = (field) => {
        const isAsc = sortField === field && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortField(field);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/prices/${id}`);
            fetchData(selectedAgency ? selectedAgency.id : null, searchQuery, page, size, sortField, sortOrder, latestOnly);
        } catch (error) {
            console.error('Error deleting price:', error);
        }
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
                    sx={{ width: 300 }}
                    size="small"
                />
                <TextField
                    variant="outlined"
                    placeholder="Наименование или код услуги"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{ width: '100%' }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {loading && <CircularProgress size={25} />}
                            </InputAdornment>
                        ),
                    }}
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
                                Услуга
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
            {/* <PriceModal open={modalOpen} handleClose={handleCloseModal} priceData={selectedPrice} agency={selectedAgency} /> */}
        </Box>
    );
};

export default PricesListTable;
