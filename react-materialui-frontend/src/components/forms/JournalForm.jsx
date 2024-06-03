import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, FormControl, CircularProgress, MenuItem, Select, InputLabel, Typography } from '@mui/material';
import { LocalizationProvider, DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ru';
import dayjs from 'dayjs';
import api from '../../utils/http-common';
import DebouncedAutocomplete from '../DebouncedAutocomplete';
import { statusColors, statusLabels } from '../../utils/scheduleSettings';

const JournalForm = ({ entityData, onClose }) => {
    const [journal, setJournal] = useState({
        patientId: '',
        userId: '',
        date: dayjs(),
        timeEnd: dayjs().add(1, 'hour'),
        status: 'SCHEDULED'
    });

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [errors, setErrors] = useState({});

    const patientRef = useRef();
    const doctorRef = useRef();
    const dateRef = useRef();
    const timeEndRef = useRef();

    const navigate = useNavigate();

    const fetchDoctors = async (query = '') => {
        try {
            const response = await api.get('/users', {
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
        if (entityData) {
            setJournal({
                patientId: entityData.patient.id || '',
                userId: entityData.doctor.id || '',
                date: entityData.date ? dayjs(entityData.date) : dayjs(),
                timeEnd: entityData.timeEnd ? dayjs(entityData.timeEnd, 'HH:mm') : dayjs().add(1, 'hour'),
                status: entityData.status || 'SCHEDULED'
            });
            setSelectedPatient(entityData.patient);
            setSelectedDoctor(entityData.doctor);
            console.log("толя иди нахуй");
        }
    }, [entityData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJournal(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDateChange = (date) => {
        setJournal(prevState => ({
            ...prevState,
            date: date
        }));
    };

    const handleTimeChange = (time) => {
        setJournal(prevState => ({
            ...prevState,
            timeEnd: time
        }));
    };

    const validate = () => {
        let tempErrors = {};
        if (!journal.patientId) {
            tempErrors.patientId = "Пожалуйста, выберите пациента.";
        }
        if (!journal.userId) {
            tempErrors.userId = "Пожалуйста, выберите доктора.";
        }
        if (!journal.date || !journal.date.isValid()) {
            tempErrors.date = "Пожалуйста, выберите дату и время начала.";
        }
        if (!journal.timeEnd || !journal.timeEnd.isValid()) {
            tempErrors.timeEnd = "Пожалуйста, выберите время окончания.";
        }
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const request = entityData?.id
                ? api.put(`/journals/${entityData.id}`, {
                    ...journal,
                    date: journal.date.format('YYYY-MM-DDTHH:mm'),
                    timeEnd: journal.timeEnd.format('HH:mm')
                })
                : api.post('/journals', {
                    ...journal,
                    date: journal.date.format('YYYY-MM-DDTHH:mm'),
                    timeEnd: journal.timeEnd.format('HH:mm')
                });

            request
                .then(response => {
                    onClose();
                })
                .catch(error => console.error('Error saving journal:', error));
        }
    };

    const handleNavigateToJournal = () => {
        navigate(`/journals/${entityData.id}`);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl error={!!errors.patientId}>
                    <DebouncedAutocomplete
                        label="Пациент"
                        fetchOptions={fetchPatients}
                        value={selectedPatient}
                        onChange={(newValue) => {
                            setSelectedPatient(newValue);
                            setJournal(prevState => ({
                                ...prevState,
                                patientId: newValue ? newValue.id : ''
                            }));
                        }}
                        getOptionKey={(patient) => `${patient.id}`}
                        getOptionLabel={(patient) => `${patient.surname} ${patient.name} ${patient.patronymic}`}
                        noOptionsText="Нет данных"
                        required
                        inputRef={patientRef}
                        error={!!errors.patientId}
                        helperText={errors.patientId}
                        size="small"
                    />
                </FormControl>
                <FormControl error={!!errors.userId}>
                    <DebouncedAutocomplete
                        label="Доктор"
                        fetchOptions={fetchDoctors}
                        value={selectedDoctor}
                        onChange={(newValue) => {
                            setSelectedDoctor(newValue);
                            setJournal(prevState => ({
                                ...prevState,
                                userId: newValue ? newValue.id : ''
                            }));
                        }}
                        getOptionKey={(doctor) => `${doctor.id}`}
                        getOptionLabel={(doctor) => `${doctor.surname} ${doctor.name} ${doctor.patronymic}`}
                        noOptionsText="Нет данных"
                        required
                        inputRef={doctorRef}
                        error={!!errors.userId}
                        helperText={errors.userId}
                        size="small"
                    />
                </FormControl>
                <FormControl error={!!errors.date}>
                    <DateTimePicker
                        label="Дата"
                        value={journal.date}
                        onChange={handleDateChange}
                        textField={(params) => (
                            <TextField {...params} required error={!!errors.date} helperText={errors.date} inputRef={dateRef} size="small" />
                        )}
                        slotProps={{ textField: { size: 'small' } }}
                    />
                </FormControl>
                <FormControl error={!!errors.timeEnd}>
                    <TimePicker
                        label="Время окончания"
                        value={journal.timeEnd}
                        onChange={handleTimeChange}
                        textField={(params) => (
                            <TextField {...params} required error={!!errors.timeEnd} helperText={errors.timeEnd} inputRef={timeEndRef} size="small" />
                        )}
                        slotProps={{ textField: { size: 'small' } }}
                    />
                </FormControl>
                <FormControl>
                    <InputLabel>Статус</InputLabel>
                    <Select
                        label="Статус"
                        name="status"
                        value={journal.status}
                        onChange={handleChange}
                        size="small"
                    >
                        {Object.keys(statusLabels).map(status => (
                            <MenuItem key={status} value={status} style={{ color: statusColors[status] }}>
                                {statusLabels[status]}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary">
                    Сохранить
                </Button>
            </Box>
        </LocalizationProvider>
    );
};

export default JournalForm;
