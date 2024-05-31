import React, { useState, useEffect } from 'react';
import {
    Modal, Box, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, TextField,
    Button, CircularProgress
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import api from "../../utils/http-common";

const fetchPrices = (agencyId, treatmentId) => {
    const params = {
        page: 0,
        size: 9999,
        sortField: 'treatment.code',
        sortOrder: 'asc',
        latestOnly: true,
    };
    if (agencyId !== null) {
        params.agencyId = agencyId;
    }
    if (treatmentId !== null) {
        params.treatmentId = treatmentId;
    }

    console.log('Fetching prices with params:', params); // Log parameters for debugging

    return api.get('/prices', { params });
};

const fetchData = async (agencyId, treatmentId, setPrices, setLoading,) => {
    setLoading(true);
    try {
        const response = await fetchPrices(agencyId, treatmentId);
        setPrices(response.data.content);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    setLoading(false);
};

const PriceModal = ({ open, onClose, selectedAgency }) => {
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(dayjs());

    useEffect(() => {
        if (open && selectedAgency) {
            fetchData(selectedAgency.id, null, (data) => {
                setPrices(data);
                setDate(dayjs());
            }, setLoading);
        }
    }, [open, selectedAgency]);

    useEffect(() => {
        setPrices(prices.map(price => ({ ...price, date: date.format('YYYY-MM-DDTHH:mm') })));
    }, [date]);

    const handleDateChange = (newDate) => {
        setDate(newDate);
    };

    const handlePriceChange = (index, event) => {
        const newPrices = [...prices];
        newPrices[index].price = event.target.value;
        setPrices(newPrices);
    };

    const handleSave = async () => {
        const bulkPriceUpdateData = {
            date: date.format('YYYY-MM-DDTHH:mm'),
            agencyId: selectedAgency.id,
            prices: prices.map(price => ({
                treatmentId: price.treatment.id,
                price: price.price
            }))
        };

        try {
            await api.post('/prices/bulk', bulkPriceUpdateData);
            onClose(); // Close the modal after saving
        } catch (error) {
            console.error('Error saving prices:', error);
        }
    };


    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ padding: 4, backgroundColor: 'white', margin: 'auto', marginTop: '10%', width: '80%' }}>
                <Typography variant="h6" gutterBottom>
                    Список новых цен
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                        <DatePicker
                            label="Дата"
                            value={date}
                            onChange={handleDateChange}
                            slotProps={{ textField: { size: 'small' } }}
                        />
                    </LocalizationProvider>
                </Box>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Код услуги</TableCell>
                                    <TableCell>Наименование услуги</TableCell>
                                    <TableCell>Новая цена</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {prices.map((price, index) => (
                                    <TableRow key={price.id}>
                                        <TableCell>{price.treatment.code}</TableCell>
                                        <TableCell>{price.treatment.name}</TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                value={price.price}
                                                onChange={(event) => handlePriceChange(index, event)}
                                                fullWidth
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                    <Button onClick={handleSave} variant="contained" color="primary">Обновить</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default PriceModal;
