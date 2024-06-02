import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { TextField, Button, Box, Typography, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { jwtDecode } from "jwt-decode";

const Login = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    useEffect(() => {
        setErrors({});
    }, []);

    const validate = () => {
        const tempErrors = {};
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            tempErrors.email = "Требуется email.";
        } else if (!emailRegex.test(email)) {
            tempErrors.email = "Email некорректного формата.";
        }

        if (!password) {
            tempErrors.password = "Требуется пароль.";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            const email = emailRef.current.value;
            const password = passwordRef.current.value;
            const response = await dispatch(login({ email, password }));

            if (response.payload && response.payload.token) {
                const decodedToken = jwtDecode(response.payload.token);
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
            <Typography variant="h4" sx={{ mb: 3 }}>Стоматология</Typography>
            <form onSubmit={handleSubmit} noValidate style={{ width: '100%', maxWidth: '400px' }}>
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
                <Button type="submit" variant="contained" fullWidth>
                    Войти
                </Button>
                {auth.status === 'loading' && <Typography sx={{ mt: 2 }}>Загрузка...</Typography>}
                {auth.error && <Typography sx={{ mt: 2, color: 'red' }}>{auth.error}</Typography>}
            </form>
        </Box>
    );
};

export default Login;
