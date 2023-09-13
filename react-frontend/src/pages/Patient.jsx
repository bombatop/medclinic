import React, { useState, useEffect } from 'react';
import http from '../http-common';
import { Link, useNavigate, useParams } from 'react-router-dom';

const Patient = () => {
    const navigate = useNavigate();
    const { patientId } = useParams();
    const [patient, setPatient] = useState(null);
    const [journals, setJournals] = useState([]);
    const [errorMessages, setErrorMessages] = useState('');


    useEffect(() => {
        getPatient();
        getJournals();
    }, []);

    const getPatient = () => {
        http
            .get(`/patient/${patientId}`)
            .then((response) => {
                setPatient(response.data);
                console.log('Patient fetch successful:', response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getJournals = () => {
        http
            .get(`/journalsForPatient/${patientId}`)
            .then((response) => {
                setJournals(response.data);
                console.log('Journals fetch successful:', response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

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

    const updatePatient = () => {
        http
            .post(`/updatePatient/${patientId}`, patient)
            .then((response) => {
                console.log('Patient updated:', response.data);
                setErrorMessages(null);
            })
            .catch ((error) => {
                console.log(error);
                if (error.response && error.response.data) {
                    const errorObjects = error.response.data.map((error) => error.defaultMessage);
                    setErrorMessages(errorObjects);
                }
            });
    };

    const deletePatient = () => {
        http
            .delete(`/deletePatient/${patientId}`)
            .then((response) => {
                console.log('Patient deleted:', response.data);
                navigate('/patients');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="container">
            <h2 className="text-info">Patient page</h2>

            <div className="patient-container">
                <div className="form-group col-6 mb-2">
                    <label htmlFor="firstname">First name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="firstname"
                        value={patient?.firstName || ''}
                        onChange={handleFirstNameChange}
                    />
                </div>
                <div className="form-group col-6 mb-2">
                    <label htmlFor="lastname">Last name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="lastname"
                        value={patient?.lastName || ''}
                        onChange={handleLastNameChange}
                    />
                </div>
                <div className="form-group col-6 mb-2">
                    <label htmlFor="phonenumber">Phone number</label>
                    <input
                        type="text"
                        className="form-control"
                        id="phonenumber"
                        value={patient?.phoneNumber || ''}
                        onChange={handlePhoneNumberChange}
                    />
                </div>
            </div>

            <button type="submit" className="btn btn-primary" onClick={updatePatient}>
                Update info
            </button>
            <button type="button" className="mx-2 btn btn-danger" onClick={deletePatient}>
                Delete patient
            </button>

            {errorMessages && (
                <ul className="list-group">
                    {errorMessages.map((errorMessage, index) => (
                        <li className="col-10 list-group item alert alert-danger p-3 mt-2" style={{ maxWidth: 400 }} key={index}>{errorMessage}</li>
                    ))}
                </ul>
            )}

            {journals.length > 0 && (
                <div className="journal-container mt-4">
                    <label htmlFor="journals">Journal history</label>
                    <ul className="list-group mt-1" id="journals">
                        {journals.map((journal) => (


                            <li className="col-3 list-group-item" key={journal.id}>
                                <Link
                                    to={`/journal/${journal.id}`}
                                    style={{ textDecoration: 'none', color: 'black' }}
                                >
                                    {journal.date} {journal.doctor.firstName} {journal.doctor.lastName}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Patient;
