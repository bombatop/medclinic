import React, { useState, useEffect } from 'react';
import http from '../../http-common';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Alert, ListGroup, ListGroupItem } from 'react-bootstrap';

const Doctor = () => {
    const navigate = useNavigate();
    const { doctorId } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [errorMessages, setErrorMessages] = useState(null);

    const handleInputChange = (event, property) => {
        setDoctor({
            ...doctor,
            [property]: event.target.value,
        });
    };

    useEffect(() => {
        getDoctor();
    }, [])

    const getDoctor = () => {
        http
            .get(`/doctor/${doctorId}`)
            .then((response) => {
                setDoctor(response.data);
                console.log('Doctor fetch successful:', response.data);
            })
        .catch ((error) => {
            console.log(error);
            if (error.response && error.response.data) {
                const errorObjects = error.response.data.map((error) => error.defaultMessage);
                setErrorMessages(errorObjects);
            }
        });
    };

    const updateDoctor = () => {
        http
            .post(`/updateDoctor/${doctorId}`, doctor)
            .then((response) => {
                console.log('Doctor updated:', response.data);
            })
            .catch((error) => {
                console.log(error);
                if (error.response && error.response.data) {
                    const errorObjects = error.response.data.map((error) => error.defaultMessage);
                    setErrorMessages(errorObjects);
                }
            });
    };

    const deleteDoctor = () => {
        http
            .delete(`/deleteDoctor/${doctorId}`)
            .then((response) => {
                console.log('Doctor deleted:', response.data);
                navigate('/doctors');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <Container className="mt-4">
            <h2>Doctor page</h2>

            <Form.Group as="div" controlId="formFullName" className="mb-2">
                <Form.Label>Full name</Form.Label>
                <Form.Control type="text" value={doctor?.name || ''} onChange={(event) => handleInputChange(event, 'name')}/>
            </Form.Group>

            <Form.Group as="div" controlId="formPhoneNumber" className="mb-2">
                <Form.Label>Phone number</Form.Label>
                <Form.Control type="text" value={doctor?.phoneNumber || ''} onChange={(event) => handleInputChange(event, 'phoneNumber')}/>
            </Form.Group>

            <Button variant="primary" type="submit" className="mb-2" onClick={updateDoctor}>
                Update info
            </Button>
            <Button variant="danger" className="mx-2 mb-2" onClick={deleteDoctor}>
                Delete Doctor
            </Button>

            {errorMessages && (
                <ListGroup className="mt-2">
                    {errorMessages.map((errorMessage, index) => (
                        <Alert key={index} variant="danger" className="p-2" style={{ maxWidth: 300 }}>
                            {errorMessage}
                        </Alert>
                    ))}
                </ListGroup>
            )}
        </Container>
    );
};

export default Doctor;
