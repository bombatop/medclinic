import React, { useState } from 'react';
import { uploadAxios } from '../utils/http-common';

const FileUploader = ({ journalId, onUploadSuccess }) => {
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

    return (
        <div className="form-group row mt-2">
            <div className="col-5">
                <label htmlFor="fileUpload">Upload Files</label>
                <input type="file" className="form-control" id="fileUpload" multiple onChange={handleFileSelect} />
            </div>
            <button type="submit" className="col-2 btn btn-primary" onClick={handleFileUpload}>
                Upload
            </button>
        </div>
    );
};

export default FileUploader;
