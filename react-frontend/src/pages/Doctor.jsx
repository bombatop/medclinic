import React, { useState, useEffect } from 'react';
import http from '../http-common';
import { Link, useNavigate, useParams } from 'react-router-dom';

const Doctor = () => {
    const navigate = useNavigate();
    const { doctorId } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [errorMessages, setErrorMessages] = useState('');

    const handleNameChange = (event) => {
        setDoctor({
            ...doctor,
            name: event.target.value
        })
    };
    const handlePhoneNumberChange = (event) => {
        setDoctor({
            ...doctor,
            phoneNumber: event.target.value
        })
    };

    useEffect(() => {
        getDoctor();
    }, [])

    const getDoctor = () => {
        http
            .get(`/doctor/${doctorId}`)
            .then((response) => {
                setDoctor(response.data);
                console.log('Doctor fetch successful:', response.data);
            })
        .catch ((error) => {
            console.log(error);
            if (error.response && error.response.data) {
                const errorObjects = error.response.data.map((error) => error.defaultMessage);
                setErrorMessages(errorObjects);
            }
        });
    };

    const updateDoctor = () => {
        http
            .post(`/updateDoctor/${doctorId}`, doctor)
            .then((response) => {
                console.log('Doctor updated:', response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const deleteDoctor = () => {
        http
            .delete(`/deleteDoctor/${doctorId}`)
            .then((response) => {
                console.log('Doctor deleted:', response.data);
                navigate('/doctors');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="container">
            <h2 className="text-info">Doctor page</h2>

            <div className="doctor-container">
                <div className="form-group col-6 mb-2">
                    <label htmlFor="name">Full name</label>
                    <input type="text" className="form-control" id="name" value={doctor?.name || ''} onChange={handleNameChange} />
                </div>
                <div className="form-group col-6 mb-2">
                    <label htmlFor="phonenumber">Phone number</label>
                    <input type="text" className="form-control" id="phonenumber" value={doctor?.phoneNumber || ''} onChange={handlePhoneNumberChange} />
                </div>
            </div>
            <button type="submit" className="btn btn-primary" onClick={updateDoctor}>Update info</button>
            <button type="button" className="mx-2 btn btn-danger" onClick={deleteDoctor}>Delete Doctor</button>

            {errorMessages && (
                <div className="text-danger">
                    <ul>
                        {errorMessages.map((errorMessage, index) => (
                            <li key={index}>{errorMessage}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Doctor;
