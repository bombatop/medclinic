import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Alert, ListGroup, ListGroupItem } from 'react-bootstrap';
import http from '../../http-common';

const NewPatient = () => {
    const navigate = useNavigate();
    const [patient, setPatient] = useState({
        name: null,
        lastName: null,
        phoneNumber: null
    });
    const [errorMessages, setErrorMessages] = useState(null);

    const handleInputChange = (event, property) => {
        setPatient({
            ...patient,
            [property]: event.target.value,
        });
    };

    const addPatient = async () => {
        try {
            const response = await http.post(`/addPatient`, patient);
            console.log('Patient added:', response.data);
            navigate("/patient/" + response.data.id);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                const errorObjects = error.response.data.map((error) => error.defaultMessage);
                setErrorMessages(errorObjects);
            }
        }
    };

    return (
        <Container className="mt-4">
            <h2>Patient page</h2>

            <Form.Group className="mb-2">
                <Form.Label htmlFor="name">Name</Form.Label>
                <Form.Control
                    type="text"
                    className="form-control"
                    id="fullname"
                    value={patient?.name || ''}
                    onChange={(event) => handleInputChange(event, 'name')}
                />
            </Form.Group>

            <Form.Group className="mb-2">
                <Form.Label htmlFor="name">Phone number</Form.Label>
                <Form.Control
                    type="text"
                    className="form-control"
                    id="phonenumber"
                    value={patient?.phoneNumber || ''}
                    onChange={(event) => handleInputChange(event, 'phoneNumber')}
                />
            </Form.Group>

            <Button type="submit" className="btn btn-primary" onClick={addPatient}>
                Add new patient
            </Button>

            {errorMessages && (
                <div>
                    <ListGroup>
                        {errorMessages.map((errorMessage, index) => (
                            <ListGroup.Item
                                className="col-10 list-group-item alert alert-danger p-3 mt-2"
                                style={{ maxWidth: 400 }}
                                key={index}
                            >
                                {errorMessage}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            )}
        </Container>
    );
};

export default NewPatient;
