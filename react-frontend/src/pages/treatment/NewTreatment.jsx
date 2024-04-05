import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../../utils/http-common';

const NewTreatment = () => {
    const navigate = useNavigate();
    const [treatment, setTreatment] = useState({});
    const [errorMessages, setErrorMessages] = useState([]);

    const handleInputChange = (event, property) => {
        setTreatment({
            ...treatment,
            [property]: event.target.value,
        });
    };

    useEffect(() => { }, []);

    const addTreatment = async () => {
        try {
            const response = await http.post(`/treatments`, treatment);
            console.log('Treatment added:', response.data);
            navigate("/treatment/" + response.data.id);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                const errorObjects = error.response.data.map((error) => error.defaultMessage);
                setErrorMessages(errorObjects);
            } else {
                setErrorMessages(['An unexpected error occurred']);
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Treatment page</h2>

            <div className="form-group mb-2">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={treatment?.name || ''}
                    onChange={(event) => handleInputChange(event, 'name')}
                />
            </div>

            <button type="submit" className="btn btn-primary" onClick={addTreatment}>
                Add new treatment
            </button>

            {errorMessages.length > 0 && (
                <div>
                    <ul className="list-group">
                        {errorMessages.map((errorMessage, index) => (
                            <li className="col-10 list-group-item alert alert-danger p-3 mt-2" style={{ maxWidth: 400 }} key={index}>
                                {errorMessage}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NewTreatment;