import React, { useState, useEffect } from 'react';
import http from '../../utils/http-common';
import { useNavigate } from 'react-router-dom';

const NewDoctor = () => {
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState({
        name: null,
        phoneNumber: null
    });

    const handleInputChange = (event, property) => {
        setDoctor({
            ...doctor,
            [property]: event.target.value,
        });
    };

    useEffect(() => { }, []);

    const addDoctor = async () => {
        try {
            const response = await http.post(`/doctors`, doctor);
            console.log('Doctor added:', response.data);
            navigate(`/doctor/${response.data.id}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container">
            <h2 className="text-info">Doctor page</h2>

            <div className="row g-3 align-items-center">
                <div className="col-auto">
                    <label htmlFor="fullname" className="col-form-label">Full name</label>
                </div>
                <div className="col-auto">
                    <input
                        type="text"
                        className="form-control"
                        id="fullname"
                        value={doctor?.name || ''}
                        onChange={(event) => handleInputChange(event, 'name')}
                    />
                </div>
            </div>

            <div className="row g-3 align-items-center">
                <div className="col-auto">
                    <label htmlFor="phonenumber" className="col-form-label">Phone number</label>
                </div>
                <div className="col-auto">
                    <input
                        type="text"
                        className="form-control"
                        id="phonenumber"
                        value={doctor?.phoneNumber || ''}
                        onChange={(event) => handleInputChange(event, 'phoneNumber')}
                    />
                </div>
            </div>

            <button type="submit" className="btn btn-primary mt-3" onClick={addDoctor}>Add new doctor</button>
        </div>
    );
};

export default NewDoctor;