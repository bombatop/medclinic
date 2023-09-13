import React, { useState, useEffect } from 'react';
import http from '../http-common';
import { Link, useNavigate, useParams } from 'react-router-dom';

const NewJournal = () => {
    const navigate = useNavigate();
    const [journal, setJournal] = useState({
        date: getCurrentDatetime()
    });
    const [patients, setPatients] = useState(null);
    const [doctors, setDoctors] = useState(null);
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

    const handleDoctorChange = (event) => {
        setJournal({
            ...journal,
            doctor: doctors[event.target.value]
        })
    };

    const handlePatientChange = (event) => {
        setJournal({
            ...journal,
            patient: patients[event.target.value]
        })
    };
    
    const handleDateChange = (event) => {
        setJournal({
            ...journal,
            date: event.target.value
        })
    };

    useEffect(() => {
        getPatients();
        getDoctors();
    }, [])

    useEffect(() => {
        if (doctors && doctors.length > 0 && patients && patients.length > 0) {
            setJournal({
                ...journal,
                doctor: doctors[0],
                patient: patients[0]
            })
        }
    }, [doctors, patients])
    
    const getDoctors = () => {
        http
            .get(`/doctors`)
            .then((response) => {
                setDoctors(response.data);
                console.log('Doctors fetch successful:', response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getPatients = () => {
        http
            .get(`/patients`)
            .then((response) => {
                setPatients(response.data);
                console.log('Patients fetch successful:', response.data);
            })
            .catch((error) => {
                console.log(error);
            });
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
            .catch ((error) => {
                console.log(error);
            });
    };


    return (
        <div className="container">
            <h2 className="text-info">Journal page</h2>

            <div className="journal-container">
                <div className="form-group mb-2">
                    <label htmlFor="doctor">Doctor</label>
                    <select id="doctor" className="form-select" onChange={handleDoctorChange}>
                        {doctors && doctors.map((doctor, index) => (
                            <option key={index} value={index}>
                                {doctor.firstName} {doctor.lastName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="patient">Patient</label>
                    <select id="patient" className="form-select" onChange={handlePatientChange}>
                        {patients && patients.map((patient, index) => (
                            <option key={index} value={index}>
                                {patient.firstName} {patient.lastName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="date">Date</label>
                    <input type="datetime-local" className="form-control" id="date" value={journal.date} onChange={handleDateChange}></input>
                </div>
            </div>
            <button type="submit" className="btn btn-primary" onClick={addJournal}>Add new journal</button>
        </div>
    );
};

export default NewJournal;