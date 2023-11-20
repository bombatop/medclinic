import React, { useState, useEffect } from 'react';
import http from '../../http-common';
import { Link } from 'react-router-dom';
import Header from '../Header'

import DatePicker from 'react-datepicker';
import CustomDate from '../../utils/CustomDate';
import { ru } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";

const Journals = () => {
    const [journals, setJournals] = useState(null);
    const [date, setDate] = useState(new CustomDate());
    const [table, setTable] = useState({});

    const handleDateChange = (value) => {
        setDate(new CustomDate(value));
    };

    useEffect(() => {
        getJournals();
    }, [date])

    useEffect(() => {
        if (journals === null) return;

        const updatedTable = {};
        for (let jrn of journals) {
            let dt = new CustomDate(jrn.date)
            dt.setHours(0, 0, 0, 0);
            if (!updatedTable.hasOwnProperty(dt)) {
                updatedTable[dt] = [];
            }
            updatedTable[dt].push(jrn);
        }
        for (let key in updatedTable) {
            console.log(key);
            updatedTable[key].sort((a, b) => new CustomDate(a.date) - new CustomDate(b.date));
        }
        setTable(updatedTable);
    }, [journals]);

    const getJournals = () => {
        http
            .get(`/journalsByDateRange?startDate=${date.formatDate()}`)
            .then((response) => {
                setJournals(response.data);
                console.log('Journals fetch successful:', response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="mt-4 mx-4">
            <div className="row">
                <div className="col-2 form-group">
                    <label htmlFor="date-picker-div">Date</label>
                    <div className="date-picker-div">
                        <DatePicker
                            selected={date}
                            onChange={handleDateChange}
                            dateFormat="d MMMM, yyyy"
                            className="form-control"
                            locale={ru}
                            timeCaption="время"
                        />
                    </div>
                </div>

                <Link
                    className="col-1 btn btn-primary mt-4"
                    to="/newJournal"
                    style={{
                        height: 40
                    }}
                >
                    Add New
                </Link>
            </div>

            <div className="row mt-5">
                {date && Object.keys(table).map((keyDate) => (
                    <div className="col" style={{ maxWidth: 260 }} key={keyDate}>

                        <h6 className="text-center">{new CustomDate(keyDate).getCardTitle()}</h6>

                        <div>
                            {table[keyDate].map((journal) => (
                                <div className="card mt-2" key={journal.id}> 
                                    <Link
                                        className="card-header text-center p-1"
                                        to={`/journal/${journal.id}`}
                                        style={{ textDecoration: 'none', color: 'black' }}
                                    >
                                        {new CustomDate(journal.date).formatTime()}
                                    </Link>
                                    <div className="card-body mb-0 p-2" key={journal.id}>
                                        <div className="card-title">
                                            <Link
                                                to={`/doctor/${journal.doctor.id}`}
                                                style={{ textDecoration: 'none', color: 'black', fontWeight: 600 }}
                                            >
                                                {journal.doctor.name}
                                            </Link>
                                        </div>
                                        <div className="card-text" style={{ fontSize: '14px' }}>
                                            <Link
                                                to={`/patient/${journal.patient.id}`}
                                                style={{ textDecoration: 'none', color: 'black' }}
                                            >
                                                {journal.patient.name}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Journals;