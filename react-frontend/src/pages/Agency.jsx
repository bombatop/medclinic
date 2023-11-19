import React, { useState, useEffect } from 'react';
import http from '../http-common';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Alert, ListGroup, ListGroupItem } from 'react-bootstrap';

const Agency = () => {
    const navigate = useNavigate();
    const { agencyId } = useParams();
    const [agency, setAgency] = useState(null);
    const [errorMessages, setErrorMessages] = useState(null);

    useEffect(() => {
        getAgency();
    }, []);

    const handleNameChange = (event) => {
        setAgency({
            ...agency,
            name: event.target.value
        })
    };

    const getAgency = () => {
        http
            .get(`/agency/${agencyId}`)
            .then((response) => {
                setAgency(response.data);
                console.log('Agency fetch successful:', response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const updateAgency = () => {
        http
            .post(`/updateAgency/${agencyId}`, agency)
            .then((response) => {
                console.log('Agency updated:', response.data);
                setErrorMessages(null);
            })
            .catch((error) => {
                console.log(error);
                if (error.response && error.response.data) {
                    const errorObjects = error.response.data.map((error) => error.defaultMessage);
                    setErrorMessages(errorObjects);
                }
            });
    };

    const deleteAgency = () => {
        http
            .delete(`/deleteAgency/${agencyId}`)
            .then((response) => {
                console.log('Agency deleted:', response.data);
                navigate('/agencies');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <Container className="mt-4">
            <h2>Agency page</h2>

            <Form.Group className="mb-2">
                <Form.Label>Full name</Form.Label>
                <Form.Control type="text" value={agency?.name || ''} id="fullname" onChange={handleNameChange} />
            </Form.Group>

            <Button variant="primary" onClick={updateAgency}>
                Update info
            </Button>
            <Button variant="danger" className="mx-2" onClick={deleteAgency}>
                Delete agency
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

export default Agency;
