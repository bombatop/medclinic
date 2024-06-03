import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, signIn } from '../store/authSlice';
import { TextField, Button, Box, Typography, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../utils/http-common';

const SignIn = () => {
    const usernameRef = useRef();
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
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        if (!username) {
            tempErrors.username = "Требуется имя пользователя.";
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
            const username = usernameRef.current.value;
            const password = passwordRef.current.value;
            try {
                const response = await dispatch(login({ username, password })).unwrap();

                if (response.token) {
                    const token = response.token;
                    const decodedToken = jwtDecode(token);
                    console.log(decodedToken);
                    const user = await getUserService(decodedToken.userId);
                    const loggedUser = { token, user, decodedToken };
                    dispatch(signIn(loggedUser));
                    navigate('/', { replace: true });
                }
            } catch (error) {
                setErrors({ submit: error.message });
            }
        }
    };

    const getUserService = async (userId) => {
        try {
            const response = await api.get(`/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user data');
            throw error;
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
                <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.username}>
                    <TextField
                        label="Логин"
                        inputRef={usernameRef}
                        required
                        error={!!errors.username}
                        helperText={errors.username}
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
                {errors.submit && <Typography sx={{ mt: 2, color: 'red' }}>{errors.submit}</Typography>}
            </form>
        </Box>
    );
};

export default SignIn;
