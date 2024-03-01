import React, { useState, useEffect } from 'react';
import http from '../../http-common';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Alert, Col, Row, ListGroup, ListGroupItem} from 'react-bootstrap';

const Patient = () => {
    const navigate = useNavigate();
    const [patient, setPatient] = useState({
        id: useParams().patientId
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
        <Container>
            <h2>Patient page</h2>

            <Container>
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

                <button type="submit" className="btn btn-primary" onClick={updatePatient}>
                    Update info
                </button>
                <button type="button" className="mx-2 btn btn-danger" onClick={deletePatient}>
                    Delete patient
                </button>
            </Container>

            {errorMessages && (
                <ListGroup className="list-group">
                    {errorMessages.map((errorMessage, index) => (
                        <li className="col-10 list-group item alert alert-danger p-3 mt-2" style={{ maxWidth: 400 }} key={index}>{errorMessage}</li>
                    ))}
                </ListGroup>
            )}

            {journals.length > 0 && (
                <Container md={4} className="mt-4">
                    <h4>Journal history</h4>
                    <ListGroup className="list-group mt-1" id="journals">
                        {journals.map((journal) => (
                            <ListGroupItem className="col-3 list-group-item" key={journal.id}>
                                <Link
                                    to={`/journal/${journal.id}`}
                                    style={{ textDecoration: 'none', color: 'black' }}
                                >
                                    {journal.date} {journal.doctor.name}
                                </Link>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </Container>
            )}

        </Container>
    );
};

export default Patient;
