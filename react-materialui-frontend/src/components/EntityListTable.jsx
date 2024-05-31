import React, { useState, useEffect, useCallback } from 'react';
import api from "../utils/http-common";
import debounce from 'lodash.debounce';
import {
    TableCell, TableContainer, TableHead, TableRow,
    Pagination, Select, MenuItem, CircularProgress,
    Paper, TextField, IconButton, Typography,
    Box, Button, Table, TableBody, InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SortableTableCell from './SortableTableCell';

const EntityListTable = ({ title, endpoint, fetchFunction, ModalComponent, columns, searchPlaceholder }) => {
    const [data, setData] = useState([]);
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [sortField, setSortField] = useState(columns[0].field);
    const [sortOrder, setSortOrder] = useState('asc');

    const fetchData = async (query = '', page = 1, size = 10, sortField = columns[0].field, sortOrder = 'asc') => {
        try {
            const response = await fetchFunction(query, page, size, sortField, sortOrder);
            setData(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    const debouncedFetchData = useCallback(debounce((query) => {
        fetchData(query, page, size, sortField, sortOrder);
    }, 300), [page, size, sortField, sortOrder]);

    useEffect(() => {
        setLoading(true);
        fetchData(searchQuery, page, size, sortField, sortOrder);
    }, [page, size, sortField, sortOrder]);

    useEffect(() => {
        setLoading(true);
        debouncedFetchData(searchQuery);
    }, [searchQuery, debouncedFetchData]);

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
            await api.delete(`/${endpoint}/${id}`);
            fetchData(searchQuery, page, size);
        } catch (error) {
            console.error(`Error deleting ${endpoint}:`, error);
        }
    };

    const handleOpenModal = (id = null) => {
        if (id) {
            const selectedEntity = data.find((item) => item.id === id);
            setSelectedEntity(selectedEntity);
        } else {
            setSelectedEntity(null);
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        fetchData(searchQuery, page, size);
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                {title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => handleOpenModal()} startIcon={<AddIcon />}>
                    Добавить
                </Button>
                <TextField
                    variant="outlined"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{ mb: 2, width: '100%' }}
                    size="small"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {loading && <CircularProgress size={25} />}
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <SortableTableCell
                                    key={column.field}
                                    field={column.field}
                                    sortField={sortField}
                                    sortOrder={sortOrder}
                                    handleSort={handleSort}
                                >
                                    {column.label}
                                </SortableTableCell>
                            ))}
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                {columns.map((column) => (
                                    <TableCell key={column.field}>{column.format ? column.format(item[column.field]) : item[column.field]}</TableCell>
                                ))}
                                <TableCell sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <IconButton onClick={() => handleOpenModal(item.id)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(item.id)}>
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
            <ModalComponent open={modalOpen} handleClose={handleCloseModal} entityData={selectedEntity}/>
        </Box>
    );
};

export default EntityListTable;

