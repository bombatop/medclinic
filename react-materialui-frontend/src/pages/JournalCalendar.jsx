import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ru';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './customCalendar.css';
import api from '../utils/http-common';
import debounce from 'lodash.debounce';
import { Box, Button, TextField, CircularProgress, Autocomplete, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import JournalModal from '../components/JournalModal';

const localizer = momentLocalizer(moment);

const JournalCalendar = () => {
    const [journals, setJournals] = useState([]);
    // const [loadingJournals, setLoadingJournals] = useState(true);
    const [doctors, setDoctors] = useState([]);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedJournalId, setSelectedJournalId] = useState(null);
    const [startDate, setStartDate] = useState(moment().startOf('week').toDate());
    const [endDate, setEndDate] = useState(moment().endOf('week').toDate());
    const [currentView, setCurrentView] = useState('week');

    const fetchJournals = async (start, end) => {
        // setLoadingJournals(true);
        try {
            const params = {
                page: 0,
                size: 1000,
                sortField: 'date',
                sortOrder: 'asc',
                ...(selectedDoctor && { doctorId: selectedDoctor.id }),
                startDate: moment(start).format('YYYY-MM-DDTHH:mm'),
                endDate: moment(end).format('YYYY-MM-DDTHH:mm'),
            };
            const response = await api.get('/journals', { params });
            setJournals(response.data.content);
        } catch (error) {
            console.error('Error fetching journals:', error);
        }
        // setLoadingJournals(false);
    };

    const fetchDoctors = async (query = '') => {
        setLoadingDoctors(true);
        try {
            const response = await api.get('/doctors', {
                params: { searchQuery: query, page: 0, size: 7 }
            });
            setDoctors(response.data.content);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
        setLoadingDoctors(false);
    };

    const debouncedFetchDoctors = useCallback(debounce((query) => {
        fetchDoctors(query);
    }, 300), []);

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        fetchJournals(startDate, endDate);
    }, [selectedDoctor, startDate, endDate]);

    const handleOpenModal = (journalId = null) => {
        setSelectedJournalId(journalId);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        fetchJournals(startDate, endDate);
    };

    const events = journals.map(journal => ({
        id: journal.id,
        patientName: `${journal.patient.surname} ${journal.patient.name}`,
        doctorName: `${journal.doctor.surname} ${journal.doctor.name}`,
        start: moment(journal.date).toDate(),
        end: moment(journal.date).set({
            hour: moment(journal.timeEnd, 'HH:mm').hour(),
            minute: moment(journal.timeEnd, 'HH:mm').minute()
        }).toDate(),
        status: journal.status
    }));

    const handleRangeChange = (range) => {
        if (Array.isArray(range)) {
            setStartDate(moment(range[0]).toDate());
            setEndDate(moment(range[range.length - 1]).toDate());
        } else {
            setStartDate(moment(range.start).toDate());
            setEndDate(moment(range.end).toDate());
        }
    };

    const handleViewChange = (view) => {
        setCurrentView(view);
    };

    const CustomToolbar = (toolbar) => {
        const goToBack = () => {
            const view = toolbar.view;
            const currentDate = toolbar.date;
            const newDate = moment(currentDate).subtract(1, view === 'week' ? 'week' : 'day').toDate();
            toolbar.onNavigate('prev', newDate);
        };

        const goToNext = () => {
            const view = toolbar.view;
            const currentDate = toolbar.date;
            const newDate = moment(currentDate).add(1, view === 'week' ? 'week' : 'day').toDate();
            toolbar.onNavigate('next', newDate);
        };

        const goToCurrent = () => {
            const now = new Date();
            toolbar.onNavigate('TODAY', now);
            setCurrentView('day');
            toolbar.onView('day');
        };

        const changeView = (view) => {
            setCurrentView(view);
            toolbar.onView(view);
        };

        return (
            <div className="rbc-toolbar">
                <Button variant="text" color="primary" className="rbc-today-btn" onClick={goToCurrent}>Сегодня</Button>
                <span className="rbc-toolbar-label">
                    <span className="rbc-arrow-btn" onClick={goToBack}>&larr;</span>
                    {moment(toolbar.date).format(toolbar.view === 'week' ? 'MMMM YYYY' : 'MMMM DD, YYYY')}
                    <span className="rbc-arrow-btn" onClick={goToNext}>&rarr;</span>
                </span>
                <div className="rbc-view-buttons">
                    <Button variant="text" color="primary" onClick={() => changeView('day')} className={currentView === 'day' ? 'rbc-active' : ''}>День</Button>
                    <Button variant="text" color="primary" onClick={() => changeView('week')} className={currentView === 'week' ? 'rbc-active' : ''}>Неделя</Button>
                </div>
            </div>
        );
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Расписание
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button variant="contained" color="primary" onClick={() => handleOpenModal(null)} startIcon={<AddIcon />}>
                    Создать
                </Button>
                <Autocomplete
                    options={doctors}
                    getOptionLabel={(specialist) => `${specialist.surname} ${specialist.name} ${specialist.patronymic}`}
                    value={selectedDoctor}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onInputChange={(event, newInputValue) => {
                        setLoadingDoctors(true);
                        debouncedFetchDoctors(newInputValue);
                    }}
                    onChange={(event, newValue) => {
                        setSelectedDoctor(newValue);
                    }}
                    loading={loadingDoctors}
                    loadingText={"Поиск..."}
                    noOptionsText={"Нет данных"}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Специалист"
                            variant="outlined"
                            sx={{ width: 300, minWidth: 150 }}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loadingDoctors ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                />
            </Box>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 650 }}
                defaultView="week"
                views={['week', 'day']}
                onRangeChange={handleRangeChange}
                view={currentView}
                onView={handleViewChange}
                eventPropGetter={(event) => ({
                    className: `rbc-event ${event.status}`,
                })}
                onSelectEvent={(event) => handleOpenModal(event.id)}
                components={{
                    event: ({ event }) => (
                        <>
                            <span>{event.doctorName}</span>
                        </>
                    ),
                    toolbar: CustomToolbar
                }}
            />
            <JournalModal open={modalOpen} handleClose={handleCloseModal} data={journals.find(journal => journal.id === selectedJournalId)} journalId={selectedJournalId} />
        </Box>
    );
};

export default JournalCalendar;
