import React, { useState, useEffect, useCallback } from 'react';
import api from "../utils/http-common";
import debounce from 'lodash.debounce';
import dayjs from 'dayjs';

import {
    TableCell, TableContainer, TableHead, TableRow,
    Pagination, Select, MenuItem, CircularProgress,
    Paper, TextField, IconButton, Typography,
    Box, Button, Table, TableBody, InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import PatientModal from '../components/PatientModal';
import SortableTableCell from '../components/SortableTableCell';

const PatientsListTable = () => {
    const [patients, setPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [sortField, setSortField] = useState('surname');
    const [sortOrder, setSortOrder] = useState('asc');


    const fetchPatients = async (query = '', page = 1, size = 10, sortField = 'surname', sortOrder = 'asc') => {
        try {
            const response = await api.get('/patients', {
                params: {
                    searchQuery: query,
                    page: page - 1,
                    size,
                    sortField,
                    sortOrder,
                },
            });
            setPatients(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
        setLoading(false);
    };

    const debouncedFetchPatients = useCallback(debounce((query) => {
        fetchPatients(query, page, size, sortField, sortOrder);
    }, 300), [page, size, sortField, sortOrder]);

    useEffect(() => {
        setLoading(true);
        fetchPatients(searchQuery, page, size, sortField, sortOrder);
    }, [page, size, sortField, sortOrder]);

    useEffect(() => {
        setLoading(true);
        debouncedFetchPatients(searchQuery);
    }, [searchQuery, debouncedFetchPatients]);

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
            await api.delete(`/patients/${id}`);
            fetchPatients(searchQuery, page, size);
        } catch (error) {
            console.error('Error deleting patient:', error);
        }
    };

    const handleOpenModal = (patientId = null) => {
        setSelectedPatientId(patientId);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        fetchPatients(searchQuery, page, size);
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Картотека
            </Typography>
            <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => handleOpenModal()}>
                Добавить пациента
            </Button>
            <TextField
                variant="outlined"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ mb: 2, width: '100%' }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {loading && <CircularProgress size={25} />}
                        </InputAdornment>
                    ),
                }}
            />
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <SortableTableCell field="surname" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort}>
                                Фамилия
                            </SortableTableCell>
                            <SortableTableCell field="name" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort}>
                                Имя
                            </SortableTableCell>
                            <SortableTableCell field="patronymic" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort}>
                                Отчество
                            </SortableTableCell>
                            <SortableTableCell field="birthDate" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort}>
                                Дата рождения
                            </SortableTableCell>
                            <SortableTableCell field="phoneNumber" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort}>
                                Телефон
                            </SortableTableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((patient) => (
                            <TableRow key={patient.id}>
                                <TableCell>{patient.surname}</TableCell>
                                <TableCell>{patient.name}</TableCell>
                                <TableCell>{patient.patronymic}</TableCell>
                                <TableCell>{dayjs(patient.birthDate).format('DD.MM.YYYY')}</TableCell>
                                <TableCell>{patient.phoneNumber}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenModal(patient.id)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(patient.id)}>
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
            <PatientModal open={modalOpen} handleClose={handleCloseModal} patientId={selectedPatientId} />
        </Box>
    );
};

export default PatientsListTable;
