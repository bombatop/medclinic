import React, { useState, useCallback } from 'react';
import { TextField, CircularProgress, Autocomplete } from '@mui/material';
import debounce from 'lodash.debounce';

const DebouncedAutocomplete = ({ label, fetchOptions, onChange, value, getOptionLabel, noOptionsText, ...rest }) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchOptionsDebounced = useCallback(debounce(async (query) => {
        setLoading(true);
        try {
            const response = await fetchOptions(query);
            setOptions(response.data.content);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
        setLoading(false);
    }, 350), []);

    const handleFocus = () => {
        if (!value) {
            setLoading(true);
            fetchOptionsDebounced('');
            setOpen(true);
        }
    };

    const handleInputChange = (event, newInputValue) => {
        if (newInputValue === '' || !value) {
            setLoading(true);
            fetchOptionsDebounced(newInputValue);
        }
    };

    return (
        <Autocomplete
            options={open ? options : []}
            getOptionLabel={getOptionLabel}
            value={value}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onInputChange={handleInputChange}
            onChange={(event, newValue) => {
                onChange(newValue);
                if (newValue) {
                    setOptions([]);
                    setOpen(false);
                } else {
                    fetchOptionsDebounced('');
                    setOpen(true);
                }
            }}
            loading={loading}
            loadingText="Поиск..."
            noOptionsText={noOptionsText}
            open={open}
            onOpen={() => handleFocus()}
            onClose={() => setOpen(false)}
            {...rest}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    variant="outlined"
                    onFocus={handleFocus}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};

export default DebouncedAutocomplete;
