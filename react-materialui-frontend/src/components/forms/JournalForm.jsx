import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, FormControl, CircularProgress, MenuItem, Select, InputLabel, Autocomplete } from '@mui/material';
import { LocalizationProvider, DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ru';
import dayjs from 'dayjs';
import api from '../../utils/http-common';
import debounce from 'lodash.debounce';

const statusOptions = [
    { value: 'SCHEDULED', label: 'Запланировано', color: 'orange' },
    { value: 'COMPLETED', label: 'Проведено', color: 'green' },
    { value: 'CANCELLED', label: 'Отменено', color: 'gray' }
];

const JournalForm = ({ entityData, onClose }) => {
    const [journal, setJournal] = useState({
        patientId: '',
        doctorId: '',
        date: dayjs(),
        timeEnd: dayjs().add(1, 'hour'),
        status: 'SCHEDULED'
    });

    const [patients, setPatients] = useState([]);
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [errors, setErrors] = useState({});

    const patientRef = useRef();
    const doctorRef = useRef();
    const dateRef = useRef();
    const timeEndRef = useRef();
    
    const navigate = useNavigate();

    const fetchDoctors = async (query = '') => {
        setLoadingDoctors(true);
        try {
            const response = await api.get('/doctors', {
                params: { searchQuery: query, page: 0, size: 5 }
            });
            setDoctors(response.data.content);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
        setLoadingDoctors(false);
    };

    const fetchPatients = async (query = '') => {
        setLoadingPatients(true);
        try {
            const response = await api.get('/patients', {
                params: { searchQuery: query, page: 0, size: 5 }
            });
            setPatients(response.data.content);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
        setLoadingPatients(false);
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const debouncedFetchDoctors = useCallback(debounce((query) => {
        fetchDoctors(query);
    }, 300), []);

    const debouncedFetchPatients = useCallback(debounce((query) => {
        fetchPatients(query);
    }, 300), []);

    useEffect(() => {
        if (entityData) {
            setJournal({
                patientId: entityData.patient.id || '',
                doctorId: entityData.doctor.id || '',
                date: entityData.date ? dayjs(entityData.date) : dayjs(),
                timeEnd: entityData.timeEnd ? dayjs(entityData.timeEnd, 'HH:mm') : dayjs().add(1, 'hour'),
                status: entityData.status || 'SCHEDULED'
            });
            setSelectedPatient(entityData.patient);
            setSelectedDoctor(entityData.doctor);
        }
    }, [entityData]);

    const fetchJournal = async (id) => {
        try {
            const response = await api.get(`/journals/${id}`);
            const data = response.data;
            setJournal({
                patientId: data.patient.id || '',
                doctorId: data.doctor.id || '',
                date: data.date ? dayjs(data.date) : dayjs(),
                timeEnd: data.timeEnd ? dayjs(data.timeEnd, 'HH:mm') : dayjs().add(1, 'hour'),
                status: data.status || 'SCHEDULED'
            });
            setSelectedPatient(data.patient);
            setSelectedDoctor(data.doctor);
            setPatients([data.patient]);
            setDoctors([data.doctor]);
        } catch (error) {
            console.error('Error fetching journal:', error);
        }
    };

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
            patientRef.current.focus();
        }
        if (!journal.doctorId) {
            tempErrors.doctorId = "Пожалуйста, выберите доктора.";
            doctorRef.current.focus();
        }
        if (!journal.date || !journal.date.isValid()) {
            tempErrors.date = "Пожалуйста, выберите дату и время начала.";
            dateRef.current.focus();
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
            const request = entityData.id
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
                    <Autocomplete
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
                            setJournal(prevState => ({
                                ...prevState,
                                patientId: newValue ? newValue.id : ''
                            }));
                        }}
                        loading={loadingPatients}
                        loadingText={"Поиск..."}
                        noOptionsText={"Нет данных"}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Пациент"
                                variant="outlined"
                                required
                                inputRef={patientRef}
                                error={!!errors.patientId}
                                helperText={errors.patientId}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loadingPatients ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                                size="small"
                            />
                        )}
                    />
                </FormControl>
                <FormControl error={!!errors.doctorId}>
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
                            setJournal(prevState => ({
                                ...prevState,
                                doctorId: newValue ? newValue.id : ''
                            }));
                        }}
                        loading={loadingDoctors}
                        loadingText={"Поиск..."}
                        noOptionsText={"Нет данных"}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Доктор"
                                variant="outlined"
                                required
                                inputRef={doctorRef}
                                error={!!errors.doctorId}
                                helperText={errors.doctorId}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loadingDoctors ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                                size="small"
                            />
                        )}
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
                        {statusOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary">
                    Сохранить
                </Button>
                {entityData.id && (
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleNavigateToJournal}
                    >
                        Дополнительно
                    </Button>
                )}
            </Box>
        </LocalizationProvider>
    );
};

export default JournalForm;