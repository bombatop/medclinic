import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import DebouncedSearchSelect from '../../components/DebouncedSearchSelect';

import http, { uploadAxios, downloadAxios } from '../../utils/http-common';
import FileUploader from '../../components/FileUploader';
import FileList from '../../components/FileList';

import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { update } from 'lodash';

const Journal = () => {
    const navigate = useNavigate();
    const { journalId } = useParams();
    const [journal, setJournal] = useState(null);
    // const [treatment, setTreatment] = useState(null);
    // const [treatments, setTreatments] = useState(null);
    
    const onFilesUpdated = () => {
        getJournal(); // Re-fetch journal to update the file list
    };

    const handleInputChange = (value, property) => {
        console.log(value, property);

        if (value === null) 
            return;

        //bad validation to prevent changing date after changing price
        if (journal.prices.length === 0 || property !== 'date') {
            setJournal({
                ...journal,
                [property]: value,
            });
            updateJournal();
        }
    };

    const handleDoctorChange = (value) => {
        setJournal({
            ...journal,
            doctor: value,
        });
    };

    const handlePatientChange = (value) => {
        setJournal({
            ...journal,
            patient: value,
        });
    };

    useEffect(() => {
        getJournal();
        // getTreatments();
    }, []);

    const getJournal = async () => {
        try {
            const response = await http.get(`/journal/${journalId}`);
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
        if (journal.prices.length > 0) {
            return;
        }
        try {
            const response = await http.post(`/updateJournal/${journalId}`, { ...journal, date: format(journal.date, 'yyyy-MM-dd HH:mm') });
            console.log('Journal updated:', response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteJournal = async () => {
        try {
            await http.delete(`/deleteJournal/${journalId}`);
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
                <div>
                    <div className="row g-3">

                        <div className="col-md-4">
                            <DebouncedSearchSelect
                                defaultValue={{ label: journal.doctor.name, value: journal.doctor }}
                                onChange={(event) => handleInputChange(event.value, 'doctor')}
                                api={'doctors'}
                            />
                        </div>
                        <div className="col-md-4">
                            <DebouncedSearchSelect
                                defaultValue={{ label: journal.patient.name, value: journal.patient }}
                                onChange={(event) => handleInputChange(event.value, 'patient')}
                                api={'patients'}
                            />
                        </div>
                        
                        
                        <div className="col-md-4">
                            <div className="from-group" 
                                // controlId="date-picker-div"
                            >
                                {/* <Form.Label className="mt-4 mb-2">Date</Form.Label> */}
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
                        <div className="col-12">
                            <button type="button" className="btn btn-danger mt-3 mb-4" onClick={deleteJournal}>
                                Delete Journal
                            </button>
                        </div>
                    </div>

                    <FileList journalId={journalId} files={journal.files} onFileChange={onFilesUpdated} />
                    <FileUploader journalId={journalId} onUploadSuccess={onFilesUpdated} />
                </div>
            )}
        </div>
    );
}

export default Journal;
