import React, { useState, useEffect } from 'react';
import http from '../http-common';
import { Link, useNavigate, useParams } from 'react-router-dom';

const NewPatient = () => {
    const navigate = useNavigate();
    const [patient, setPatient] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: ""
    });
    const [errorMessages, setErrorMessages] = useState('');

    const handleFirstNameChange = (event) => {
        setPatient({
            ...patient,
            firstName: event.target.value
        })
    };

    const handleLastNameChange = (event) => {
        setPatient({
            ...patient,
            lastName: event.target.value
        })
    };

    const handlePhoneNumberChange = (event) => {
        setPatient({
            ...patient,
            phoneNumber: event.target.value
        })
    };

    const addPatient = () => {
        console.log('fetch :', patient);
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
                <div className="form-group mb-2">
                    <label htmlFor="firstname">First name</label>
                    <input type="text" className="form-control" id="firstname" value={patient?.firstName || ''} onChange={handleFirstNameChange} />
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="lastname">Last name</label>
                    <input type="text" className="form-control" id="lastname" value={patient?.lastName || ''} onChange={handleLastNameChange} />
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="phonenumber">Phone number</label>
                    <input type="text" className="form-control" id="phonenumber" value={patient?.phoneNumber || ''} onChange={handlePhoneNumberChange} />
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
