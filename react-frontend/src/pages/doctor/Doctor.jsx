import React, { useState, useEffect } from 'react';
import http from '../../http-common';
import { Link, useNavigate, useParams } from 'react-router-dom';

const Doctor = () => {
    const navigate = useNavigate();
    const [errorMessages, setErrorMessages] = useState(null);
    const { doctorId } = useParams();

    const [doctor, setDoctor] = useState(null);

    const handleInputChange = (event, property) => {
        setDoctor({
            ...doctor,
            [property]: event.target.value,
        });
    };

    useEffect(() => {
        getDoctor();
    }, []);

    const getDoctor = async () => {
        try {
            const response = await http.get(`/doctor/${doctorId}`);
            setDoctor(response.data);
            console.log("Doctor fetch successful:", response.data);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                const errorObjects = error.response.data.map((error) => error.defaultMessage);
                setErrorMessages(errorObjects);
            }
        }
    };

    const updateDoctor = async () => {
        try {
            const response = await http.post(`/updateDoctor/${doctorId}`, doctor);
            console.log("Doctor updated:", response.data);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                const errorObjects = error.response.data.map((error) => error.defaultMessage);
                setErrorMessages(errorObjects);
            }
        }
    };

    const deleteDoctor = async () => {
        try {
            const response = await http.delete(`/deleteDoctor/${doctorId}`);
            console.log("Doctor deleted:", response.data);
            navigate('/doctors');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Doctor page</h2>

            <div className="mb-2">
                <label htmlFor="name">Full Name:</label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={doctor?.name || ""}
                    onChange={(event) => handleInputChange(event, "name")}
                />
            </div>

            <div className="mb-2">
                <label htmlFor="phoneNumber">Phone Number:</label>
                <input
                    type="tel"
                    className="form-control"
                    id="phoneNumber"
                    value={doctor?.phoneNumber || ""}
                    onChange={(event) => handleInputChange(event, "phoneNumber")}
                />
            </div>

            <button
                type="submit"
                className="btn btn-primary mb-2"
                onClick={updateDoctor}
            >
                Update Info
            </button>
            <button
                variant="danger"
                className="ms-2 mb-2"
                onClick={deleteDoctor}
            >
                Delete Doctor
            </button>

            {errorMessages && (
                <div className="mt-2">
                    {errorMessages.map((errorMessage, index) => (
                        <div
                            key={index}
                            className="alert alert-danger p-2"
                            style={{ maxWidth: 300 }}
                        >
                            {errorMessage}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Doctor;