import React, { useState, useEffect } from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ru';
import dayjs from 'dayjs';
import api from '../utils/http-common';
import {
    Box, Table, TableBody, Button, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Typography,
    Pagination, Select, MenuItem,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import SortableTableCell from '../components/SortableTableCell';
import JournalModal from '../components/modals/JournalModal';
import DebouncedAutocomplete from '../components/DebouncedAutocomplete';
import { statusColors, statusLabels } from '../utils/scheduleSettings';

const JournalListTable = () => {
    const [journals, setJournals] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [sortField, setSortField] = useState('date');
    const [sortOrder, setSortOrder] = useState('asc');
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedJournalId, setSelectedJournalId] = useState(null);
    const navigate = useNavigate();

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
            if (startDate && startDate.isValid()) params.startDate = startDate.format('YYYY-MM-DD HH:mm');
            if (endDate && endDate.isValid()) params.endDate = endDate.format('YYYY-MM-DD HH:mm');
            const response = await api.get('/journals', { params });
            setJournals(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching journals:', error);
        }
    };

    const fetchDoctors = async (query = '') => {
        try {
            const response = await api.get('/doctors', {
                params: { searchQuery: query, page: 0, size: 5 }
            });
            return response.data.content;
        } catch (error) {
            console.error('Error fetching doctors:', error);
            return [];
        }
    };

    const fetchPatients = async (query = '') => {
        try {
            const response = await api.get('/patients', {
                params: { searchQuery: query, page: 0, size: 5 }
            });
            return response.data.content;
        } catch (error) {
            console.error('Error fetching patients:', error);
            return [];
        }
    };

    useEffect(() => {
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

    const handleView = (journalId) => {
        navigate(`/journals/${journalId}`);
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
                    startIcon={<AddIcon />}
                    sx={{ minWidth: 120 }}
                >
                    Создать
                </Button>
                <DebouncedAutocomplete
                    label="Специалист"
                    fetchOptions={fetchDoctors}
                    onChange={setSelectedDoctor}
                    value={selectedDoctor}
                    getOptionLabel={(doctor) => `${doctor.surname} ${doctor.name} ${doctor.patronymic}`}
                    noOptionsText={"Нет данных"}
                    sx={{ width: 300 }}
                    size="small"
                />
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                    <DatePicker
                        label="Начальная дата"
                        value={startDate}
                        maxDate={endDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        sx={{ minWidth: 165 }}
                        slotProps={{ textField: { size: 'small' } }}
                    />
                    <DatePicker
                        label="Конечная дата"
                        value={endDate}
                        minDate={startDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        sx={{ minWidth: 165 }}
                        slotProps={{ textField: { size: 'small' } }}
                    />
                </LocalizationProvider>
                <DebouncedAutocomplete
                    label="Пациент"
                    fetchOptions={fetchPatients}
                    onChange={setSelectedPatient}
                    value={selectedPatient}
                    getOptionLabel={(patient) => `${patient.surname} ${patient.name} ${patient.patronymic}`}
                    noOptionsText={"Нет данных"}
                    sx={{ width: 300, marginLeft: 'auto' }}
                    size="small"
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
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {journals.map((journal) => (
                            <TableRow key={journal.id}>
                                <TableCell>
                                    {journal.doctor.surname + ' ' + journal.doctor.name + ' ' + journal.doctor.patronymic}
                                </TableCell>
                                <TableCell>
                                    {dayjs(journal.date).format('DD.MM.YYYY')}
                                </TableCell>
                                <TableCell>
                                    {dayjs(journal.date).format('HH:mm')}
                                </TableCell>
                                <TableCell>
                                    {journal.timeEnd}
                                </TableCell>
                                <TableCell style={{ color: statusColors[journal.status] }}>
                                    {statusLabels[journal.status]}
                                </TableCell>
                                <TableCell>
                                    {journal.patient.surname + ' ' + journal.patient.name + ' ' + journal.patient.patronymic}
                                </TableCell>
                                <TableCell sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <IconButton onClick={() => handleView(journal.id)}>
                                        <VisibilityIcon />
                                    </IconButton>
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
