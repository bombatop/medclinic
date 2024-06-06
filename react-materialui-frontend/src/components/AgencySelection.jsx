import React, { useState } from 'react';
import { Box, Button, IconButton, Chip, Typography, List, ListItem, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DebouncedAutocomplete from './DebouncedAutocomplete';

const AgencySelection = ({ fetchOptions, onChange }) => {
    const [selectedAgencies, setSelectedAgencies] = useState([]);

    const handleAddAgency = (newAgency) => {
        if (!selectedAgencies.some((agency) => agency.id === newAgency.id)) {
            const updatedAgencies = [...selectedAgencies, newAgency];
            setSelectedAgencies(updatedAgencies);
            onChange(updatedAgencies.map(agency => agency.id));
        }
    };

    const handleRemoveAgency = (agencyToRemove) => {
        const updatedAgencies = selectedAgencies.filter((agency) => agency.id !== agencyToRemove.id);
        setSelectedAgencies(updatedAgencies);
        onChange(updatedAgencies.map(agency => agency.id));
    };

    return (
        <Box sx={{ padding: 2 }}>
            <DebouncedAutocomplete
                label="Поиск агентств"
                fetchOptions={fetchOptions}
                onChange={handleAddAgency}
                value={null}
                getOptionKey={(option) => option.id}
                getOptionLabel={(option) => option.name}
                noOptionsText="Нет доступных агентств"
                sx={{ width: 300 }}
                size="small"
            />
            <List>
                {selectedAgencies.map((agency) => (
                    <ListItem key={agency.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <ListItemText primary={agency.name} />
                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveAgency(agency)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default AgencySelection;
