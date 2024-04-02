import React, { useState, useCallback } from 'react';
import { http, downloadAxios, uploadAxios } from '../../utils/http-common';
import './FileUploader.css';
import { CgSoftwareDownload, CgTrash, CgClose } from "react-icons/cg";
import { LuUploadCloud } from "react-icons/lu";
import LoadingOverlay from '../../components/LoadingOverlay'

const FileUploader = ({ journalId, initialFiles }) => {
    const [files, setFiles] = useState(initialFiles || []);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadingFiles, setUploadingFiles] = useState([]);

    //upload progress and management
    const uploadFile = useCallback((fileToUpload) => {
        const formData = new FormData();
        formData.append('files', fileToUpload);

        const config = {
            onUploadProgress: (progressEvent) => {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadingFiles(prevFiles => prevFiles.map(f =>
                    f.name === fileToUpload.name ? { ...f, progress } : f
                ));
            }
        };

        uploadAxios.post(`/upload/${journalId}`, formData, config)
            .then(response => {
                setUploadingFiles(prevFiles =>
                    prevFiles.filter(f => f.name !== fileToUpload.name)
                );
                setFiles(prevFiles => [
                    ...prevFiles,
                    ...response.data.filter((newFile) =>
                        !prevFiles.some((existingFile) => existingFile.id === newFile.id)
                    )
                ]); // this abomination exists because async upload call for multiple files leads to override in wrong order 
            })
            .catch(error => {
                console.error(error.status);
                setUploadingFiles(prevFiles => prevFiles.map(f =>
                    f.name === fileToUpload.name ? { ...f, error: true } : f
                ));
            });
    }, [journalId]);

    const handleFileRemove = useCallback((indexToRemove) => {
        setUploadingFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    }, []);
    
    //selection
    const handleFileSelect = useCallback((event) => {
        const newFiles = Array.from(event.target.files);
        const newUploadingFiles = newFiles.map(file => ({
            file,
            name: file.name,
            progress: 0,
            error: false
        }));
        setUploadingFiles(prevFiles => [...prevFiles, ...newUploadingFiles]);
        newFiles.forEach(uploadFile);
    }, [uploadFile]);
    
    //drag n drop
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files) {
            setSelectedFiles([...selectedFiles, ...e.dataTransfer.files]);
        }
    }, [selectedFiles]);

    //delete and download
    const deleteFile = async (fileId) => {
        try {
            const response = await http.delete(`/files/delete/${journalId}/${fileId}`);
            if (response.status === 200 || response.status === 204) { 
                setFiles(currentFiles => currentFiles.filter(file => file.id !== fileId));
            }
        } catch (error) {
            console.error(error);
        }
    };
    const downloadFile = async (file) => {
        try {
            const response = await downloadAxios.get(`/download/${journalId}/${file.id}`, {
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

    return (
        <>
            <input type="file" id="fileUpload" multiple onChange={handleFileSelect} style={{ display: 'none' }} />

            <div className={`col-md-3 upload-container ${dragActive ? 'drag-active' : ''}`} 
                onClick={() => document.getElementById('fileUpload').click()}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}>
                <div className="upload-content">
                    <LuUploadCloud size={50} />
                    <p>Upload a file<br />Drag and drop files here</p>
                </div>
            </div>

                <div className="col-md-3 mt-2">
                    <ul className="file-list list-group">
                        {uploadingFiles.length > 0 && uploadingFiles.map((file, index) => (
                            <li key={index} className="file-item list-group-item sm-3 d-flex align-items-center">
                                <span className="file-name">{file.name}</span>
                                {file.error ? (
                                    <CgClose size={22} className="icon-action" onClick={() => handleFileRemove(index)} />
                                ) : (
                                    <>
                                        {/* <LoadingOverlay />*/}
                                        <span className="file-name">{file.progress}%</span>
                                    </>
                                )}
                            </li>
                        ))}
                        {files.length > 0 && files.map((file) => (
                            <li className="file-item list-group-item sm-3 d-flex align-items-center" key={file.id}>
                                <span className="file-name"> {file.name} </span>
                                    
                                <div>
                                    <CgSoftwareDownload size={22} className="icon-action" onClick={() => downloadFile(file)} />
                                    <CgTrash size={22} className="icon-action" onClick={() => deleteFile(file.id)} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
        </>
    );
};

export default FileUploader;
