import React, { useState, useEffect } from 'react';
import http from '../http-common';
import { useNavigate, useParams } from 'react-router-dom';

const Journal = () => {
    const navigate = useNavigate();
    const { journalId } = useParams();
    const [journal, setJournal] = useState(null);
    const [treatment, setTreatment] = useState(null);
    const [treatments, setTreatments] = useState(null);

    const handleDateChange = (event) => {
        setJournal({
            ...journal,
            date: event.target.value
        });
    };

    const handleTreatmentChange = (event) => {
        setTreatment(treatments[event.target.value]);
    };

    useEffect(() => {
        getJournal();
        getTreatments();
    }, []);

    useEffect(() => {
        if (treatments && treatments.length > 0) {
            setTreatment(treatments[0]);
        }
    }, [treatments]);

    const getJournal = () => {
        http
            .get(`/journal/${journalId}`)
            .then((response) => {
                setJournal(response.data);
                console.log('Journal fetch successful:', response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getTreatments = () => {
        http
            .get(`/treatments`)
            .then((response) => {
                setTreatments(response.data);
                console.log('Treatments fetch successful:', response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const updateJournal = () => {
        if (journal.date.indexOf("T") !== -1) {
            journal.date = journal.date.replace("T", " ");
        }
        /// ADD SOME FINE VALIDATION LATER BRUH
        if(journal.prices.length > 0)
            return;
        http
            .post(`/updateJournal/${journalId}`, journal)
            .then((response) => {
                console.log('Journal updated:', response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const addPrice = () => {
        if (journal.date.indexOf("T") !== -1) {
            setJournal({
                ...journal,
                date: journal.date.replace("T", " ")
            });
        }
        http
            .post(`/addPriceForJournal/${journalId}`, { treatment: treatment, date: journal.date })
            .then((response) => {
                console.log('Journal updated:', response.data);
                const updatedJournal = { ...journal };
                updatedJournal.prices.push(response.data);
                setJournal(updatedJournal);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const deletePrice = (priceId) => {
        http
            .delete(`/deletePriceForJournal/${journalId}/${priceId}`)
            .then((response) => {
                console.log('Price deleted:', response.data);
                const updatedJournal = { ...journal };
                updatedJournal.prices = updatedJournal.prices.filter((price) => price.id !== priceId);
                setJournal(updatedJournal);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const deleteJournal = () => {
        http
            .delete(`/deleteJournal/${journalId}`)
            .then(() => {
                console.log('Journal deleted');
                navigate('/journals');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    if (journal === null) {
        return <div>Loading...</div>;
    } else {
        return (
            <div className="container">
                <h2 className="text-info">Journal page</h2>

                <div className="journal-container">
                    <div className="form-group">
                        <div className="col-7 mb-2 form-group">
                            <label htmlFor="doctor">Doctor</label>
                            <input
                                type="text"
                                className="form-control"
                                id="doctor"
                                readOnly
                                value={journal.doctor ? journal.doctor.firstName + ' ' + journal.doctor.lastName : ''}
                            />
                        </div>

                        <div className="col-7 mb-2 form-group">
                            <label htmlFor="patient">Patient</label>
                            <input
                                type="text"
                                className="form-control"
                                id="patient"
                                readOnly
                                value={journal.patient ? journal.patient.firstName + ' ' + journal.patient.lastName : ''}
                            />
                        </div>

                        <div className="form-group row">
                            <div className="col-5">
                                <label htmlFor="date">Date</label>
                                <input type="datetime-local" className="form-control" id="date" value={journal.date} onChange={handleDateChange} />
                            </div>
                            <button type="submit" className="col-2 mt-4 btn btn-primary" onClick={updateJournal}>
                                Update date
                            </button>
                        </div>
                    </div>

                    <button type="button" className="mt-3 btn btn-danger" onClick={deleteJournal}>
                        Delete Journal
                    </button>
                </div>

                <div className="treatments-container row mt-5">
                    <div className="col-5 form-group">
                        <label htmlFor="treatment">Select treatment to add</label>
                        <select id="treatment" className="form-select" onChange={handleTreatmentChange}>
                            {treatments &&
                                treatments.map((treatment, index) => (
                                    <option key={index} value={index}>
                                        {treatment.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <button type="submit" className="col-2 btn btn-primary mt-4" onClick={addPrice}>
                        Add new treatment
                    </button>
                </div>
                {journal.prices.length > 0 && (
                    <div className="prices-container">
                        <div className="form-group">
                            <table className="table mt-2">
                                <thead>
                                    <tr>
                                        <th>Treatment</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {journal.prices &&
                                        journal.prices.map((price) => (
                                            <tr key={price.id}>
                                                <td className="col-3">{price.treatment.name}</td>
                                                <td className="col-3">{price.price}</td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                        onClick={() => deletePrice(price.id)}
                                                        style={{
                                                            color: 'red',
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        &times; Delete
                                                    </button>
                                            </tr>
                                        ))}
                                    <tr>
                                        <td style={{fontWeight: 700}}>Total:</td>
                                        <td>{journal.prices.reduce((total, price) => total + price.price, 0)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        );
    }
};

export default Journal;
