import React from 'react';
import http from '../utils/http-common';
import AsyncSelect from 'react-select/async';

function DebouncedSearchSelect({ api, defaultValue, onChange }) {
    let fetchTimeout;

    const fetchData = async (inputValue) => {
        if (fetchTimeout) clearTimeout(fetchTimeout);

        return new Promise((resolve) => {
            fetchTimeout = setTimeout(async () => {
                try {
                    const params = { searchQuery: inputValue, size: 5, page: 0 };
                    const response = await http.get(`/${api}`, { params });
                    const options = response.data.content.map(entity => ({
                        value: entity,
                        label: entity.name,
                    }));
                    console.log(api, inputValue, options);
                    resolve(options);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    resolve([]);
                }
            }, 200); //ms
        });
    };

    const loadOptions = async (inputValue, callback) => {
        const options = await fetchData(inputValue);
        callback(options);
    };

    return (
        <AsyncSelect
            // cacheOptions
            defaultOptions
            loadOptions={loadOptions}
            isClearable={false}
            defaultValue={defaultValue}
            onChange={onChange}
        />
    );
}

export default DebouncedSearchSelect;
