import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import http from '../../http-common';
import Date from '../../utils/NamedDate';

import AsyncSelect from 'react-select/async';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const NewJournal = () => {
    const navigate = useNavigate();
    const [journal, setJournal] = useState({
        date: new Date(),
        patient: null,
        doctor: null
    });
    const [errorMessages, setErrorMessages] = useState('');

    const handleInputChange = (value, property) => {
        if (value === null) return;
        setJournal({
            ...journal, 
            [property]: value,
        });
    };

    const addJournal = async () => {
        try {
            const response = await http.post(`/addJournal`, { ...journal, date: format(journal.date, 'yyyy-MM-dd HH:mm') });
            console.log('Journal added:', response.data);
            navigate("/journal/" + response.data.id);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                const errorObjects = error.response.data.map((error) => error.defaultMessage);
                setErrorMessages(errorObjects);
            }
        }
    };

    const fetchData = async (endpoint, params, callback) => {
        try {
            const response = await http.get(endpoint, { params });
            const options = response.data.content.map((item) => ({
                value: item,
                label: item.name,
            }));
            console.log(`${endpoint} fetch on query ${params.searchQuery} successful: `, options);
            callback(options);
        } catch (error) {
            console.error(error);
        }
    };

    const loadDoctors = (inputValue, callback) => {
        const params = {
            searchQuery: inputValue,
            size: 10,
            page: 0,
        };
        fetchData(`/doctors`, params, callback);
    };

    const loadPatients = (inputValue, callback) => {
        const params = {
            searchQuery: inputValue,
            size: 10,
            page: 0,
        };
        fetchData(`/patients`, params, callback);
    };



    return (
        <div className="container">
            <h2 className="text-info">Journal page</h2>

            <div className="journal-container">
                <div className="form-group mb-2">
                    <label htmlFor="doctor">Doctor</label>
                    <AsyncSelect
                        loadOptions={loadDoctors}
                        isClearable={true}
                        onChange={(event) => handleInputChange(event.value, 'doctor')}
                    />
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="patient">Patient</label>
                    <AsyncSelect
                        loadOptions={loadPatients}
                        isClearable={true}
                        onChange={(event) => handleInputChange(event.value, 'patient')}
                    />
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="date-picker-div">Date</label>
                    <div className="date-picker-div">
                        <DatePicker
                            selected={journal.date}
                            onChange={(event) => handleInputChange(event, 'date')}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={10}
                            dateFormat="d MMMM, yyyy HH:mm"
                            className="form-control"
                            locale={ru}
                            timeCaption="время"
                        />
                    </div>
                </div>
            </div>
            <button type="submit" className="btn btn-primary" onClick={addJournal}>
                Add new journal
            </button>
            
            {errorMessages && (
                <ListGroup className="mt-2">
                    {errorMessages.map((errorMessage, index) => (
                        <Alert key={index} variant="danger" className="p-2" style={{ maxWidth: 300 }}>
                            {errorMessage}
                        </Alert>
                    ))}
                </ListGroup>
            )}
        </div>
    );
};

export default NewJournal;