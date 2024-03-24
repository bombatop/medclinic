import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import 'react-datepicker/dist/react-datepicker.css';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import http from '../../utils/http-common';
import './Journals.css';

registerLocale('ru', ru);
setDefaultLocale('ru');

const Journals = () => {
    const [journals, setJournals] = useState(null);
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const getJournals = async () => {
            try {
                const response = await http.get(`/journalsByDateRange?startDate=${format(date, 'yyyy-MM-dd')}`);
                setJournals(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        getJournals();
    }, [date]);

    const table = useMemo(() => {
        const updatedTable = {};
        journals?.forEach(journal => {
            const dt = format(parseISO(journal.date), 'yyyy-MM-dd');
            if (!updatedTable[dt]) {
                updatedTable[dt] = [];
            }
            updatedTable[dt].push(journal);
        });

        return updatedTable;
    }, [journals]);

    const formatDate = (dateStr, formatStr) => format(parseISO(dateStr), formatStr, { locale: ru });

    return (
        <div>
            <div className="row">
                <div className={`col-2 form-group form-group-custom`}>
                    <label htmlFor="date-picker">Date</label>
                    <DatePicker
                        selected={date}
                        onChange={setDate}
                        dateFormat="d MMMM, yyyy"
                        className="form-control"
                        locale="ru"
                    />
                </div>
                <Link className={`col btn btn-primary add-button`} to="/newJournal">Add New</Link>
            </div>
            <div className="row mt-5">
                {Object.keys(table).map((keyDate) => (
                    <div className={`col col-journal`} key={keyDate}>
                        <h6 className="text-center">
                            {formatDate(keyDate, 'd, eeeeee')}
                        </h6>
                        {table[keyDate].map((journal) => (
                            <div className="card mt-2" key={journal.id}>
                                <Link className={`card-header text-center p-1 card-header-custom`} to={`/journal/${journal.id}`}>
                                    {formatDate(journal.date, 'HH:mm')}
                                </Link>
                                <div className="card-body mb-0 p-2 card-body-custom">
                                    <div className={`card-title card-title-custom`}>
                                        <Link className={`card-text-custom`} to={`/doctor/${journal.doctor.id}`}>
                                            {journal.doctor.name}
                                        </Link>
                                    </div>
                                    <div className={`card-text card-text-custom`}>
                                        <Link className={`card-text-custom`} to={`/patient/${journal.patient.id}`}>
                                            {journal.patient.name}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Journals;
