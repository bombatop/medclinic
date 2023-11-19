import React, { useState, useEffect } from 'react';
import http from '../http-common';
import { Link, useNavigate, useParams } from 'react-router-dom';

import AsyncSelect from 'react-select/async';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";

const NewJournal = () => {
    const navigate = useNavigate();
    const [journal, setJournal] = useState({
        date: new Date(),
        patient: null,
        doctor: null
    });

    const formattedDate = format(journal.date, 'yyyy-MM-dd HH:mm');
    const [errorMessages, setErrorMessages] = useState('');

    // const handleInputChange = (property, value) => {
    //     setDoctor({
    //         ...doctor,
    //         [value]: property.target.value,
    //     });
    // };

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
    
    const handleDateChange = (date) => {
        setJournal({
            ...journal,
            date: date
        })
    };

    const addJournal = () => {
        let formattedDateJournal = {
            ...journal,
            date: formattedDate
        }
        http
            .post(`/addJournal`, formattedDateJournal)
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
                console.log('Doctors fetch on query {' + inputValue + '} successful: ', options);
                callback(options);
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
                console.log('Patients fetch on query ' + inputValue + ' successful: ', options);
                callback(options);
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
                        loadOptions={loadPatients}
                        isClearable={true}
                        onChange={handlePatientChange}
                    />
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="date-picker-div">Date</label>
                    <div className="date-picker-div">
                        <DatePicker
                            selected={journal.date}
                            onChange={handleDateChange}
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
        </div>
    );
};

export default NewJournal;