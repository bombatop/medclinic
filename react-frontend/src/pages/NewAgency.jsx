import React, { useState, useEffect } from 'react';
import http from '../http-common';
import { Link, useNavigate, useParams } from 'react-router-dom';

const NewAgency = () => {
    const navigate = useNavigate();
    const [agency, setAgency] = useState({
        name: "",
    });
    const [errorMessages, setErrorMessages] = useState('');

    const handleNameChange = (event) => {
        setAgency({
            ...agency,
            name: event.target.value
        })
    };

    useEffect(() => { }, [])

    const addAgency = () => {
        http
            .post(`/addAgency`, agency)
            .then((response) => {
                console.log('Agency added:', response.data);
                navigate("/agency/" + response.data.id);
            })
            .catch((error) => {
                console.log(error);
                if (error.response && error.response.data) {
                    const errorObjects = error.response.data.map((error) => error.defaultMessage);
                    setErrorMessages(errorObjects);
                }
            });
    };

    return (
        <div className="container">
            <h2 className="text-info">Agency page</h2>

            <div className="agency-container">
                <div className="form-group mb-2">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" id="name" value={agency?.name || ''} onChange={handleNameChange} />
                </div>
            </div>
            <button type="submit" className="btn btn-primary" onClick={addAgency}>Add new agency</button>

            {errorMessages && (
                <div >
                    <ul className="list-group">
                        {errorMessages.map((errorMessage, index) => (
                            <li className="col-10 list-group item alert alert-danger p-3 mt-2" style={{ maxWidth: 400 }} key={index}>{errorMessage}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NewAgency;