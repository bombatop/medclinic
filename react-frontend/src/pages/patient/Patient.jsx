import React, { useState, useEffect } from 'react';
import http from '../../http-common';
import { Link, useNavigate, useParams } from 'react-router-dom';

const Patient = () => {
    const navigate = useNavigate();
    const { patientId } = useParams();
    const [patient, setPatient] = useState({
        id: patientId
    });
    const [journals, setJournals] = useState([]);
    const [agencies, setAgencies] = useState([]);
    const [errorMessages, setErrorMessages] = useState('');

    const handleInputChange = (event, property) => {
        setPatient({
            ...patient,
            [property]: event.target.value,
        });
    };

    useEffect(() => {
        getPatient();
    }, []);

    useEffect(() => {
        getJournals();
        getAgencies();
    }, [patient?.id])

    const fetchData = async (endpoint, params, callback) => {
        try {
            const response = await http.get(endpoint, { params });
            const data = response.data;
            callback(data);
            console.log(`${endpoint} fetch successful:`, data);
        } catch (error) {
            console.error(error);
        }
    };

    const getPatient = async () => {
        await fetchData(`/patient/${patient.id}`, null, setPatient);
    };

    const getJournals = async () => {
        await fetchData(`/journalsForPatient/${patient.id}`, null, setJournals);
    };

    const getAgencies = async () => {
        await fetchData(`/agreements/${patient.id}`, null, setAgencies);
    };

    const updatePatient = async () => {
        try {
            const response = await http.post(`/updatePatient/${patient.id}`, patient);
            console.log('Patient updated:', response.data);
            setErrorMessages(null);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                const errorObjects = error.response.data.map((error) => error.defaultMessage);
                setErrorMessages(errorObjects);
            }
        }
    };

    const deletePatient = async () => {
        try {
            const response = await http.delete(`/deletePatient/${patient.id}`);
            console.log('Patient deleted:', response.data);
            navigate('/patients');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Patient page</h2>

            <div className="form-group row mb-2">
                <label htmlFor="fullname" className="col-sm-2 col-form-label">Full name</label>
                <div className="col-sm-10">
                    <input
                        type="text"
                        className="form-control"
                        id="fullname"
                        value={patient?.name || ''}
                        onChange={(event) => handleInputChange(event, 'name')}
                    />
                </div>
            </div>
            <div className="form-group row mb-2">
                <label htmlFor="phonenumber" className="col-sm-2 col-form-label">Phone number</label>
                <div className="col-sm-10">
                    <input
                        type="text"
                        className="form-control"
                        id="phonenumber"
                        value={patient?.phoneNumber || ''}
                        onChange={(event) => handleInputChange(event, 'phoneNumber')}
                    />
                </div>
            </div>

            <button type="submit" className="btn btn-primary mr-2" onClick={updatePatient}>Update info</button>
            <button type="button" className="btn btn-danger mx-2" onClick={deletePatient}>Delete patient</button>

            {errorMessages && (
                <div className="alert alert-danger" style={{ marginTop: '1rem' }}>
                    {errorMessages.map((errorMessage, index) => (
                        <div key={index}>{errorMessage}</div>
                    ))}
                </div>
            )}

            {journals.length > 0 && (
                <div className="mt-4">
                    <h4>Journal history</h4>
                    <ul className="list-group mt-1" id="journals">
                        {journals.map((journal) => (
                            <li className="list-group-item" key={journal.id}>
                                <Link
                                    to={`/journal/${journal.id}`}
                                    style={{ textDecoration: 'none', color: 'black' }}
                                >
                                    {journal.date} {journal.doctor.name}
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