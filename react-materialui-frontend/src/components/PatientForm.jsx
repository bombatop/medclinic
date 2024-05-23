import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Box, FormControl } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ru';
import dayjs from 'dayjs';
import api from '../utils/http-common';

const PatientForm = ({ patientId, onClose }) => {
    const [patient, setPatient] = useState({
        surname: '',
        name: '',
        patronymic: '',
        birthDate: dayjs(),
        phoneNumber: '',
        email: '',
    });

    const [errors, setErrors] = useState({});

    const surnameRef = useRef();
    const nameRef = useRef();

    useEffect(() => {
        if (patientId) {
            api.get(`/patients/${patientId}`)
                .then(response => {
                    const data = response.data;
                    setPatient({
                        surname: data.surname || '',
                        name: data.name || '',
                        patronymic: data.patronymic || '',
                        birthDate: data.birthDate ? dayjs(data.birthDate) : dayjs(),
                        phoneNumber: data.phoneNumber || '',
                        email: data.email || '',
                    });
                })
                .catch(error => console.error('Error fetching patient:', error));
        }
    }, [patientId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatient(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDateChange = (date) => {
        setPatient(prevState => ({
            ...prevState,
            birthDate: date
        }));
    };

    const validate = () => {
        let tempErrors = {};
        if (!patient.surname) {
            tempErrors.surname = "Пожалуйста, заполните это поле.";
            surnameRef.current.focus();
        }
        if (!patient.name) {
            tempErrors.name = "Пожалуйста, заполните это поле.";
            nameRef.current.focus();
        }
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const request = patientId
                ? api.put(`/patients/${patientId}`, {
                    ...patient,
                    birthDate: patient.birthDate.format('YYYY-MM-DD') // Format the date as 'yyyy-MM-dd'
                })
                : api.post('/patients', {
                    ...patient,
                    birthDate: patient.birthDate.format('YYYY-MM-DD') // Format the date as 'yyyy-MM-dd'
                });

            request
                .then(response => {
                    onClose();
                })
                .catch(error => console.error('Error saving patient:', error));
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl error={!!errors.surname}>
                    <TextField
                        label="Фамилия"
                        name="surname"
                        value={patient.surname || ''}
                        onChange={handleChange}
                        required
                        inputRef={surnameRef}
                        error={!!errors.surname}
                        helperText={errors.surname}
                        size="small"
                    />
                </FormControl>
                <FormControl error={!!errors.name}>
                    <TextField
                        label="Имя"
                        name="name"
                        value={patient.name || ''}
                        onChange={handleChange}
                        required
                        inputRef={nameRef}
                        error={!!errors.name}
                        helperText={errors.name}
                        size="small"
                    />
                </FormControl>
                <TextField
                    label="Отчество"
                    name="patronymic"
                    value={patient.patronymic || ''}
                    onChange={handleChange}
                    size="small"
                />
                <FormControl error={!!errors.birthDate}>
                    <DatePicker
                        label="Дата рождения"
                        value={patient.birthDate}
                        onChange={handleDateChange}
                        PopperProps={{ sx: { zIndex: 1500 } }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                required
                                error={!!errors.birthDate}
                                helperText={errors.birthDate}
                                size="small"
                            />
                        )}
                    />
                </FormControl>
                <TextField
                    label="Телефон"
                    name="phoneNumber"
                    value={patient.phoneNumber || ''}
                    onChange={handleChange}
                    size="small"
                />
                <TextField
                    label="E-mail"
                    name="email"
                    value={patient.email || ''}
                    onChange={handleChange}
                    size="small"
                />
                <Button type="submit" variant="contained" color="primary">
                    Сохранить
                </Button>
            </Box>
        </LocalizationProvider>
    );
};

export default PatientForm;
