import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import DebouncedSearchSelect from '../../components/DebouncedSearchSelect';

import http from '../../utils/http-common';
import FileUploader from './FileUploader';

import DatePicker from 'react-datepicker';
import { format } from 'date-fns';

const Journal = () => {
    const navigate = useNavigate();
    const { journalId } = useParams();
    const [journal, setJournal] = useState(null);
    const [treatment, setTreatment] = useState(null);
    // const [treatments, setTreatments] = useState(null);

    const handleInputChange = (value, property) => {
        // console.log(value, property);
        if (value === null) 
            return;
        updateJournal();
    };

    useEffect(() => {
        getJournal();
        getTreatments();
    }, []);

    const getJournal = async () => {
        try {
            const response = await http.get(`/journals/${journalId}`);
            setJournal({
                ...response.data,
                date: new Date(response.data.date),
            });
            console.log('Journal fetch successful:', response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const updateJournal = async () => {
        try {
            const params = {
                patientId: journal.patient.id,
                doctorId: journal.doctor.id,
                date: format(journal.date, `yyyy-MM-dd'T'HH:mm`)
            }
            const response = await http.put(`/journals/${journalId}`, params);
            console.log('Journal updated:', response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteJournal = async () => {
        try {
            await http.delete(`/journals/${journalId}`);
            console.log('Journal deleted');
            navigate('/journals');
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        <div className="container mt-4">
            <h2>Journal page</h2>
            {journal && (
                <>
                    <div className="row g-3 journal-maindata-container">
                        <div className="col-md-3">
                            <DebouncedSearchSelect
                                defaultValue={{ label: journal.doctor.name, value: journal.doctor }}
                                onChange={(event) => handleInputChange(event.value, 'doctor')}
                                api={'doctors'}
                            />
                        </div>
                        <div className="col-md-3">
                            <DebouncedSearchSelect
                                defaultValue={{ label: journal.patient.name, value: journal.patient }}
                                onChange={(event) => handleInputChange(event.value, 'patient')}
                                api={'patients'}
                            />
                        </div>
                        <div className="col-md-3">
                            <div className="from-group">
                                <DatePicker
                                    selected={journal.date}
                                    onChange={(date) => handleInputChange(date, 'date')}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={10}
                                    dateFormat="d MMMM, yyyy HH:mm"
                                    className="form-control"
                                    timeCaption="время"
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <button type="button" className="btn btn-danger" onClick={deleteJournal}>
                                Delete Journal
                            </button>
                        </div>
                    </div>

                    <div className="col mt-4 journal-file-container">
                        <FileUploader
                            journalId={journalId}
                            initialFiles={journal.files}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

export default Journal;
