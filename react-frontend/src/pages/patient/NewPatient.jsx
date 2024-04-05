import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../../utils/http-common';

const NewPatient = () => {
    const navigate = useNavigate();
    const [patient, setPatient] = useState({
        name: '',
        phoneNumber: '',
    });
    const [errorMessages, setErrorMessages] = useState(null);

    const handleInputChange = (event, property) => {
        setPatient({
            ...patient,
            [property]: event.target.value,
        });
    };

    const addPatient = async () => {
        try {
            const response = await http.post(`/patients`, patient);
            console.log('Patient added:', response.data);
            navigate('/patient/' + response.data.id);
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
            <h2>Patient page</h2>

            <div className="mb-2">
                <label htmlFor="fullname" className="form-label">Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="fullname"
                    value={patient.name || ''}
                    onChange={(event) => handleInputChange(event, 'name')}
                />
            </div>

            <div className="mb-2">
                <label htmlFor="phonenumber" className="form-label">Phone number</label>
                <input
                    type="text"
                    className="form-control"
                    id="phonenumber"
                    value={patient.phoneNumber || ''}
                    onChange={(event) => handleInputChange(event, 'phoneNumber')}
                />
            </div>

            <button type="submit" className="btn btn-primary" onClick={addPatient}>
                Add new patient
            </button>

            {errorMessages && (
                <div>
                    <ul className="list-group">
                        {errorMessages.map((errorMessage, index) => (
                            <li className="col-10 list-group-item alert alert-danger p-3 mt-2" style={{ maxWidth: 400 }} key={index}>
                                {errorMessage}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NewPatient;