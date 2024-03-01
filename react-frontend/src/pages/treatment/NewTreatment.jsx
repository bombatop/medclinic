import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Alert, ListGroup, ListGroupItem } from 'react-bootstrap';
import http from '../../http-common';

const NewTreatment = () => {
    const navigate = useNavigate();
    const [treatment, setTreatment] = useState(null);
    const [errorMessages, setErrorMessages] = useState('');

    const handleInputChange = (event, property) => {
        setTreatment({
            ...treatment,
            [property]: event.target.value,
        });
    };

    useEffect(() => { }, [])

    const addTreatment = async () => {
        try {
            const response = await http.post(`/addTreatment`, treatment);
            console.log('Treatment added:', response.data);
            navigate("/treatment/" + response.data.id);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <Container className="mt-4">
            <h2>Treatment page</h2>

            <Form.Group className="mb-2">
                <Form.Label htmlFor="name">Name</Form.Label>
                <Form.Control
                    type="text"
                    id="name"
                    value={treatment?.name || ''}
                    onChange={(event) => handleInputChange(event, 'name')}
                />
            </Form.Group>

            <Button type="submit" className="btn btn-primary" onClick={addTreatment}>
                Add new treatment
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

export default NewTreatment;