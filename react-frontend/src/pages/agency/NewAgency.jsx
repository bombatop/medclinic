import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Alert, ListGroup, ListGroupItem } from 'react-bootstrap';
import http from '../../http-common';

const NewAgency = () => {
    const navigate = useNavigate();
    const [errorMessages, setErrorMessages] = useState('');

    const [agency, setAgency] = useState(null);

    const handleInputChange = (event, property) => {
        setAgency({
            ...agency,
            [property]: event.target.value,
        });
    };

    const addAgency = async () => {
        try {
            const response = await http.post('/addAgency', agency);
            console.log('Agency added:', response.data);
            navigate('/agency/' + response.data.id);
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
            <h2>Agency page</h2>

            <Form.Group className="mb-2">
                <Form.Label htmlFor="name">Name</Form.Label>
                <Form.Control
                    type="text"
                    id="name"
                    value={agency?.name || ''}
                    onChange={(event) => handleInputChange(event, 'name')}
                />
            </Form.Group>

            <Button type="submit" className="btn btn-primary" onClick={addAgency}>
                Add new agency
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

export default NewAgency;