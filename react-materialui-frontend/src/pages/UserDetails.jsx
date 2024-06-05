import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box, Tabs, Tab, TextField, Button, Typography, Paper, CircularProgress
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ru';
import api from '../utils/http-common';
import DebouncedAutocomplete from '../components/DebouncedAutocomplete';
import { validateEmail, validatePhoneNumber, validateName } from '../utils/validation';

const UserDetails = () => {
    const { userId } = useParams();
    const [user, setUser] = useState({
        surname: '',
        name: '',
        patronymic: '',
        phonenumber: '',
        email: '',
        username: '',
        password: '',
        role: null,
    });
    const [formData, setFormData] = useState({ ...user });
    const [tabIndex, setTabIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    const fetchUser = async () => {
        try {
            const response = await api.get(`/users/${userId}`);
            setUser({
                ...response.data,
                password: ''
            });
            setFormData({
                ...response.data,
                password: ''
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [userId]);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const fetchRoles = async (query = '') => {
        try {
            const response = await api.get('/roles', {
                params: { searchQuery: query, page: 0, size: 9999 }
            });
            return response.data.content;
        } catch (error) {
            console.error('Error fetching roles:', error);
            return [];
        }
    };

    const validate = () => {
        let tempErrors = {};
        if (!validateName(formData.name)) tempErrors.name = "Имя должно содержать только буквы.";
        if (!validateName(formData.surname)) tempErrors.surname = "Фамилия должна содержать только буквы.";
        if (!validateName(formData.patronymic)) tempErrors.patronymic = "Отчество должно содержать только буквы.";
        if (!validatePhoneNumber(formData.phonenumber)) tempErrors.phonenumber = "Некорректный номер телефона.";
        if (!validateEmail(formData.email)) tempErrors.email = "Некорректный email.";
        setErrors(tempErrors);
        return Object.values(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                await api.put(`/auth/update-info`, {
                    userId,
                    surname: formData.surname,
                    name: formData.name,
                    patronymic: formData.patronymic,
                    phonenumber: formData.phonenumber,
                    email: formData.email,
                    username: formData.username
                });
                alert("User info updated successfully");
                setUser({ ...formData });
            } catch (error) {
                console.error('Error updating user info:', error);
            }
        }
    };

    const handleSecuritySubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/auth/update-auth`, {
                userId,
                username: formData.username,
                password: formData.password,
            });
            alert("User security details updated successfully");
            setUser({ ...formData });
        } catch (error) {
            console.error('Error updating user security details:', error);
        }
    };

    const handleRoleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/auth/update-role`, {
                userId,
                roleId: formData.role ? formData.role.id : null
            });
            alert("User role updated successfully");
            setUser({ ...formData });
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <Box sx={{ padding: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Пользователь: {user.surname} {user.name} {user.patronymic}
                </Typography>
                <Paper sx={{ padding: 2, maxWidth: 600 }}>
                    <Tabs value={tabIndex} onChange={handleTabChange}>
                        <Tab label="Основная информация" />
                        <Tab label="Безопасность" />
                        <Tab label="Роль" />
                    </Tabs>
                    {tabIndex === 0 && (
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Фамилия"
                                name="surname"
                                value={formData.surname}
                                onChange={handleChange}
                                error={!!errors.surname}
                                helperText={errors.surname}
                                required
                                size="small"
                            />
                            <TextField
                                label="Имя"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                required
                                size="small"
                            />
                            <TextField
                                label="Отчество"
                                name="patronymic"
                                value={formData.patronymic}
                                onChange={handleChange}
                                error={!!errors.patronymic}
                                helperText={errors.patronymic}
                                required
                                size="small"
                            />
                            <TextField
                                label="Телефон"
                                name="phonenumber"
                                value={formData.phonenumber}
                                onChange={handleChange}
                                error={!!errors.phonenumber}
                                helperText={errors.phonenumber}
                                required
                                size="small"
                            />
                            <TextField
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                required
                                size="small"
                            />
                            <Button type="submit" variant="contained" color="primary">
                                Сохранить
                            </Button>
                        </Box>
                    )}
                    {tabIndex === 1 && (
                        <Box component="form" onSubmit={handleSecuritySubmit} noValidate sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Имя пользователя"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                size="small"
                            />
                            <TextField
                                label="Пароль"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                size="small"
                            />
                            <Button type="submit" variant="contained" color="primary">
                                Сохранить
                            </Button>
                        </Box>
                    )}
                    {tabIndex === 2 && (
                        <Box component="form" onSubmit={handleRoleSubmit} noValidate sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <DebouncedAutocomplete
                                label="Роль"
                                fetchOptions={fetchRoles}
                                value={formData.role}
                                onChange={(newValue) => {
                                    setFormData(prevState => ({
                                        ...prevState,
                                        role: newValue
                                    }));
                                }}
                                getOptionKey={(role) => `${role.id}`}
                                getOptionLabel={(role) => `${role.name}`}
                                noOptionsText={"Нет данных"}
                                required
                                size="small"
                            />
                            <Button type="submit" variant="contained" color="primary">
                                Сохранить
                            </Button>
                        </Box>
                    )}
                </Paper>
            </Box>
        </LocalizationProvider>
    );
};

export default UserDetails;
