import React, { useState, useEffect } from 'react';
import http from '../../utils/http-common';
import { Link, useNavigate, useParams } from 'react-router-dom';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import ru from 'date-fns/locale/ru';

const Patient = () => {
    const navigate = useNavigate();
    const { patientId } = useParams();
    const [patient, setPatient] = useState({
        id: patientId
    });
    const [journals, setJournals] = useState([]);
    const [agencies, setAgencies] = useState([]);

    const formatDate = (dateStr, formatStr) => format(parseISO(dateStr), formatStr, { locale: ru });

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
        await fetchData(`/patients/${patient.id}`, null, setPatient);
    };

    const getJournals = async () => {
        await fetchData(`/journals/patient/${patient.id}`, null, setJournals);
    };

    const getAgencies = async () => {
        await fetchData(`/agreements/${patient.id}`, null, setAgencies);
    };

    const updatePatient = async () => {
        try {
            const response = await http.put(`/patients/${patient.id}`, patient);
            console.log('Patient updated:', response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const deletePatient = async () => {
        try {
            const response = await http.delete(`/patients/${patient.id}`);
            console.log('Patient deleted:', response.data);
            navigate('/patients');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-4">
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

            {journals.length > 0 && (
                <div className="mt-4">
                    <h4>Journal history</h4>
                    <ul className="list-group mt-1" id="journals">
                        {journals.map((journal) => (
                            <li className="list-group-item" key={journal.id}>
                                <Link to={`/journal/${journal.id}`} style={{ textDecoration: 'none', color: 'black' }} >
                                    {formatDate(journal.date, 'd MMMM, yyyy')} {' : '} {journal.doctor.name}
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