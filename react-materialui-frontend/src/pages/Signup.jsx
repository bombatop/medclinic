import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../store/authSlice';
import { TextField, Button, Box, Typography, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const nameRef = useRef();
    const surnameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const phoneRef = useRef();
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    const validate = () => {
        const tempErrors = {};
        const name = nameRef.current.value;
        const surname = surnameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const phone = phoneRef.current.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9\-\+\s]+$/;

        if (!name) {
            tempErrors.name = "Требуется имя.";
        } else if (!/^[А-Яа-яЁё\s]+$/.test(name)) {
            tempErrors.name = "Имя должно содержать только буквы.";
        }

        if (!surname) {
            tempErrors.surname = "Требуется фамилия.";
        } else if (!/^[А-Яа-яЁё\s]+$/.test(surname)) {
            tempErrors.surname = "Фамилия должна содержать только буквы.";
        }

        if (!email) {
            tempErrors.email = "Требуется email.";
        } else if (!emailRegex.test(email)) {
            tempErrors.email = "Email некорректного формата.";
        }

        if (!password) {
            tempErrors.password = "Требуется пароль.";
        }

        if (!phone) {
            tempErrors.phone = "Требуется номер телефона.";
        } else if (!phoneRegex.test(phone)) {
            tempErrors.phone = "Номер телефона некорректного формата.";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            const name = nameRef.current.value;
            const surname = surnameRef.current.value;
            const email = emailRef.current.value;
            const password = passwordRef.current.value;
            const phone = phoneRef.current.value;
            const response = await dispatch(signup({ name: name, surname: surname, email: email, password: password, phonenumber: phone }));
            
            if (response.payload && response.payload.token) {
                localStorage.setItem('token', response.payload.token);
                navigate('/journals-table');
            }
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            padding: 2
        }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Регистрация</Typography>
            <form onSubmit={handleSubmit} noValidate style={{ width: '100%', maxWidth: '400px' }}>
                <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.name}>
                    <TextField
                        label="Имя"
                        inputRef={nameRef}
                        required
                        error={!!errors.name}
                        helperText={errors.name}
                        fullWidth
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.surname}>
                    <TextField
                        label="Фамилия"
                        inputRef={surnameRef}
                        required
                        error={!!errors.surname}
                        helperText={errors.surname}
                        fullWidth
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.email}>
                    <TextField
                        label="Email"
                        inputRef={emailRef}
                        required
                        error={!!errors.email}
                        helperText={errors.email}
                        fullWidth
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.password}>
                    <TextField
                        label="Пароль"
                        type="password"
                        inputRef={passwordRef}
                        required
                        error={!!errors.password}
                        helperText={errors.password}
                        fullWidth
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.phone}>
                    <TextField
                        label="Номер телефона"
                        inputRef={phoneRef}
                        required
                        error={!!errors.phone}
                        helperText={errors.phone}
                        fullWidth
                    />
                </FormControl>
                <Button type="submit" variant="contained" fullWidth>
                    Зарегистрироваться
                </Button>
                {auth.status === 'loading' && <Typography sx={{ mt: 2 }}>Загрузка...</Typography>}
                {auth.error && <Typography sx={{ mt: 2, color: 'red' }}>{auth.error}</Typography>}
            </form>
        </Box>
    );
};

export default Signup;
