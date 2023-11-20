import React, { useState, useEffect } from 'react';
import http from '../../http-common';
import { Link, useNavigate, useParams } from 'react-router-dom';

const NewPatient = () => {
    const navigate = useNavigate();
    const [patient, setPatient] = useState({
        name: null,
        lastName: null,
        phoneNumber: null
    });
    const [errorMessages, setErrorMessages] = useState(null);

    const handleInputChange = (event, property) => {
        setPatient({
            ...patient,
            [property]: event.target.value,
        });
    };

    const addPatient = () => {
        http
            .post(`/addPatient`, patient)
            .then((response) => {
                console.log('Patient added:', response);
                navigate("/patient/" + response.data.id);
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
            <h2 className="text-info">Patient page</h2>

            <div className="patient-container">
                <div className="form-group col-6 mb-2">
                    <label htmlFor="fullname">Full name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="fullname"
                        value={patient?.name || ''}
                        onChange={(event) => handleInputChange(event, 'name')}
                    />
                </div>
                <div className="form-group col-6 mb-2">
                    <label htmlFor="phonenumber">Phone number</label>
                    <input
                        type="text"
                        className="form-control"
                        id="phonenumber"
                        value={patient?.phoneNumber || ''}
                        onChange={(event) => handleInputChange(event, 'phoneNumber')}
                    />
                </div>
            </div>

            <button type="submit" className="btn btn-primary" onClick={addPatient}>Add new patient</button>

            {errorMessages && (
                <ul className="list-group">
                    {errorMessages.map((errorMessage, index) => (
                        <li className="col-10 list-group item alert alert-danger p-3 mt-2" style={{maxWidth:400}} key={index}>{errorMessage}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NewPatient;
