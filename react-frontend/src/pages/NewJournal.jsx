import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import http from '../http-common';
import { Link, useNavigate, useParams } from 'react-router-dom';

const NewJournal = () => {
    const navigate = useNavigate();
    const [journal, setJournal] = useState({
        date: getCurrentDatetime(),
        patient: null,
        doctor: null
    });
    const [errorMessages, setErrorMessages] = useState('');
    
    function getCurrentDatetime() {
        var now = new Date();
        var year = now.getFullYear();
        var month = (now.getMonth() + 1).toString().padStart(2, "0");
        var day = now.getDate().toString().padStart(2, "0");
        var hours = now.getHours().toString().padStart(2, "0");
        var minutes = now.getMinutes().toString().padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    const handleDoctorChange = (selectedOption) => {
        if (!selectedOption) return;
        setJournal({
            ...journal,
            doctor: selectedOption.value
        })
    };

    const handlePatientChange = (selectedOption) => {
        if (!selectedOption) return;
        setJournal({
            ...journal,
            patient: selectedOption.value
        })
    };
    
    const handleDateChange = (event) => {
        setJournal({
            ...journal,
            date: event.target.value
        })
    };

    const addJournal = () => {
        if (journal.date.indexOf("T") != -1) {
            journal.date = journal.date.replace("T", " ");
        }
        console.log(journal);
        http
            .post(`/addJournal`, journal)
            .then((response) => {
                console.log('Journal added:', response.data);
                navigate("/journal/" + response.data.id);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const loadDoctors = (inputValue, callback) => {
        const params = {
            searchQuery: inputValue,
            size: 10,
            page: 0,
        };
        http
            .get(`/doctors`, { params })
            .then((response) => {
                const options = response.data.content.map((doctor) => ({
                    value: doctor,
                    label: doctor.name,
                }));
                callback(options);
                console.log('Doctors fetch on query {' + inputValue + '} successful: ', options);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const loadPatients = (inputValue, callback) => {
        const params = {
            searchQuery: inputValue,
            size: 10,
            page: 0,
        };
        http
            .get(`/patients`, { params })
            .then((response) => {
                const options = response.data.content.map((patient) => ({
                    value: patient,
                    label: patient.name,
                }));
                callback(options);
                console.log('Patients fetch on query {' + inputValue + '} successful: ', options);
            })
            .catch((error) => {
                console.log(error);
            });
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
                        onChange={handleDoctorChange}
                    />
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="patient">Patient</label>
                    <AsyncSelect
                        options={loadPatients}
                        isClearable={true}
                        onChange={handlePatientChange}
                    />
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="date">Date</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        id="date"
                        value={journal.date}
                        onChange={handleDateChange}
                    ></input>
                </div>
            </div>
            <button type="submit" className="btn btn-primary" onClick={addJournal}>
                Add new journal
            </button>
        </div>
    );
};

export default NewJournal;