import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../../utils/http-common';

const NewAgency = () => {
    const navigate = useNavigate();
    const [errorMessages, setErrorMessages] = useState('');
    
    const [agency, setAgency] = useState({
        name: '',
        loadedByDefault: false
    });

    const handleInputChange = (value, property) => {
        if (value === null) return;
        setAgency({
            ...agency,
            [property]: value,
        });
    };

    const addAgency = async () => {
        try {
            const response = await http.post('/agencies', agency);
            console.log('Agency added:', response.data);
            navigate('/agency/' + response.data.id);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                const errorObjects = error.response.data.map((error) => error.defaultMessage);
                setErrorMessages(errorObjects);
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Agency page</h2>

            <div className="mb-2">
                <label htmlFor="fullname" className="form-label mb-2">
                    Full name
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="fullname"
                    value={agency?.name || ''}
                    onChange={(event) => handleInputChange(event.target.value, 'name')}
                />
            </div>

            <div className="form-check mb-2">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="default-checkbox"
                    checked={agency?.loadedByDefault}
                    onChange={(event) => handleInputChange(event.target.checked, 'loadedByDefault')}
                />
                <label className="form-check-label" htmlFor="default-checkbox">
                    Loaded by default
                </label>
            </div>

            <button type="submit" className="btn btn-primary" onClick={addAgency}>
                Add new agency
            </button>

            {errorMessages && (
                <div>
                    <ul className="list-unstyled">
                        {errorMessages.map((errorMessage, index) => (
                            <li className="alert alert-danger col-10 mt-2" key={index} style={{ maxWidth: 400 }}>{errorMessage}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NewAgency;