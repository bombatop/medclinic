import React, { useState, useEffect } from 'react';
import http, { uploadAxios, downloadAxios } from '../../http-common';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Alert, Col, Row } from 'react-bootstrap';

import AsyncSelect from 'react-select/async';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const Journal = () => {
    const navigate = useNavigate();
    const { journalId } = useParams();
    const [journal, setJournal] = useState(null);
    // const [treatment, setTreatment] = useState(null);
    // const [treatments, setTreatments] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState(null);

    const handleInputChange = (value, property) => {
        if (value === null) 
            return;
        if (journal.prices.length === 0 || property !== 'date') {
            setJournal({
                ...journal,
                [property]: value,
            });
        }
    };

    useEffect(() => {
        getJournal();
        // getTreatments();
    }, []);
    
    useEffect(() => {
        if (journal && journal.date) {
            updateJournal();
        }
    }, [journal?.date]);

    useEffect(() => {
        if (journal && journal.doctor) {
            updateJournal();
        }
    }, [journal?.doctor]);

    useEffect(() => {
        if (journal && journal.patient) {
            updateJournal();
        }
    }, [journal?.patient]);

    // // set treatment select
    // useEffect(() => {
    //     if (treatments && treatments.length > 0) {
    //         setTreatment(treatments[0]);
    //     }
    // }, [treatments]);
     
    // const handleTreatmentChange = (event) => {
    //     setTreatment(treatments[event.target.value]);
    // };

    const handleFileSelect = (event) => {
        setSelectedFiles(event.target.files);
    };

    const handleFileUpload = async () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('files', selectedFiles[i]);
        }

        try {
            const response = await uploadAxios.post(`/upload/${journalId}`, formData);
            const updatedJournal = { ...journal, files: response.data };
            setJournal(updatedJournal);
            setSelectedFiles([]);
            document.getElementById('fileUpload').value = '';
        } catch (error) {
            console.error(error);
        }
    };

    const deleteFile = async (fileId) => {
        try {
            const response = await http.delete(`/files/delete/${journalId}/${fileId}`);
            setJournal({ ...journal, files: response.data });
        } catch (error) {
            console.error(error);
        }
    };

    const downloadFile = async (file) => {
        try {
            const response = await downloadAxios.get(`/download/${journal.id}/${file.id}`, {
                responseType: 'arraybuffer',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.name);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error(error);
        }
    };

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

    // const getTreatments = async () => {
    //     try {
    //         const response = await http.get(`/treatments`);
    //         setTreatments(response.data);
    //         console.log('Treatments fetch successful:', response.data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    // const addPrice = async () => {
    //     try {
    //         const response = await http.post(`/addPriceForJournal/${journalId}`, { treatment, date: formattedDate });
    //         console.log('Journal updated with new price:', response.data);

    //         const updatedJournal = { ...journal };
    //         updatedJournal.prices.push(response.data);
    //         setJournal(updatedJournal);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    // const deletePrice = async (priceId) => {
    //     try {
    //         const response = await http.delete(`/deletePriceForJournal/${journalId}/${priceId}`);
    //         console.log('Price deleted:', response.data);

    //         const updatedPrices = journal.prices.filter((price) => price.id !== priceId);
    //         setJournal({ ...journal, prices: updatedPrices });
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    const loadDoctors = async (inputValue, callback) => {
        try {
            const params = {
                searchQuery: inputValue,
                size: 10,
                page: 0,
            };

            const response = await http.get(`/doctors`, { params });
            const options = response.data.content.map((doctor) => ({
                value: doctor,
                label: doctor.name,
            }));
            console.log(`Doctors fetch on query {${inputValue}} successful: `, options);
            callback(options);
        } catch (error) {
            console.error(error);
        }
    };

    const loadPatients = async (inputValue, callback) => {
        try {
            const params = {
                searchQuery: inputValue,
                size: 10,
                page: 0,
            };

            const response = await http.get(`/patients`, { params });
            const options = response.data.content.map((patient) => ({
                value: patient,
                label: patient.name,
            }));
            console.log(`Patients fetch on query {${inputValue}} successful: `, options);
            callback(options);
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
                            <Form.Group controlId="doctor">
                                <Form.Label>Doctor</Form.Label>
                                <AsyncSelect
                                    defaultValue={{ label: journal.doctor.name, value: journal.doctor }}
                                    loadOptions={loadDoctors}
                                    isClearable={true}
                                    onChange={(event) => handleInputChange(event.value, 'doctor')}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-4">
                            <Form.Group controlId="patient">
                                <Form.Label>Patient</Form.Label>
                                <AsyncSelect
                                    defaultValue={{ label: journal.patient.name, value: journal.patient }}
                                    loadOptions={loadPatients}
                                    isClearable={true}
                                    onChange={(event) => handleInputChange(event.value, 'patient')}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-4">
                            <Form.Group controlId="date-picker-div">
                                <Form.Label className="mt-4 mb-2">Date</Form.Label>
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
                            </Form.Group>
                        </div>
                        <div className="col-12">
                            <button type="button" className="btn btn-danger mt-3 mb-4" onClick={deleteJournal}>
                                Delete Journal
                            </button>
                        </div>
                    </div>

                    <div className="row">
                        {journal.files && journal.files.length > 0 && (
                            <div className="col-7">
                                <label htmlFor="files">Uploaded files</label>
                                <ul className="list-group">
                                    {journal.files.map((file) => (
                                        <li className="list-group-item" key={file.id}>
                                            <a href="#!" className="link-dark link-offset-2 link-underline link-underline-opacity-0" onClick={() => downloadFile(file)}>{file.name}</a>
                                            <button type="button" className="btn btn-danger" onClick={() => deleteFile(file.id)}>
                                                &times; Delete
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="form-group row mt-2">
                        <div className="col-5">
                            <label htmlFor="fileUpload">Upload Files</label>
                            <input type="file" className="form-control" id="fileUpload" multiple onChange={handleFileSelect} />
                        </div>
                        <button type="submit" className="col-2 btn btn-primary" onClick={handleFileUpload}>
                            Upload
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Journal;
