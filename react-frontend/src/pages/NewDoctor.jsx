import React, { useState, useEffect } from 'react';
import http from '../http-common';
import { Link, useNavigate, useParams } from 'react-router-dom';

const NewDoctor = () => {
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState({
        name: "",
        lastName: "",
        phoneNumber: ""
    });
    const [errorMessages, setErrorMessages] = useState('');

    const handleNameChange = (event) => {
        setDoctor({
            ...doctor,
            name: event.target.value
        })
    };
    const handlePhoneNumberChange = (event) => {
        setDoctor({
            ...doctor,
            phoneNumber: event.target.value
        })
    };

    useEffect(() => { }, [])

    const addDoctor = () => {
        http
            .post(`/addDoctor`, doctor)
            .then((response) => {
                console.log('Doctor added:', response.data);
                navigate("/doctor/" + response.data.id);
            })
            .catch((error) => {
                console.log(error);
                if (error.response && error.response.data) {
                    const errorObjects = error.response.data.map((error) => error.defaultMessage);
                    setErrorMessages(errorObjects);
                }
            });
    };

    return (
        <div className="container">
            <h2 className="text-info">Doctor page</h2>

            <div className="doctor-container">
                <div className="form-group mb-2">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" id="name" value={doctor?.name || ''} onChange={handleNameChange} />
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="phonenumber">Phone number</label>
                    <input type="text" className="form-control" id="phonenumber" value={doctor?.phoneNumber || ''} onChange={handlePhoneNumberChange} />
                </div>
            </div>
            <button type="submit" className="btn btn-primary" onClick={addDoctor}>Add new doctor</button>
            
            {errorMessages && (
                <div >
                    <ul className="list-group">
                        {errorMessages.map((errorMessage, index) => (
                            <li className="col-10 list-group item alert alert-danger p-3 mt-2" style={{ maxWidth: 400 }} key={index}>{errorMessage}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NewDoctor;