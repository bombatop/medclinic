import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import AgencySelection from '../AgencySelection';
import api from '../../utils/http-common';

const AgencySelectionModal = ({ open, onClose, onSave }) => {
    const [loading, setLoading] = useState(false);
    const [selectedAgencies, setSelectedAgencies] = useState([]);

    const fetchAgencies = async (query = '') => {
        try {
            const response = await api.get('/agencies', {
                params: { searchQuery: query }
            });
            return response.data.content;
        } catch (error) {
            console.error('Error fetching agencies');
            return [];
        }
    };

    const handleSave = () => {
        onSave(selectedAgencies);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Выберите агентства</DialogTitle>
            <DialogContent>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <AgencySelection
                        fetchOptions={fetchAgencies}
                        onChange={setSelectedAgencies}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button onClick={handleSave}>Сохранить</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AgencySelectionModal;

