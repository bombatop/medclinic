import React, { useState } from 'react';
import { http, downloadAxios, uploadAxios } from '../utils/http-common';
import './FileUploader.css';

import { CgSoftwareDownload } from "react-icons/cg";
import { CgTrash } from "react-icons/cg";

const FileUploader = ({ className, journalId, files, onFileChange, onUploadSuccess }) => {
    const [selectedFiles, setSelectedFiles] = useState(null);

    const handleFileSelect = (event) => {
        setSelectedFiles(event.target.files);
    };

    const handleFileUpload = async () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('files', selectedFiles[i]);
        }

        try {
            const response = await uploadAxios.post(`/upload/${journalId}`, formData);
            onUploadSuccess(response.data); // Notify parent component
            setSelectedFiles([]);
            document.getElementById('fileUpload').value = '';
        } catch (error) {
            console.error(error);
        }
    };

    const deleteFile = async (fileId) => {
        try {
            await http.delete(`/files/delete/${journalId}/${fileId}`);
            onFileChange(); // Notify parent to update the file list
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
        <div className={className}>

            <div className="row form-group">
                <div className="col-5">
                    {/* <label htmlFor="fileUpload">Uploaded Files</label> */}
                    <input className="form-control" onChange={handleFileSelect} type="file" id="fileUpload" multiple />
                </div>
                <button className="col-2 btn btn-primary" onClick={handleFileUpload} type="submit">
                    Upload
                </button>
            </div>

            <div className="row gy-1">
                {files && files.length > 0 && (
                    <div className="col-7">
                        {/* <label htmlFor="files">Upload files</label> */}
                        <ul className="file-list list-group">
                            {files.map((file) => (
                                <li className="file-item list-group-item d-flex align-items-center" key={file.id}>
                                    <span className="file-name"> {file.name} </span>
                                    <div>
                                        <CgSoftwareDownload size={22} className="icon-action" onClick={() => downloadFile(file)} />
                                        <CgTrash size={22} className="icon-action" onClick={() => deleteFile(file.id)} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

        </div>
    );
};

export default FileUploader;
