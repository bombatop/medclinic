import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../../utils/http-common';

const NewDiagnosis = () => {
    const navigate = useNavigate();
    const [diagnosis, setDiagnosis] = useState({});

    const handleInputChange = (event, property) => {
        setDiagnosis({
            ...diagnosis,
            [property]: event.target.value,
        });
    };

    useEffect(() => { }, []);

    const addDiagnosis = async () => {
        try {
            const response = await http.post(`/diagnoses`, diagnosis);
            console.log('Diagnosis added:', response.data);
            navigate("/diagnosis/" + response.data.id);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Diagnosis page</h2>

            <div className="form-group mb-2">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={diagnosis?.name || ''}
                    onChange={(event) => handleInputChange(event, 'name')}
                />
                <label htmlFor="name">Code</label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={diagnosis?.icdCode || ''}
                    onChange={(event) => handleInputChange(event, 'icdCode')}
                />
            </div>

            <button type="submit" className="btn btn-primary" onClick={addDiagnosis}>
                Add new diagnosis
            </button>
        </div>
    );
};

export default NewDiagnosis;