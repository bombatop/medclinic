import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import DebouncedSearchSelect from '../../components/DebouncedSearchSelect';
import { CgSoftwareDownload, CgTrash, CgClose } from "react-icons/cg";

import http from '../../utils/http-common';
import FileUploader from './FileUploader';
import ToothSelectionModal from './ToothSelectionModal';

import DatePicker from 'react-datepicker';
import { format } from 'date-fns';

const Journal = () => {
    const navigate = useNavigate();
    const { journalId } = useParams();
    const [journal, setJournal] = useState(null);

    const handleInputChange = (value, property) => {
        if (value === null) 
            return;
        setJournal((prev) => {
            const updatedJournal = { ...prev, [property]: value };
            updateJournal(updatedJournal);
            return updatedJournal;
        });
    };

    useEffect(() => {
        getJournal();
    }, [journalId]);

    const getJournal = async () => {
        try {
            const response = await http.get(`/journals/${journalId}`);
            setJournal({
                ...response.data,
                date: new Date(response.data.date),
            });
            setTreatments(response.data.treatments || []);
            setDiagnoses(response.data.diagnoses || []);
            console.log('Journal fetch successful:', response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const updateJournal = async (journal) => {
        try {
            const params = {
                patientId: journal.patient.id,
                doctorId: journal.doctor.id,
                date: format(journal.date, `yyyy-MM-dd'T'HH:mm`)
            };
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


    const [treatments, setTreatments] = useState([]);
    const [newTreatment, setNewTreatment] = useState({});

    // TREATMENT POST
    const addTreatmentToJournal = async (selectedTreatment) => {
        try {
            const response = await http.post(`/journals/${journalId}/treatments`, selectedTreatment);
            setTreatments(prev => [...prev, response.data]);
        } catch (error) {
            console.error('Error adding treatments:', error);
        }
    };

    // TREATMENT LIST AND PUT SECTION
    useEffect(() => {
        if (journal && journal.treatments) {
            const initialAmounts = journal.treatments.reduce((acc, current) => {
                acc[current.id] = current.amount;
                return acc;
            }, {});
            setNewTreatment(initialAmounts);
        }
    }, [journal]);

    const handleAmountChange = (journalTreatmentId, event) => {
        const newAmount = Math.max(1, parseInt(event.target.value, 10));
        setNewTreatment((prevAmounts) => ({
            ...prevAmounts,
            [journalTreatmentId]: newAmount
        }));
        updateTreatmentAmount(journalTreatmentId, newAmount); // Debounce this? idk
    };

    const updateTreatmentAmount = async (journalTreatmentId, newAmount) => {
        try {
            await http.put(`/journals/${journalId}/treatments/${journalTreatmentId}`, { amount: newAmount });
            console.log('Treatment amount updated:', { journalTreatmentId, newAmount });
        } catch (error) {
            console.error('Error updating treatment amount:', error);
        }
    };
    
    // TREATMENT DELETE
    const deleteTreatment = async (treatmentId) => {
        try {
            await http.delete(`/journals/${journalId}/treatments/${treatmentId}`);
            setTreatments(prev => prev.filter(t => t.id !== treatmentId));
        } catch (error) {
            console.error('Error deleting treatment:', error);
        }
    };


    const [diagnoses, setDiagnoses] = useState([]);
    
    // DIAGNOSIS POST
    const addDiagnosisToJournal = async (diagnosis, toothcodes) => {
        if (!diagnosis || !toothcodes) {
            console.error('Both diagnosis ID and toothcode are required');
            return;
        }
        try {
            const response = await http.post(`/journals/${journalId}/diagnosis`, {diagnosisId: diagnosis.id, toothcodes: toothcodes});
            setDiagnoses(prev => [...prev, response.data]);
        } catch (error) {
            console.error('Error adding diagnosis:', error);
        }
    };

    // DIAGNOSIS DELETE
    const deleteDiagnosis = async (diagnosisId) => {
        try {
            await http.delete(`/journals/${journalId}/diagnosis/${diagnosisId}`);
            setDiagnoses(prev => prev.filter(d => d.id !== diagnosisId));
        } catch (error) {
            console.error('Error deleting diagnosis:', error);
        }
    };

    const [showModal, setShowModal] = useState(false);

    const [editingDiagnosis, setEditingDiagnosis] = useState(null);

    const handleEditDiagnosis = (diagnosis) => {
        setEditingDiagnosis(diagnosis);
        setShowModal(true);
    };

    const saveDiagnosis = (diagnosis, toothCodes) => {
        if (editingDiagnosis) {
            // Update existing diagnosis
            const updatedDiagnoses = diagnoses.map(d =>
                d.id === diagnosis.id ? { ...d, toothcodes: toothCodes } : d
            );
            setDiagnoses(updatedDiagnoses);
        } else {
            // Add new diagnosis
            addDiagnosisToJournal(diagnosis, toothCodes);
        }
        setEditingDiagnosis(null);
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

                    <div className="col-md-5 mt-4">
                        <h4>Add Treatments</h4>
                        <DebouncedSearchSelect
                            onChange={(value) => addTreatmentToJournal({ treatmentId: value.value.id, amount: 1 })}
                            api="treatments"
                        />
                        {treatments.map((treatment) => (
                            <div key={treatment.id} className="treatment-amount-control row g-3">
                                <div className="col-10">
                                    <span>{treatment.treatment.name}</span>
                                    <input
                                        type="number"
                                        value={newTreatment[treatment.id] || treatment.amount}
                                        onChange={(event) => handleAmountChange(treatment.id, event)}
                                        min="1"
                                        className="form-control"
                                    />
                                </div>
                                <button className="btn btn-danger col-2" onClick={() => deleteTreatment(treatment.id)}>
                                    <CgTrash size={22} />
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="col-md-5 mt-4">
                        <h4>Add Diagnoses</h4>

                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add Diagnosis</button>
                        <ToothSelectionModal
                            show={showModal}
                            onClose={() => {
                                setShowModal(false);
                                setEditingDiagnosis(null);
                            }}
                            onSelect={saveDiagnosis}
                            initialDiagnosis={editingDiagnosis}
                            initialToothCodes={editingDiagnosis ? editingDiagnosis.toothcodes : []}
                        />

                        {diagnoses.map(diagnosis => (
                            <div key={diagnosis.id} className="diagnosis-item">
                                <h5>{diagnosis.diagnosis.name}</h5>
                                <div className="toothcodes-container">
                                    {diagnosis.toothcodes.map((code, index) => (
                                        <span key={index} className="toothcode">{code}</span>
                                    ))}
                                </div>
                                <button onClick={() => handleEditDiagnosis(diagnosis)} className="edit-button">
                                    Edit
                                </button>
                                <button onClick={() => deleteDiagnosis(diagnosis.id)} className="delete-button">
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="col mt-4 journal-file-container">
                        <h4>Upload Files</h4>
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
