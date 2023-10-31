import React, { useState, useEffect } from 'react';
import http from '../http-common';
import { Link } from 'react-router-dom';
import Header from '../pages/Header'

const Journals = () => {
    const [journals, setJournals] = useState(null);
    const [datesList, setDatesList] = useState(null);
    const [date, setDate] = useState(getCurrentDate());
    const [table, setTable] = useState({});

    function getCurrentDate() {
        return formatDate(new Date());
    }

    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    useEffect(() => {
        if(!isNaN(new Date(date))) {
            setDatesList(getNextDates());
        }
    }, [date]);

    function getNextDates() {
        let d = new Date(date);
        let lst = [formatDate(d)];
        for (let i = 0; i < 6; i++) {
            d.setDate(d.getDate() + 1);
            lst.push(formatDate(new Date(d)));
        }
        return lst;
    }

    function formatDate(givenDate) {
        const d = new Date(givenDate);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function formatTime(givenDate) {
        const d = new Date(givenDate);
        const hours = d.getHours().toString();
        const minutes = d.getMinutes().toString().padStart(2, '0');;
        return `${hours}:${minutes}`;
    }

    useEffect(() => {
        getJournals();
    }, [datesList]);

    useEffect(() => {
        if (journals === null) return;

        const updatedTable = {};
        for (let jrn of journals) {
            let dt = new Date(jrn.date);
            dt.setHours(0, 0, 0, 0);
            dt.setDate(dt.getDate() + 1);
            dt = dt.toISOString().split('T')[0];
            if (!updatedTable.hasOwnProperty(dt)) {
                updatedTable[dt] = [];
            }
            updatedTable[dt].push(jrn);
        }
        for (let key in updatedTable) {
            updatedTable[key].sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        setTable(updatedTable);
    }, [journals]);

    const getJournals = () => {
        http
            .get(`/journalsByDateRange?startDate=${date}`)
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
                <div className="col-3 form-group">
                    <label htmlFor="date">Start of the week date select</label>
                    <input
                        type="date"
                        className="form-control"
                        id="date"
                        value={date}
                        onChange={handleDateChange}
                        style={{
                            height: 40
                        }}
                    />
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
                {datesList &&
                    datesList.map((date) => (
                        <div className="col" style={{ maxWidth: 260 }} key={date}>
                            <h6 className="text-center">{date}</h6>
                            {table[date] && table[date].length > 0 ? (
                                <div>
                                    {table[date].map((journal) => (
                                        <div className="card mt-2">
                                            <Link
                                                className="card-header text-center p-1"
                                                to={`/journal/${journal.id}`}
                                                style={{ textDecoration: 'none', color: 'black' }}
                                            >
                                                {formatTime(journal.date)}
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
                            ) : (
                                <div className="alert alert-info" role="alert">
                                    No journals
                                </div>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Journals;
