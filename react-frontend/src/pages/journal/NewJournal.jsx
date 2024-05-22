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
        dateStart: new Date(),
        dateEnd: new Date(),
        patient: null,
        doctor: null,
        status: "SCHEDULED"
    });

    const handleInputChange = (value, property) => {
        setJournal({ ...journal, [property]: value });
    };

    const addJournal = async () => {
        try {
            const params = {
                patientId: journal.patient.id,
                doctorId: journal.doctor.id,
                status: journal.status,
                dateStart: format(journal.dateStart, `yyyy-MM-dd'T'HH:mm`, { locale: ru }),
                dateEnd: format(journal.dateEnd, `yyyy-MM-dd'T'HH:mm`, { locale: ru }),
            };
            const response = await http.post('/journals', params);
            navigate(`/journal/${response.data.id}`);
        } catch (error) {
            console.error(error);
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
                        selected={journal.dateStart}
                        onChange={(date) => handleInputChange(date, 'dateStart')}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={10}
                        dateFormat="d MMMM, yyyy HH:mm"
                        className="form-control"
                        locale={ru}
                        timeCaption="время"
                    />
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="date-picker-div">Date:</label>
                    <DatePicker
                        selected={journal.dateEnd}
                        onChange={(date) => handleInputChange(date, 'dateEnd')}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={10}
                        dateFormat="d MMMM, yyyy HH:mm"
                        className="form-control"
                        locale={ru}
                        timeCaption="время"
                    />
                </div>
               <div className="col-md-3">
                    <select
                        className="form-control"
                        value={journal.status}
                        onChange={(e) => handleInputChange(e.target.value, 'status')}
                    >
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>
            <button type="submit" className="btn btn-primary" onClick={addJournal}>
                Add new journal
            </button>
        </div>
    );
};

export default NewJournal;