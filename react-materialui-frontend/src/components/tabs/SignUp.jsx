import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../../store/authSlice';
import { TextField, Button, Box, Typography, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const nameRef = useRef();
    const surnameRef = useRef();
    const patronymicRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const phoneRef = useRef();
    const emailRef = useRef();
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    const validate = () => {
        const tempErrors = {};
        const name = nameRef.current.value;
        const surname = surnameRef.current.value;
        const patronymic = patronymicRef.current.value;
        const username = usernameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const phone = phoneRef.current.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9\-\+\s]+$/;

        if (!username) {
            tempErrors.username = "Требуется имя пользователя.";
        }
        if (!password) {
            tempErrors.password = "Требуется пароль.";
        }

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

        if (!patronymic) {
            tempErrors.patronymic = "Требуется отчество.";
        } else if (!/^[А-Яа-яЁё\s]+$/.test(patronymic)) {
            tempErrors.patronymic = "Отчество должно содержать только буквы.";
        }


        // if (!email) {
        //     tempErrors.email = "Требуется email.";
        // } else if (!emailRegex.test(email)) {
        //     tempErrors.email = "Email некорректного формата.";
        // }

        // if (!phone) {
        //     tempErrors.phone = "Требуется номер телефона.";
        // } else if (!phoneRegex.test(phone)) {
        //     tempErrors.phone = "Номер телефона некорректного формата.";
        // }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            const name = nameRef.current.value;
            const surname = surnameRef.current.value;
            const patronymic = patronymicRef.current.value;
            const username = usernameRef.current.value;
            const email = emailRef.current.value;
            const password = passwordRef.current.value;
            const phone = phoneRef.current.value;
            try {
                const response = await dispatch(signUp({ name, surname, patronymic, username, email, password, phonenumber: phone })).unwrap();

                if (response.token) {
                    navigate('/journals-table', { replace: true });
                }
            } catch (error) {
                console.error('Error during signup');
                setErrors({ submit: error.message });
            }
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80vh',
            padding: 2
        }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Регистрация</Typography>
            <form onSubmit={handleSubmit} noValidate style={{ width: '100%', maxWidth: '400px' }}>
                <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.username}>
                    <TextField
                        label="Имя пользователя"
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
                <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.patronymic}>
                    <TextField
                        label="Отчество"
                        inputRef={patronymicRef}
                        required
                        error={!!errors.patronymic}
                        helperText={errors.patronymic}
                        fullWidth
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.email}>
                    <TextField
                        label="Email"
                        inputRef={emailRef}
                        // required
                        // error={!!errors.email}
                        // helperText={errors.email}
                        fullWidth
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.phone}>
                    <TextField
                        label="Номер телефона"
                        inputRef={phoneRef}
                        // required
                        // error={!!errors.phone}
                        // helperText={errors.phone}
                        fullWidth
                    />
                </FormControl>
                <Button type="submit" variant="contained" fullWidth>
                    Зарегистрироваться
                </Button>
                {auth.status === 'loading' && <Typography sx={{ mt: 2 }}>Загрузка...</Typography>}
                {auth.error && <Typography sx={{ mt: 2, color: 'red' }}>{auth.error}</Typography>}
                {errors.submit && <Typography sx={{ mt: 2, color: 'red' }}>{errors.submit}</Typography>}
            </form>
        </Box>
    );
};

export default SignUp;
