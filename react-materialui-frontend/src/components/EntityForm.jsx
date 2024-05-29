import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Box, FormControl } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import api from '../utils/http-common';

const EntityForm = ({ entityData, endpoint, fields, onClose }) => {
    const [entity, setEntity] = useState(() => {
        if (entityData && entityData.id) {
            return fields.reduce((acc, field) => {
                acc[field.name] = field.type === 'date' ? dayjs(entityData[field.name]) : entityData[field.name] || '';
                return acc;
            }, {});
        } else {
            return fields.reduce((acc, field) => {
                acc[field.name] = field.type === 'date' ? null : '';
                return acc;
            }, {});
        }
    });
    const [errors, setErrors] = useState({});
    const refs = useRef({});

    useEffect(() => {
        if (entityData && entityData.id) {
            const formattedData = fields.reduce((acc, field) => {
                acc[field.name] = field.type === 'date' ? dayjs(entityData[field.name]) : entityData[field.name] || '';
                return acc;
            }, {});
            setEntity(formattedData);
        }
    }, [entityData, fields]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEntity(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDateChange = (name, date) => {
        setEntity(prevState => ({
            ...prevState,
            [name]: date
        }));
    };

    const validate = () => {
        let tempErrors = {};
        fields.forEach(field => {
            if (field.required && !entity[field.name]) {
                tempErrors[field.name] = "Пожалуйста, заполните это поле.";
                refs.current[field.name].focus();
            }
        });
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const formattedEntity = fields.reduce((acc, field) => {
                acc[field.name] = field.type === 'date' && entity[field.name] ? entity[field.name].format('YYYY-MM-DD') : entity[field.name];
                return acc;
            }, {});

            const request = entityData?.id
                ? api.put(`/${endpoint}/${entityData.id}`, formattedEntity)
                : api.post(`/${endpoint}`, formattedEntity);

            request
                .then(response => {
                    onClose();
                })
                .catch(error => console.error(`Error saving ${endpoint}:`, error));
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {fields.map(field => (
                    <FormControl key={field.name} error={!!errors[field.name]}>
                        {field.type === 'date' ? (
                            <DatePicker
                                label={field.label}
                                value={entity[field.name]}
                                onChange={(date) => handleDateChange(field.name, date)}
                                slotProps={{
                                    textField: {
                                        required: field.required,
                                        error: !!errors[field.name],
                                        helperText: errors[field.name],
                                        inputRef: el => refs.current[field.name] = el,
                                        size: 'small'
                                    }
                                }}
                            />
                        ) : (
                            <TextField
                                label={field.label}
                                name={field.name}
                                value={entity[field.name] || ''}
                                onChange={handleChange}
                                required={field.required}
                                inputRef={el => refs.current[field.name] = el}
                                error={!!errors[field.name]}
                                helperText={errors[field.name]}
                                size="small"
                            />
                        )}
                    </FormControl>
                ))}
                <Button type="submit" variant="contained" color="primary">
                    Сохранить
                </Button>
            </Box>
        </LocalizationProvider>
    );
};

export default EntityForm;
