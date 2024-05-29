import React, { useState, useCallback, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import dayjs from 'dayjs';
import api, { axios_multipart, axios_blob } from '../../utils/http-common';
import { Box, Button, CircularProgress, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Delete as DeleteIcon, Download as DownloadIcon, Upload as UploadIcon } from '@mui/icons-material';

const JournalFilesTab = () => {
    const { journalData, setJournalData } = useOutletContext();
    const [files, setFiles] = useState(journalData.files);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setFiles(journalData.files);
    }, [journalData.files]);

    const onDrop = useCallback((acceptedFiles) => {
        const formData = new FormData();
        acceptedFiles.forEach((file) => {
            formData.append('files', file);
        });

        setUploading(true);

        axios_multipart.post(`/files/${journalData.id}`, formData)
            .then(response => {
                setJournalData({ ...journalData, files: response.data });
                setUploading(false);
            })
            .catch(error => {
                console.error('Error uploading files:', error);
                setUploading(false);
            });
    }, [journalData, setJournalData]);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleDownload = (fileId, fileName) => {
        axios_blob.get(`/files/${fileId}`)
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
            })
            .catch(error => {
                console.error('Error downloading file:', error);
            });
    };

    const handleDelete = (fileId) => {
        api.delete(`/files/${fileId}`)
            .then(() => {
                const updatedFiles = files.filter(file => file.id !== fileId);
                setJournalData({ ...journalData, files: updatedFiles });
            })
            .catch(error => {
                console.error('Error deleting file:', error);
            });
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} bytes`;
        const kb = bytes / 1024;
        if (kb < 1024) return `${kb.toFixed(1)} KB`;
        const mb = kb / 1024;
        return `${mb.toFixed(1)} MB`;
    };

    return (
        <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
            <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                    Список файлов
                </Typography>
                <List>
                    {files.length > 0 ? files.map(file => (
                        <ListItem
                            key={file.id}
                            secondaryAction={
                                <>
                                    <IconButton edge="end" aria-label="download" onClick={() => handleDownload(file.id, file.name)}>
                                        <DownloadIcon />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(file.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }
                        >
                            <ListItemText
                                primary={file.name}
                                secondary={`Загружен: ${dayjs(file.uploadDate).format('DD.MM.YYYY HH:mm')} - Размер: ${formatFileSize(file.fileSize)}`}
                            />
                        </ListItem>
                    )) : (
                        <ListItem>
                            <ListItemText primary="No files uploaded." />
                        </ListItem>
                    )}
                </List>
            </Box>
            <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                    Загрузить файлы
                </Typography>
                <Box
                    {...getRootProps()}
                    sx={{
                        border: '2px dashed #cccccc',
                        paddingX: '20px',
                        paddingY: '40px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                            borderColor: '#aaaaaa',
                        }
                    }}
                >
                    <input {...getInputProps()} />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {uploading ? (
                            <CircularProgress size={24} />
                        ) : (
                            <>
                                <UploadIcon fontSize="large" sx={{ mr: 1 }} />
                                <Typography variant="body1">
                                    Перетащите сюда или нажмите чтобы выбрать
                                </Typography>
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default JournalFilesTab;
