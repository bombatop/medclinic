import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Box, Button, CircularProgress, Typography, MenuItem, Select } from '@mui/material';
import { statusLabels } from '../../utils/scheduleSettings';
import api from '../../utils/http-common';
import dayjs from 'dayjs';

const formatDate = (dateStr, timeEnd, status) => {
    const date = dayjs(dateStr);
    return `${date.format('DD.MM.YYYY HH:mm')} - ${timeEnd} - ${statusLabels[status]}`;
};

const JournalLinkTab = () => {
    const { journalData, setJournalData } = useOutletContext();
    const [nextEntries, setNextEntries] = useState([]);
    const [prevEntries, setPrevEntries] = useState([]);
    const [selectedNext, setSelectedNext] = useState(journalData.nextEntry ? journalData.nextEntry.id : "");
    const [selectedPrev, setSelectedPrev] = useState(journalData.prevEntry ? journalData.prevEntry.id : "");
    const [loading, setLoading] = useState(true);

    console.log('selectedNext', selectedNext, journalData.nextEntry);
    console.log('selectedPrev', selectedPrev, journalData.prevEntry);
    const fetchLinks = async () => {
        try {
            const nextResponse = await api.get(`/journals/all-next/${journalData.id}`);
            const prevResponse = await api.get(`/journals/all-prev/${journalData.id}`);
            setPrevEntries(prevResponse.data);
            setNextEntries(nextResponse.data);
        } catch (error) {
            console.error('Error fetching linked journal data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, [journalData]);

    const handleLinkNext = async () => {
        try {
            const nextEntry = nextEntries.find(entry => entry.id === selectedNext);
            await api.put(`/journals/${journalData.id}/next/${selectedNext}`);
            setJournalData({ ...journalData, nextEntry });
        } catch (error) {
            console.log('Error linking next journal:', error);
        }
    };

    const handleUnlinkNext = async () => {
        try {
            await api.put(`/journals/${journalData.id}/unlink-next`);
            setJournalData({ ...journalData, nextEntry: null });
            setSelectedNext('');
        } catch (error) {
            console.error('Error unlinking next journal:', error);
        }
    };

    const handleLinkPrev = async () => {
        try {
            const prevEntry = prevEntries.find(entry => entry.id === selectedPrev);
            await api.put(`/journals/${selectedPrev}/next/${journalData.id}`);
            setJournalData({ ...journalData, prevEntry });
        } catch (error) {
            console.error('Error linking previous journal:', error);
        }
    };

    const handleUnlinkPrev = async () => {
        try {
            await api.put(`/journals/${selectedPrev}/unlink-next`);
            setJournalData({ ...journalData, prevEntry: null });
            setSelectedPrev('');
        } catch (error) {
            console.error('Error unlinking previous journal:', error);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box>
            <Typography variant="h6" sx={{ mt: 3 }}>Прошлый прием</Typography>
            <Select
                value={selectedPrev}
                onChange={(e) => setSelectedPrev(e.target.value)}
                fullWidth
            >
                {prevEntries.length === 0 &&
                    <MenuItem value="" disabled>Нет подходящих записей</MenuItem>
                }
                {journalData.prevEntry && 
                    <MenuItem key={journalData.prevEntry.id} value={journalData.prevEntry.id}>
                        {formatDate(journalData.prevEntry.date, journalData.prevEntry.timeEnd, journalData.prevEntry.status)}
                    </MenuItem>
                }
                {prevEntries.map(entry => (
                    <MenuItem key={entry.id} value={entry.id}>
                        {formatDate(entry.date, entry.timeEnd, entry.status)}
                    </MenuItem>
                ))}
            </Select>
            <Button
                onClick={handleLinkPrev}
                disabled={!selectedPrev || (journalData.prevEntry && journalData.prevEntry.id === selectedPrev)}
            >
                Сохранить связь
            </Button>
            <Button
                onClick={handleUnlinkPrev}
                color="error"
                disabled={journalData.prevEntry === null}
            >
                Удалить связь
            </Button>

            <Typography variant="h6">Следующий прием</Typography>
            <Select
                value={selectedNext}
                onChange={(e) => setSelectedNext(e.target.value)}
                fullWidth
            >   
                {nextEntries.length === 0 &&
                    <MenuItem value="" disabled>Нет подходящих записей</MenuItem>
                }
                {journalData.nextEntry &&
                    <MenuItem key={journalData.nextEntry.id} value={journalData.nextEntry.id}>
                        {formatDate(journalData.nextEntry.date, journalData.nextEntry.timeEnd, journalData.nextEntry.status)}
                    </MenuItem>
                }
                {nextEntries.map(entry => (
                    <MenuItem key={entry.id} value={entry.id}>
                        {formatDate(entry.date, entry.timeEnd, entry.status)}
                    </MenuItem>
                ))}
            </Select>
            <Button
                onClick={handleLinkNext}
                disabled={!selectedNext || (journalData.nextEntry && journalData.nextEntry.id === selectedNext)}
            >
                Сохранить связь
            </Button>
            <Button
                onClick={handleUnlinkNext}
                color="error"
                disabled={journalData.nextEntry === null}
            >
                Удалить связь
            </Button>
        </Box>
    );
};

export default JournalLinkTab;
