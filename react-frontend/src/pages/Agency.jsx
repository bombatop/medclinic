import React, { useState, useEffect } from 'react';
import http from '../http-common';
import { Link, useNavigate, useParams } from 'react-router-dom';

const Agency = () => {
    const navigate = useNavigate();
    const { agencyId } = useParams();
    const [agency, setAgency] = useState(null);
    const [errorMessages, setErrorMessages] = useState('');

    useEffect(() => {
        getAgency();
    }, []);

    const getAgency = () => {
        http
            .get(`/agency/${agencyId}`)
            .then((response) => {
                setAgency(response.data);
                console.log('Agency fetch successful:', response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };


    const handleNameChange = (event) => {
        setAgency({
            ...agency,
            name: event.target.value
        })
    };

    const updateAgency = () => {
        http
            .post(`/updateAgency/${agencyId}`, agency)
            .then((response) => {
                console.log('Agency updated:', response.data);
                setErrorMessages(null);
            })
            .catch((error) => {
                console.log(error);
                if (error.response && error.response.data) {
                    const errorObjects = error.response.data.map((error) => error.defaultMessage);
                    setErrorMessages(errorObjects);
                }
            });
    };

    const deleteAgency = () => {
        http
            .delete(`/deleteAgency/${agencyId}`)
            .then((response) => {
                console.log('Agency deleted:', response.data);
                navigate('/agencies');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="container">
            <h2 className="text-info">Agency page</h2>

            <div className="agency-container">
                <div className="form-group col-6 mb-2">
                    <label htmlFor="firstname">Full name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="firstname"
                        value={agency?.name || ''}
                        onChange={handleNameChange}
                    />
                </div>
            </div>

            <button type="submit" className="btn btn-primary" onClick={updateAgency}>
                Update info
            </button>
            <button type="button" className="mx-2 btn btn-danger" onClick={deleteAgency}>
                Delete agency
            </button>

            {errorMessages && (
                <ul className="list-group">
                    {errorMessages.map((errorMessage, index) => (
                        <li className="col-10 list-group item alert alert-danger p-3 mt-2" style={{ maxWidth: 400 }} key={index}>{errorMessage}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Agency;
