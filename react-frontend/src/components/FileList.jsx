import React from 'react';
import { http, downloadAxios } from '../utils/http-common';

const FileList = ({ journalId, files, onFileChange }) => {
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
        <div className="row">
            {files && files.length > 0 && (
                <div className="col-7">
                    <label htmlFor="files">Uploaded files</label>
                    <ul className="list-group">
                        {files.map((file) => (
                            <li className="list-group-item" key={file.id}>
                                <a href="#!" className="link-dark link-offset-2 link-underline link-underline-opacity-0" onClick={() => downloadFile(file)}>{file.name}</a>
                                <button type="button" className="btn btn-danger" onClick={() => deleteFile(file.id)}>
                                    &times; Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FileList;
