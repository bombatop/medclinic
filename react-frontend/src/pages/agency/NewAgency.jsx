import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import http from '../../http-common';

const NewAgency = () => {
    const navigate = useNavigate();
    const [errorMessages, setErrorMessages] = useState('');

    const [agency, setAgency] = useState(null);

    const handleInputChange = (event, property) => {
        setAgency({
            ...agency,
            [property]: event.target.value,
        });
    };

    const addAgency = async () => {
        try {
            const response = await http.post('/addAgency', agency);
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
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={agency?.name || ''}
                    onChange={(event) => handleInputChange(event, 'name')}
                />
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