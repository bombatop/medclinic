import React, { useState, useEffect } from 'react';
import http from '../http-common';
import { Link, useNavigate, useParams } from 'react-router-dom';

const NewTreatment = () => {
    const navigate = useNavigate();
    const [treatment, setTreatment] = useState(null);

    const handleNameChange = (event) => {
        setTreatment({
            ...treatment,
            name: event.target.value
        })
    };

    useEffect(() => { }, [])

    const addTreatment = () => {
        http
            .post(`/addTreatment`, treatment)
            .then((response) => {
                console.log('Treatment added:', response.data);
                navigate("/treatment/" + response.data.id);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="container">
            <h2 className="text-info">Treatment page</h2>

            <div className="treatment-container row">
                <div className="form-group col-8">
                    <input type="text" placeholder='Insert new treatment name here' className="form-control" value={treatment?.name || ''} onChange={handleNameChange} />
                </div>
                <button type="submit" className="col-2 btn btn-primary" style={{height: 38}}onClick={addTreatment}>Add new treatment</button>
            </div>
        </div>
    );
};

export default NewTreatment;