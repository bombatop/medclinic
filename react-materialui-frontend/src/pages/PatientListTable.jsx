import React, { useState, useEffect } from 'react';
import api from "../utils/http-common";
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    IconButton,
    Typography,
    Pagination,
    Select,
    MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PatientModal from '../components/PatientModal';

const PatientsListTable = () => {
    const [patients, setPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const fetchPatients = async (query = '', page = 1, size = 10) => {
        setLoading(true);
        try {
            const response = await api.get('/patients', {
                params: {
                    searchQuery: query,
                    page: page - 1,
                    size,
                },
            });
            setPatients(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPatients(searchQuery, page, size);
    }, [searchQuery, page, size]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setPage(1); // Reset to first page on search
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
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Фамилия</TableCell>
                            <TableCell>Имя</TableCell>
                            <TableCell>Отчество</TableCell>
                            <TableCell>Дата рождения</TableCell>
                            <TableCell>Телефон</TableCell>
                            <TableCell>E-mail</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((patient) => (
                            <TableRow key={patient.id}>
                                <TableCell>{patient.surname}</TableCell>
                                <TableCell>{patient.name}</TableCell>
                                <TableCell>{patient.patronymic}</TableCell>
                                <TableCell>{patient.birthDate}</TableCell>
                                <TableCell>{patient.phoneNumber}</TableCell>
                                <TableCell>{patient.email}</TableCell>
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
            {loading && <Typography>Загрузка...</Typography>}
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
