import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import DebouncedSearchSelect from '../../components/DebouncedSearchSelect';
import { CgTrash, CgPen, CgCross, CgClose } from "react-icons/cg";

import http from '../../utils/http-common';
import FileUploader from './FileUploader';
import ToothSelectionModal from './ToothSelectionModal';
import JournalSelectionModal from './JournalSelectionModal';

import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const Journal = () => {
    const navigate = useNavigate();

    const { journalId } = useParams();
    const [journal, setJournal] = useState(null);

    const [treatments, setTreatments] = useState([]);
    const [newTreatment, setNewTreatment] = useState({});

    const [diagnoses, setDiagnoses] = useState([]);
    const [showModalTooth, setShowModalTooth] = useState(false);
    const [editingDiagnosis, setEditingDiagnosis] = useState(null);

    const [journals, setJournals] = useState([]);
    const [previousEntry, setPreviousEntry] = useState(null);
    const [nextEntry, setNextEntry] = useState(null);
    const [isEditingPrevious, setIsEditingPrevious] = useState(false);
    const [isEditingNext, setIsEditingNext] = useState(false);
    const [modalType, setModalType] = useState('');
    const [showModalJournal, setShowModalJournal] = useState(false);

    // PUT
    const handleInputChange = (value, property) => {
        if (value === null)
            return;
        setJournal((prev) => {
            const updatedJournal = { ...prev, [property]: value };
            updateJournal(updatedJournal);
            return updatedJournal;
        });
    };

    // GET
    useEffect(() => {
        getJournal();
    }, [journalId]);

    const getJournal = async () => {
        try {
            const response = await http.get(`/journals/${journalId}`);
            setJournal({
                ...response.data,
                dateStart: new Date(response.data.dateStart),
                dateEnd: new Date(response.data.dateEnd),
            });
            setTreatments(response.data.treatments || []);
            setDiagnoses(response.data.diagnoses || []);
            setPreviousEntry(response.data.previousEntry);
            setNextEntry(response.data.nextEntry);
            console.log('Journal fetch successful:', response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // PUT
    const updateJournal = async (journal) => {
        try {
            const params = {
                patientId: journal.patient.id,
                doctorId: journal.doctor.id,
                status: journal.status,
                dateStart: format(journal.dateStart, `yyyy-MM-dd'T'HH:mm`, { locale: ru }),
                dateEnd: format(journal.dateEnd, `yyyy-MM-dd'T'HH:mm`, { locale: ru })
            };
            const response = await http.put(`/journals/${journalId}`, params);
            console.log('Journal updated:', response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // DELETE
    const deleteJournal = async () => {
        try {
            await http.delete(`/journals/${journalId}`);
            console.log('Journal deleted');
            navigate('/journals');
        } catch (error) {
            console.error(error);
        }
    };

    // POST
    const addTreatmentToJournal = async (selectedTreatment) => {
        try {
            const response = await http.post(`/journals/${journalId}/treatments`, selectedTreatment);
            setTreatments(prev => [...prev, response.data]);
        } catch (error) {
            console.error('Error adding treatments:', error);
        }
    };

    // LIST AND PUT
    useEffect(() => {
        if (journal && journal.treatments) {
            const initialAmounts = journal.treatments.reduce((acc, current) => {
                acc[current.id] = current.amount;
                return acc;
            }, {});
            setNewTreatment(initialAmounts);
        }
    }, [journal]);

    // AMOUNT MANAGEMENT
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

    // DELETE
    const deleteTreatment = async (treatmentId) => {
        try {
            await http.delete(`/journals/${journalId}/treatments/${treatmentId}`);
            setTreatments(prev => prev.filter(t => t.id !== treatmentId));
        } catch (error) {
            console.error('Error deleting treatment:', error);
        }
    };

    // POST
    const addDiagnosisToJournal = async (diagnosis, toothcodes) => {
        if (!diagnosis || !toothcodes) {
            console.error('Both diagnosis ID and toothcode are required');
            return;
        }
        try {
            const response = await http.post(`/journals/${journalId}/diagnosis`, { diagnosisId: diagnosis.id, toothcodes: toothcodes });
            setDiagnoses(prev => [...prev, response.data]);
        } catch (error) {
            console.error('Error adding diagnosis:', error);
        }
    };

    // DELETE
    const deleteDiagnosis = async (diagnosisId) => {
        try {
            await http.delete(`/journals/${journalId}/diagnosis/${diagnosisId}`);
            setDiagnoses(prev => prev.filter(d => d.id !== diagnosisId));
        } catch (error) {
            console.error('Error deleting diagnosis:', error);
        }
    };

    // MODAL SHOW
    const handleEditDiagnosis = (diagnosis) => {
        setEditingDiagnosis(diagnosis);
        setShowModalTooth(true);
    };

    // PUT ELSE POST
    const saveDiagnosis = async (diagnosis, toothCodes) => {
        if (editingDiagnosis) {
            try {
                const response = await http.put(`/journals/${journalId}/diagnosis/${diagnosis.id}`,
                    { diagnosisId: diagnosis.id, toothcodes: toothCodes });
                setDiagnoses(prevDiagnoses =>
                    prevDiagnoses.map(d => d.id === response.data.id ? response.data : d)
                );
            } catch (error) {
                console.error('Error updating diagnosis:', error);
            }
        } else {
            await addDiagnosisToJournal(diagnosis, toothCodes);
        }
        setEditingDiagnosis(null);
        setShowModalTooth(false);
    };

    const getJournalsToLink = async (type) => {
        try {
            const endpoint = type === 'previous' ? 'all-prev' : 'all-next';
            const response = await http.get(`/journals/${endpoint}/${journalId}`);
            console.log(`journal ${endpoint} fetch: `, response.data);
            setJournals(response.data); // Set the journals state here
        } catch (error) {
            console.error('Error fetching journals:', error);
        }
    };

    useEffect(() => {
        if (showModalJournal) {
            getJournalsToLink(modalType);
        }
    }, [showModalJournal]);

    const updateJournalLink = async (type, selectedEntry) => {
        try {
            if (type === 'previous') {
                await http.put(`/journals/${selectedEntry.id}/next/${journalId}`);
            } else {
                await http.put(`/journals/${journalId}/next/${selectedEntry.id}`);
            }
            getJournal();
        } catch (error) {
            console.error('Error updating journal link:', error);
        }
    };
    const unlinkNextJournal = async (journal) => {
        try {
            await http.put(`/journals/${journal.id}/unlink-next`);
            getJournal();
        } catch (error) {
            console.error('Error unlinking next journal:', error);
        }
    };

    const handleSelectJournal = (journal) => {
        updateJournalLink(modalType, journal);
        setShowModalJournal(false);
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
                                    selected={journal.dateStart}
                                    onChange={(date) => handleInputChange(date, 'dateStart')}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={10}
                                    dateFormat="d MMMM, yyyy HH:mm"
                                    className="form-control"
                                    timeCaption="время"
                                />
                            </div>
                            <div className="from-group">
                                <DatePicker
                                    selected={journal.dateEnd}
                                    onChange={(date) => handleInputChange(date, 'dateEnd')}
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

                        <button className="btn btn-primary" onClick={() => setShowModalTooth(true)}>Add Diagnosis</button>
                        <ToothSelectionModal
                            show={showModalTooth}
                            onClose={() => {
                                setShowModalTooth(false);
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

                    <div className="col-md-5 mt-4">
                        <h4>Treatment Plan</h4>
                        <div className="treatment-plan-section">
                            <div className="row g-3 align-items-center">
                                <div className="col-auto">
                                    <label className="col-form-label">Prev Journal:</label>
                                </div>
                                <div className="col-auto">
                                    <input
                                        type="text"
                                        className="form-control"
                                        readOnly
                                        value={previousEntry ? previousEntry.dateStart : 'No previous journal'}
                                    />
                                </div>
                                <div className="col-auto">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => {
                                            setIsEditingPrevious(true);
                                            setModalType('previous');
                                            setShowModalJournal(true);
                                        }}
                                    >
                                        <CgPen />
                                    </button>
                                    {previousEntry && (
                                        <div className="col-auto">
                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() => unlinkNextJournal(journal.previousEntry)}
                                            >
                                                <CgClose />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="row g-3 align-items-center mt-3">
                                <div className="col-auto">
                                    <label className="col-form-label">Next Journal:</label>
                                </div>
                                <div className="col-auto">
                                    <input
                                        type="text"
                                        className="form-control"
                                        readOnly
                                        value={nextEntry ? nextEntry.dateStart : 'No next journal'}
                                    />
                                </div>
                                <div className="col-auto">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => {
                                            setIsEditingNext(true);
                                            setModalType('next');
                                            setShowModalJournal(true);
                                        }}
                                    >
                                        <CgPen />
                                    </button>
                                    {nextEntry && (
                                        <div className="col-auto">
                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() => unlinkNextJournal(journal)}
                                            >
                                                <CgClose />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
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
            <JournalSelectionModal
                show={showModalJournal}
                onClose={() => setShowModalJournal(false)}
                onSelect={handleSelectJournal}
                type={modalType}
                journals={journals}
            />
        </div>
    );
}

export default Journal;
