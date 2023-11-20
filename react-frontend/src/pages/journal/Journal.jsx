import React, { useState, useEffect } from 'react';
import http, { uploadAxios, downloadAxios } from '../../http-common';
import { useNavigate, useParams } from 'react-router-dom';

import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";

const Journal = () => {
    const navigate = useNavigate();
    const { journalId } = useParams();
    const [journal, setJournal] = useState({
        date: new Date(),
        patient: null,
        doctor: null,
        prices: []
    });
    // const [treatment, setTreatment] = useState(null);
    // const [treatments, setTreatments] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState(null);

    const formattedDate = format(journal.date, 'yyyy-MM-dd HH:mm');

    const handleDateChange = (newDate) => {
        if (journal.prices.length === 0 && newDate !== journal.date) {
            setJournal({
                ...journal,
                date: newDate
            });
            updateJournal();
        }
    };

    // const handleTreatmentChange = (event) => {
    //     setTreatment(treatments[event.target.value]);
    // };

    useEffect(() => {
        getJournal();
        // getTreatments();
    }, []);
    
    //set treatment select
    // useEffect(() => {
    //     if (treatments && treatments.length > 0) {
    //         setTreatment(treatments[0]);
    //     }
    // }, [treatments]);

    const handleFileSelect = (event) => {
        setSelectedFiles(event.target.files);
    };

    const handleFileUpload = () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('files', selectedFiles[i]);
        }

        uploadAxios
            .post(`/upload/${journalId}`, formData)
            .then((response) => {
                const updatedJournal = { ...journal, files: response.data };
                setJournal(updatedJournal);
                setSelectedFiles([]);
                document.getElementById('fileUpload').value = '';
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const deleteFile = (fileId) => {
        http
            .delete(`/files/delete/${journalId}/${fileId}`)
            .then((response) => {
                setJournal({ ...journal, files: response.data });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const downloadFile = (file) => {
        downloadAxios
            .get(`/download/${journal.id}/${file.id}`, {
                responseType: 'arraybuffer',
            })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', file.name);
                document.body.appendChild(link);
                link.click();
            })
            .catch((error) => {
                console.error(error);
            });
    };


    const getJournal = () => {
        http
            .get(`/journal/${journalId}`)
            .then((response) => {
                setJournal({
                    ...response.data,
                    date: new Date(response.data.date)
                });
                console.log('Journal fetch successful:', response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // const getTreatments = () => {
    //     http
    //         .get(`/treatments`)
    //         .then((response) => {
    //             setTreatments(response.data);
    //             console.log('Treatments fetch successful:', response.data);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // };

    const updateJournal = () => {
        // VALIDATION IS BOTH CLIENT AND SERVER SIDE HERE
        if (journal.prices.length > 0) {
            return;
        }
        http
            .post(`/updateJournal/${journalId}`, { ...journal, date: formattedDate })
            .then((response) => {
                console.log('Journal updated:', response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // const addPrice = () => {
    //     http
    //         .post(`/addPriceForJournal/${journalId}`, { treatment: treatment, date: formattedDate})
    //         .then((response) => {
    //             console.log('Journal updated with new price:', response.data);
    //             const updatedJournal = { ...journal };
    //             updatedJournal.prices.push(response.data);
    //             setJournal(updatedJournal);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // };

    // const deletePrice = (priceId) => {
    //     http
    //         .delete(`/deletePriceForJournal/${journalId}/${priceId}`)
    //         .then((response) => {
    //             console.log('Price deleted:', response.data);
    //             const updatedPrices = journal.prices.filter((price) => price.id !== priceId);
    //             setJournal({ ...journal, prices: updatedPrices });
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // };

    const deleteJournal = () => {
        http
            .delete(`/deleteJournal/${journalId}`)
            .then(() => {
                console.log('Journal deleted');
                navigate('/journals');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="container">
            <h2 className="text-info">Journal page</h2>

            <div className="journal-container">
                <div className="form-group">
                    <div className="col-7 mb-2 form-group">
                        <label htmlFor="doctor">Doctor</label>
                        <input
                            type="text"
                            className="form-control"
                            id="doctor"
                            readOnly
                            value={journal.doctor ? journal.doctor.name : ''}
                        />
                    </div>

                    <div className="col-7 mb-2 form-group">
                        <label htmlFor="patient">Patient</label>
                        <input
                            type="text"
                            className="form-control"
                            id="patient"
                            readOnly
                            value={journal.patient ? journal.patient.name : ''}
                        />
                    </div>

                    {/* <div className="form-group row">
                        <div className="col-5">
                            <label htmlFor="date">Date</label>
                            <input type="datetime-local" className="form-control" id="date" value={journal.date} onChange={handleDateChange} />
                        </div>
                        <button type="submit" className={`col-2 mt-4 btn ${journal.prices.length > 0 ? 'btn-secondary' : 'btn-primary'}`} onClick={updateJournal}>
                            Update date
                        </button>
                    </div> */}

                    <div className="form-group mb-2">
                        <label htmlFor="date-picker-div">Date</label>
                        <div className="date-picker-div">
                            <DatePicker
                                selected={journal.date}
                                onChange={handleDateChange}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={10}
                                dateFormat="d MMMM, yyyy HH:mm"
                                className="form-control"
                                locale={ru}
                                timeCaption="время"
                            />
                        </div>
                    </div>
                </div>

                <button type="button" className="mt-3 mb-4 btn btn-danger" onClick={deleteJournal}>
                    Delete Journal
                </button>
            </div>

            <div className="file-upload-container">

                <div className="form-group row">
                    {journal.files && journal.files.length > 0 && (
                        <div className="col-7">
                            <label htmlFor="files">Uploaded files</label>
                            <ul className="list-group">
                                {journal.files.map((file) => (
                                    <li className="list-group-item" key={file.id}>
                                        <a className="link-dark link-offset-2 link-underline link-underline-opacity-0"
                                            onClick={() => downloadFile(file)}>{file.name}</a>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => deleteFile(file.id)}
                                            style={{
                                                color: 'red',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            &times; Delete
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="form-group row mt-2">
                    <div className="col-5">
                        {/* <label htmlFor="fileUpload">Upload Files</label> */}
                        <input type="file" className="form-control" id="fileUpload" multiple onChange={handleFileSelect} />
                    </div>
                    <button type="submit" className="col-2 btn btn-primary" onClick={handleFileUpload}>
                        Upload
                    </button>
                </div>
            </div>

            {/* <div className="treatments-container row mt-5">
                <div className="col-5 form-group">
                    <label htmlFor="treatment">Select treatment to add</label>
                    <select id="treatment" className="form-select" onChange={handleTreatmentChange}>
                        {treatments &&
                            treatments.map((treatment, index) => (
                                <option key={index} value={index}>
                                    {treatment.name}
                                </option>
                            ))}
                    </select>
                </div>
                <button type="submit" className="col-2 btn btn-primary mt-4" onClick={addPrice}>
                    Add new treatment
                </button>
            </div> */}

            {/* {journal.prices && journal.prices.length > 0 && (
                <div className="prices-container">
                    <div className="form-group">
                        <table className="table mt-2">
                            <thead>
                                <tr>
                                    <th>Treatment</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {journal.prices &&
                                    journal.prices.map((price) => (
                                        <tr key={price.id}>
                                            <td className="col-3">{price.treatment.name}</td>
                                            <td className="col-3">{price.price}</td>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => deletePrice(price.id)}
                                                    style={{
                                                        color: 'red',
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    &times; Delete
                                                </button>
                                        </tr>
                                    ))}
                                <tr>
                                    <td style={{fontWeight: 700}}>Total:</td>
                                    <td>{journal.prices.reduce((total, price) => total + price.price, 0)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )} */}
        </div>
    );
}

export default Journal;
