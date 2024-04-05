import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../../utils/http-common';
import DebouncedSearchSelect from '../../components/DebouncedSearchSelect';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

const NewJournal = () => {
    const navigate = useNavigate();
    const [journal, setJournal] = useState({
        date: new Date(),
        patient: null,
        doctor: null
    });
    const [errorMessages, setErrorMessages] = useState([]);

    const handleInputChange = (value, property) => {
        setJournal({ ...journal, [property]: value });
    };

    const addJournal = async () => {
        try {
            const formattedJournal = {
                ...journal,
                date: format(journal.date, `yyyy-MM-dd'T'HH:mm`, { locale: ru }),
            };
            const response = await http.post('/journals', formattedJournal);
            navigate(`/journals/${response.data.id}`);
        } catch (error) {
            if (error.response?.data) {
                const errorObjects = error.response.data.map((error) => error.defaultMessage);
                setErrorMessages(errorObjects);
            } else {
                console.error(error);
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Journal page</h2>
            <div className="journal-container">
                <div className="form-group mb-2">
                    <label htmlFor="doctor">Doctor:</label>
                    <DebouncedSearchSelect
                        onChange={(event) => handleInputChange(event.value, 'doctor')}
                        api='doctors'
                    />
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="patient">Patient:</label>
                    <DebouncedSearchSelect
                        onChange={(event) => handleInputChange(event.value, 'patient')}
                        api='patients'
                    />
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="date-picker-div">Date:</label>
                    <DatePicker
                        selected={journal.date}
                        onChange={(date) => handleInputChange(date, 'date')}
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
            <button type="submit" className="btn btn-primary" onClick={addJournal}>
                Add new journal
            </button>
            {errorMessages.length > 0 && (
                <div className="alert alert-danger mt-2" role="alert">
                    {errorMessages.map((errorMessage, index) => (
                        <div key={index}>{errorMessage}</div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NewJournal;