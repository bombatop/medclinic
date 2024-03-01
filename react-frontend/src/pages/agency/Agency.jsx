import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Alert, ListGroup, ListGroupItem } from 'react-bootstrap';
import http from '../../http-common';

const Agency = () => {
    const navigate = useNavigate();
    const [errorMessages, setErrorMessages] = useState(null);
    const { agencyId } = useParams();
    
    const [agency, setAgency] = useState({
        loadedByDefault: false
    });

    useEffect(() => {
        getAgency();
    }, []);

    const handleInputChange = (value, property) => {
        if (value === null)
            return;
        setAgency({
            ...agency,
            [property]: value,
        });  
    };

    const getAgency = async () => {
        try {
            const response = await http.get(`/agency/${agencyId}`);
            setAgency(response.data);
            console.log('Agency fetch successful:', response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const updateAgency = async () => {
        try {
            const response = await http.post(`/updateAgency/${agencyId}`, agency);
            setErrorMessages(null);
            console.log('Agency updated:', response.data);
        } catch (error) {
            if (error.response && error.response.data) {
                const errorObjects = error.response.data.map((error) => error.defaultMessage);
                setErrorMessages(errorObjects);
            }
            console.error(error);
        }
    };

    const deleteAgency = async () => {
        try {
            const response = await http.delete(`/deleteAgency/${agencyId}`);
            console.log('Agency deleted:', response.data);
            navigate('/agencies');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container className='mt-4'>
            <h2>Agency page</h2>

            <Form.Group className='mb-2'>
                <Form.Label>Full name</Form.Label>
                <Form.Control
                    type='text' 
                    value={agency?.name || ''}
                    id='fullname'
                    onChange={(event) => handleInputChange(event, 'name')} />
            </Form.Group>

            <Form>  
                {['checkbox'].map((type) => (
                    <div key={`default-${type}`} className='mb-3'>
                        <Form.Check
                            checked={agency?.loadedByDefault}
                            type={type}
                            id={`default-${type}`}
                            label={`loaded by default`}
                            onChange={(event) => handleInputChange(event.target.checked, 'loadedByDefault')}
                        />
                    </div>
                ))}
            </Form>

            <Button variant='primary' onClick={updateAgency}>
                Update info
            </Button>
            <Button variant='danger' className='mx-2' onClick={deleteAgency}>
                Delete agency
            </Button>

            {errorMessages && (
                <ListGroup className='mt-2'>
                    {errorMessages.map((errorMessage, index) => (
                        <Alert key={index} variant='danger' className='p-2' style={{ maxWidth: 300 }}>
                            {errorMessage}
                        </Alert>
                    ))}
                </ListGroup>
            )}
        </Container>
    );
};

export default Agency;
