import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../utils/http-common';
import {
    Box, Button, List, ListItem, ListItemText, IconButton, Typography,
    Dialog, DialogActions, DialogContent, DialogTitle, Grid
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import DebouncedAutocomplete from '../DebouncedAutocomplete';

const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

const JournalDiagnosesTab = () => {
    const { journalData, setJournalData } = useOutletContext();
    const [diagnoses, setDiagnoses] = useState(journalData.diagnoses);
    const [open, setOpen] = useState(false);
    const [currentDiagnosis, setCurrentDiagnosis] = useState(null);
    const [form, setForm] = useState({ diagnosis: null, toothcodes: [] });
    const [errorOpen, setErrorOpen] = useState(false);

    const fetchDiagnoses = async (query = '') => {
        return await api.get('/diagnoses', { params: { searchQuery: query, page: 0, size: 10 } });
    };

    const handleOpen = (diagnosis = null) => {
        if (diagnosis) {
            setForm({ diagnosis: diagnosis.diagnosis, toothcodes: diagnosis.toothcodes });
            setCurrentDiagnosis(diagnosis);
        } else {
            setForm({ diagnosis: null, toothcodes: [] });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentDiagnosis(null);
    };

    const handleErrorClose = () => {
        setErrorOpen(false);
    };

    const handleDiagnosisChange = (value) => {
        setForm({ ...form, diagnosis: value });
    };

    const handleButtonClick = (tooth) => {
        setForm((prevForm) => {
            const toothcodes = prevForm.toothcodes.includes(tooth)
                ? prevForm.toothcodes.filter((code) => code !== tooth)
                : [...prevForm.toothcodes, tooth];
            return { ...prevForm, toothcodes };
        });
    };

    const handleSubmit = () => {
        const diagnosisId = form.diagnosis ? form.diagnosis.id : null;
        if (currentDiagnosis) {
            api.put(`/journals/${journalData.id}/diagnosis/${currentDiagnosis.id}`, {
                diagnosisId,
                toothcodes: form.toothcodes
            }).then(response => {
                const updatedDiagnoses = diagnoses.map(t => t.id === currentDiagnosis.id ? response.data : t);
                setDiagnoses(updatedDiagnoses);
                setJournalData({ ...journalData, diagnoses: updatedDiagnoses });
                handleClose();
            }).catch(error => {
                if (error.response && error.response.status === 409) {
                    setErrorOpen(true);
                } else {
                    console.error('Error updating diagnosis:', error);
                }
            });
        } else {
            api.post(`/journals/${journalData.id}/diagnosis`, {
                diagnosisId,
                toothcodes: form.toothcodes
            }).then(response => {
                const updatedDiagnoses = [...diagnoses, response.data];
                setDiagnoses(updatedDiagnoses);
                setJournalData({ ...journalData, diagnoses: updatedDiagnoses });
                handleClose();
            }).catch(error => {
                if (error.response && error.response.status === 409) {
                    setErrorOpen(true);
                } else {
                    console.error('Error adding diagnosis:', error);
                }
            });
        }
    };

    const handleDelete = (diagnosisId) => {
        api.delete(`/journals/${journalData.id}/diagnosis/${diagnosisId}`)
            .then(() => {
                setDiagnoses(diagnoses.filter(d => d.id !== diagnosisId));
            })
            .catch(error => console.error('Error deleting diagnosis:', error));
    };

    const handleEditConflictDiagnosis = () => {
        const conflictingDiagnosis = diagnoses.find(d => d.diagnosis.id === form.diagnosis.id);
        if (conflictingDiagnosis) {
            setErrorOpen(false);
            handleOpen(conflictingDiagnosis);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpen(null)}>
                Добавить диагноз
            </Button>
            <List sx={{ maxWidth: 600 }}> 
                {diagnoses.length > 0 ? diagnoses.map(diagnosis => (
                    <ListItem key={diagnosis.id}>
                        <ListItemText
                            primary={diagnosis.diagnosis.name}
                            secondary={`Зубы: ${diagnosis.toothcodes.join(', ')}`}
                        />
                        <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(diagnosis)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(diagnosis.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                )) : (
                    <ListItem>
                        <ListItemText primary="Никаких диагнозов поставлено не было." />
                    </ListItem>
                )}
            </List>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>{currentDiagnosis ? 'Редактировать диагноз' : 'Добавить диагноз'}</DialogTitle>
                <DialogContent>
                    <DebouncedAutocomplete
                        label="Наименование диагноза"
                        fetchOptions={fetchDiagnoses}
                        onChange={handleDiagnosisChange}
                        value={form.diagnosis}
                        getOptionLabel={(option) => (option.code + ' ' + option.name)}
                        noOptionsText="Нет данных"
                        size="small"
                        sx={{ marginY: 1 }}
                    />
                    <Grid container spacing={1} justifyContent="center">
                        {[upperTeeth, lowerTeeth].map((row, rowIndex) => (
                            <Grid container item key={rowIndex} spacing={1} justifyContent="center">
                                {row.map((tooth) => (
                                    <Grid item key={tooth}>
                                        <Button
                                            variant={form.toothcodes.includes(String(tooth)) ? "contained" : "outlined"}
                                            onClick={() => handleButtonClick(String(tooth))}
                                            sx={{ minWidth: 40, minHeight: 40, padding: 0 }}
                                        >
                                            {tooth}
                                        </Button>
                                    </Grid>
                                ))}
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Закрыть</Button>
                    <Button
                        onClick={handleSubmit}
                        color="primary"
                        disabled={form.toothcodes.length === 0}>
                        {currentDiagnosis ? 'Обновить' : 'Добавить'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={errorOpen} onClose={handleErrorClose}>
                <DialogTitle>Ошибка</DialogTitle>
                <DialogContent>
                    <Typography>Такой диагноз уже существует. Хотите его редактировать?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleErrorClose} color="primary">Закрыть</Button>
                    <Button
                        onClick={handleEditConflictDiagnosis}
                        color="primary">
                        Редактировать
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default JournalDiagnosesTab;
