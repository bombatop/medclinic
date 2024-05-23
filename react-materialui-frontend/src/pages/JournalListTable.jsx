import React, { useState, useEffect, useCallback } from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ru';
import dayjs from 'dayjs';
import api from '../utils/http-common';
import debounce from 'lodash.debounce';

import {
    Box, Table, TableBody, Button,
    TableCell, TableContainer,
    TableHead, TableRow, Paper,
    TextField, IconButton,
    Typography, Pagination,
    Select, MenuItem,
    CircularProgress,
    Autocomplete
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';

import SortableTableCell from '../components/SortableTableCell';
import JournalModal from '../components/JournalModal';

const statusColors = {
    SCHEDULED: 'orange',
    COMPLETED: 'green',
    CANCELLED: 'gray'
};

const statusLabels = {
    SCHEDULED: 'Запланировано',
    COMPLETED: 'Проведено',
    CANCELLED: 'Отменено'
};

const JournalListTable = () => {
    const [journals, setJournals] = useState([]);

    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [sortField, setSortField] = useState('date');
    const [sortOrder, setSortOrder] = useState('asc');

    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(null);

    const [patients, setPatients] = useState([]);
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const [doctors, setDoctors] = useState([]);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedJournalId, setSelectedJournalId] = useState(null);

    const fetchJournals = async (page = 1, size = 10, sortField = 'date', sortOrder = 'asc') => {
        try {
            const params = {
                page: page - 1,
                size,
                sortField,
                sortOrder,
                doctorId: selectedDoctor ? selectedDoctor.id : '',
                patientId: selectedPatient ? selectedPatient.id : ''
            };
            if (startDate && startDate.isValid()) params.startDate = startDate.format('YYYY-MM-DDTHH:mm');
            if (endDate && endDate.isValid()) params.endDate = endDate.format('YYYY-MM-DDTHH:mm');
            const response = await api.get('/journals', { params });
            setJournals(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching journals:', error);
        }
        setLoading(false);
    };

    const fetchDoctors = async (query = '') => {
        setLoadingDoctors(true);
        try {
            const response = await api.get('/doctors', {
                params: { searchQuery: query, page: 0, size: 7 }
            });
            setDoctors(response.data.content);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
        setLoadingDoctors(false);
    };

    const fetchPatients = async (query = '') => {
        try {
            const response = await api.get('/patients', {
                params: { searchQuery: query, page: 0, size: 7 }
            });
            setPatients(response.data.content);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
        setLoadingPatients(false);
    };

    const debouncedFetchDoctors = useCallback(debounce((query) => {
        fetchDoctors(query);
    }, 300), []);

    const debouncedFetchPatients = useCallback(debounce((query) => {
        fetchPatients(query);
    }, 300), []);

    useEffect(() => {
        fetchPatients();
    }, []);

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchJournals(page, size, sortField, sortOrder);
    }, [page, size, sortField, sortOrder, selectedDoctor, selectedPatient, startDate, endDate]);

    const handleSort = (field) => {
        const isAsc = sortField === field && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortField(field);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/journals/${id}`);
            fetchJournals(page, size, sortField, sortOrder);
        } catch (error) {
            console.error('Error deleting journal:', error);
        }
    };
    
    const handleOpenModal = (journalId = null) => {
        setSelectedJournalId(journalId);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        fetchJournals(page, size, sortField, sortOrder);
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Записи
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal(null)}
                >
                    Создать
                </Button>
                <Autocomplete
                    options={doctors}
                    getOptionLabel={(doctor) => `${doctor.surname} ${doctor.name} ${doctor.patronymic}`}
                    value={selectedDoctor}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onInputChange={(event, newInputValue) => {
                        setLoadingDoctors(true);
                        debouncedFetchDoctors(newInputValue);
                    }}
                    onChange={(event, newValue) => {
                        setSelectedDoctor(newValue);
                    }}
                    loading={loadingDoctors}
                    loadingText={"Поиск..."}
                    noOptionsText={"Нет данных"}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Специалист"
                            variant="outlined"
                            sx={{ width: 300, minWidth: 150 }}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loadingDoctors ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                    <DatePicker
                        label="Начальная дата"
                        value={startDate}
                        maxDate={endDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        sx={{ minWidth: 150 }}
                    />
                    <DatePicker
                        label="Конечная дата"
                        value={endDate}
                        minDate={startDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        sx={{ minWidth: 150 }}
                    />
                </LocalizationProvider>
                <Autocomplete sx={{ marginLeft: 'auto' }}
                    options={patients}
                    getOptionLabel={(patient) => `${patient.surname} ${patient.name} ${patient.patronymic}`}
                    value={selectedPatient}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onInputChange={(event, newInputValue) => {
                        setLoadingPatients(true);
                        debouncedFetchPatients(newInputValue);
                    }}
                    onChange={(event, newValue) => {
                        setSelectedPatient(newValue);
                    }}
                    loading={loadingPatients}
                    loadingText={"Поиск..."}
                    noOptionsText={"Нет данных"}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Пациент"
                            variant="outlined"
                            sx={{ width: 300, minWidth: 150 }}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loadingPatients ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                />
            </Box>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <SortableTableCell field="doctor.name" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort}>
                                Специалист
                            </SortableTableCell>
                            <SortableTableCell field="date" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort}>
                                Дата начала
                            </SortableTableCell>
                            <SortableTableCell field="date" handleSort={handleSort}>
                                Время начала
                            </SortableTableCell>
                            <SortableTableCell field="timeEnd" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort}>
                                Время окончания
                            </SortableTableCell>
                            <SortableTableCell field="status" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort}>
                                Статус
                            </SortableTableCell>
                            <SortableTableCell field="patient.name" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort}>
                                Пациент
                            </SortableTableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {journals.map((journal) => (
                            <TableRow key={journal.id}>
                                <TableCell>{journal.doctor.surname + ' ' + journal.doctor.name + ' ' + journal.doctor.patronymic}</TableCell>
                                <TableCell>{dayjs(journal.date).format('DD.MM.YYYY')}</TableCell>
                                <TableCell>{dayjs(journal.date).format('HH:mm')}</TableCell>
                                <TableCell>{journal.timeEnd}</TableCell>
                                <TableCell style={{ color: statusColors[journal.status] }}>
                                    {statusLabels[journal.status]}
                                </TableCell>
                                <TableCell>{journal.patient.surname + ' ' + journal.patient.name + ' ' + journal.patient.patronymic}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenModal(journal.id)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(journal.id)}>
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
            <JournalModal open={modalOpen} handleClose={handleCloseModal}
                data={journals.find(journal => journal.id === selectedJournalId)} journalId={selectedJournalId} />
        </Box>
    );
};

export default JournalListTable;