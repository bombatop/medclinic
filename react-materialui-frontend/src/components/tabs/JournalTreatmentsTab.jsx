import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../utils/http-common';
import {
    Box, Button, List, ListItem, ListItemText, IconButton, Typography,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import DebouncedAutocomplete from '../DebouncedAutocomplete';

const JournalTreatmentsTab = () => {
    const { journalData, setJournalData } = useOutletContext();
    const [treatments, setTreatments] = useState(journalData.treatments);
    const [open, setOpen] = useState(false);
    const [currentTreatment, setCurrentTreatment] = useState(null);
    const [form, setForm] = useState({ treatment: null, amount: 0 });
    const [errorOpen, setErrorOpen] = useState(false);
    
    const fetchTreatments = async (query = '') => {
        try {
            const response = await api.get('/treatments', {
                params: { searchQuery: query, page: 0, size: 10 }
            });
            return response.data.content;
        } catch (error) {
            console.error('Error fetching treatments:', error);
            return [];
        }
    };

    const handleOpen = (treatment = null) => {
        if (treatment) {
            setForm({ treatment: treatment.treatment, amount: treatment.amount });
            setCurrentTreatment(treatment);
        } else {
            setForm({ treatment: null, amount: 0 });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentTreatment(null);
    };

    const handleErrorClose = () => {
        setErrorOpen(false);
    };

    const handleTreatmentChange = (value) => {
        setForm({ ...form, treatment: value });
    };

    const handleAmountChange = (event) => {
        setForm({ ...form, amount: event.target.value });
    };

    const handleSubmit = () => {
        const treatmentId = form.treatment ? form.treatment.id : null;
        if (currentTreatment) {
            api.put(`/journals/${journalData.id}/treatments/${currentTreatment.id}`, {
                treatmentId,
                amount: form.amount
            }).then(response => {
                const updatedTreatments = treatments.map(t => t.id === currentTreatment.id ? response.data : t);
                setTreatments(updatedTreatments);
                setJournalData({ ...journalData, treatments: updatedTreatments });
                handleClose();
            }).catch(error => {
                if (error.response && error.response.status === 409) {
                    setErrorOpen(true);
                } else {
                    console.error('Error updating treatment:', error);
                }
            });
        } else {
            api.post(`/journals/${journalData.id}/treatments`, {
                treatmentId,
                amount: form.amount
            }).then(response => {
                const updatedTreatments = [...treatments, response.data];
                setTreatments(updatedTreatments);
                setJournalData({ ...journalData, treatments: updatedTreatments });
                handleClose();
            }).catch(error => {
                if (error.response && error.response.status === 409) {
                    setErrorOpen(true);
                } else {
                    console.error('Error adding treatment:', error);
                }
            });
        }
    };

    const handleDelete = (treatmentId) => {
        api.delete(`/journals/${journalData.id}/treatments/${treatmentId}`)
            .then(() => {
                setTreatments(treatments.filter(t => t.id !== treatmentId));
            })
            .catch(error => console.error('Error deleting treatment:', error));
    };

    const handleEditConflictTreatment = () => {
        const conflictingTreatment = treatments.find(t => t.treatment.id === form.treatment.id);
        if (conflictingTreatment) {
            setErrorOpen(false);
            handleOpen(conflictingTreatment);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpen(null)}>
                Добавить лечение
            </Button>
            <List sx={{ maxWidth: 600 }}>
                {treatments.length > 0 ? treatments.map(treatment => (
                    <ListItem key={treatment.id}>
                        <ListItemText
                            primary={treatment.treatment.name}
                            secondary={`Количество: ${treatment.amount}`}
                        />
                        <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(treatment)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(treatment.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                )) : (
                    <ListItem>
                        <ListItemText primary="Никаких лечений не было." />
                    </ListItem>
                )}
            </List>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>{currentTreatment ? 'Редактировать лечение' : 'Добавить лечение'}</DialogTitle>
                <DialogContent>
                    <DebouncedAutocomplete
                        label="Наименование лечения"
                        fetchOptions={fetchTreatments}
                        value={form.treatment}
                        onChange={handleTreatmentChange}
                        getOptionKey={(option) => `${option.id}`}
                        getOptionLabel={(option) => `${option.code} ${option.name}`}
                        noOptionsText="Нет данных"
                        size="small"
                        sx={{ marginY: 1 }}
                    />
                    <TextField
                        label="Количество"
                        type="number"
                        value={form.amount}
                        onChange={handleAmountChange}
                        fullWidth
                        sx={{ marginY: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Закрыть</Button>
                    <Button
                        onClick={handleSubmit}
                        color="primary"
                        disabled={!form.treatment || form.amount <= 0}>
                        {currentTreatment ? 'Обновить' : 'Добавить'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={errorOpen} onClose={handleErrorClose}>
                <DialogTitle>Ошибка</DialogTitle>
                <DialogContent>
                    <Typography>Такое лечение уже существует. Хотите его редактировать?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleErrorClose} color="primary">Закрыть</Button>
                    <Button
                        onClick={handleEditConflictTreatment}
                        color="primary">
                        Редактировать
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default JournalTreatmentsTab;
