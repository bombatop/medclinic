import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import http from '../../http-common';

const Agency = () => {
    const navigate = useNavigate();
    const [errorMessages, setErrorMessages] = useState(null);
    const { agencyId } = useParams();

    const [agency, setAgency] = useState({
        loadedByDefault: false,
    });

    useEffect(() => {
        getAgency();
    }, []);

    const handleInputChange = (value, property) => {
        if (value === null) return;
        setAgency({
            ...agency,
            [property]: value,
        });
    };

    const getAgency = async () => {
        try {
            const response = await http.get(`/agency/${agencyId}`);
            setAgency(response.data);
            console.log('Agency fetch successful:', response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const updateAgency = async () => {
        try {
            const response = await http.post(`/updateAgency/${agencyId}`, agency);
            setErrorMessages(null);
            console.log('Agency updated:', response.data);
        } catch (error) {
            if (error.response && error.response.data) {
                const errorObjects = error.response.data.map((error) => error.defaultMessage);
                setErrorMessages(errorObjects);
            }
            console.error(error);
        }
    };

    const deleteAgency = async () => {
        try {
            const response = await http.delete(`/deleteAgency/${agencyId}`);
            console.log('Agency deleted:', response.data);
            navigate('/agencies');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Agency page</h2>

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

            <button type="button" className="btn btn-primary me-2" onClick={updateAgency}>
                Update info
            </button>
            <button type="button" className="btn btn-danger" onClick={deleteAgency}>
                Delete agency
            </button>

            {errorMessages && (
                <div className="alert alert-danger mt-2" role="alert">
                    {errorMessages.map((errorMessage, index) => (
                        <div key={index}>{errorMessage}</div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Agency;