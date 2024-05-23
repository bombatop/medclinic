import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TextField, Button, Box, FormControl, CircularProgress, MenuItem, Select, InputLabel, Autocomplete } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ru';
import dayjs from 'dayjs';
import api from '../utils/http-common';
import debounce from 'lodash.debounce';

const statusOptions = [
    { value: 'SCHEDULED', label: 'Запланировано', color: 'orange' },
    { value: 'COMPLETED', label: 'Проведено', color: 'green' },
    { value: 'CANCELLED', label: 'Отменено', color: 'gray' }
];

const JournalForm = ({ journalId, journalData, onClose }) => {
    const [journal, setJournal] = useState({
        patientId: '',
        doctorId: '',
        dateStart: dayjs(),
        dateEnd: dayjs(),
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
    const dateStartRef = useRef();
    const dateEndRef = useRef();

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
        if (journalData) {
            setJournal({
                patientId: journalData.patient.id || '',
                doctorId: journalData.doctor.id || '',
                dateStart: journalData.dateStart ? dayjs(journalData.dateStart) : dayjs(),
                dateEnd: journalData.dateEnd ? dayjs(journalData.dateEnd) : dayjs(),
                status: journalData.status || 'SCHEDULED'
            });
            setSelectedPatient(journalData.patient);
            setSelectedDoctor(journalData.doctor);
        } else if (journalId) {
            fetchJournal(journalId);
        }
    }, [journalId, journalData]);

    const fetchJournal = async (id) => {
        try {
            const response = await api.get(`/journals/${id}`);
            const data = response.data;
            setJournal({
                patientId: data.patient.id || '',
                doctorId: data.doctor.id || '',
                dateStart: data.dateStart ? dayjs(data.dateStart) : dayjs(),
                dateEnd: data.dateEnd ? dayjs(data.dateEnd) : dayjs(),
                status: data.status || 'SCHEDULED'
            });
            setSelectedPatient(data.patient);
            setSelectedDoctor(data.doctor);
            setPatients([data.patient]); // Add initial data to options
            setDoctors([data.doctor]); // Add initial data to options
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

    const handleDateStartChange = (date) => {
        setJournal(prevState => ({
            ...prevState,
            dateStart: date
        }));
    };

    const handleDateEndChange = (date) => {
        setJournal(prevState => ({
            ...prevState,
            dateEnd: date
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
        if (!journal.dateStart || !journal.dateStart.isValid()) {
            tempErrors.dateStart = "Пожалуйста, выберите дату начала.";
            dateStartRef.current.focus();
        }
        if (!journal.dateEnd || !journal.dateEnd.isValid()) {
            tempErrors.dateEnd = "Пожалуйста, выберите дату начала.";
            dateEndRef.current.focus();
        }
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const request = journalId
                ? api.put(`/journals/${journalId}`, {
                    ...journal,
                    dateStart: journal.dateStart.format('YYYY-MM-DDTHH:mm'),
                    dateEnd: journal.dateEnd.format('YYYY-MM-DDTHH:mm')
                })
                : api.post('/journals', {
                    ...journal,
                    dateStart: journal.dateStart.format('YYYY-MM-DDTHH:mm'),
                    dateEnd: journal.dateEnd.format('YYYY-MM-DDTHH:mm')
                });

            request
                .then(response => {
                    onClose();
                })
                .catch(error => console.error('Error saving journal:', error));
        }
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
                            />
                        )}
                    />
                </FormControl>
                <FormControl error={!!errors.dateStart}>
                    <DateTimePicker
                        label="Дата начала"
                        value={journal.dateStart}
                        onChange={handleDateStartChange}
                        textField={(params) => (
                            <TextField {...params} required error={!!errors.dateStart} helperText={errors.dateStart} inputRef={dateStartRef} />
                        )}
                    />
                </FormControl>
                <DateTimePicker
                    label="Дата окончания"
                    value={journal.dateEnd}
                    minDate={journal.dateStart}
                    onChange={handleDateEndChange}
                    textField={(params) => (
                        <TextField {...params} />
                    )}
                />
                <FormControl>
                    <InputLabel>Статус</InputLabel>
                    <Select
                        label="Статус"
                        name="status"
                        value={journal.status}
                        onChange={handleChange}
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
            </Box>
        </LocalizationProvider>
    );
};

export default JournalForm;
