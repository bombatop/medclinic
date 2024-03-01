import React, { useState, useEffect } from 'react';
import http, { uploadAxios, downloadAxios } from '../../http-common';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Alert, Col, Accordion, FormGroup, Row, InputGroup } from 'react-bootstrap';

import AsyncSelect from 'react-select/async';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { data } from 'jquery';

const Treatment = () => {
    const navigate = useNavigate();
    const { treatmentId } = useParams();

    const [errorMessages, setErrorMessages] = useState(null);

    const [treatment, setTreatment] = useState(null);
    const [prices, setPrices] = useState({}); // Change 'prices' to state

    const [newPrice, setNewPrice] = useState({
        agency: null,
        treatment: null,
        price: 0,
        date: new Date(),
    });

    useEffect(() => {
        if (!treatmentId) return;

        (async () => {
            await getTreatment();
            // Note: getPrices will be called inside the getTreatment function
        })();
    }, [treatmentId]);

    useEffect(() => {
        if (treatment && treatment.name) {
            updateTreatment();
        }
    }, [treatment?.name]);

    const handleInputChange = (value, property) => {
        if (value === null) return;
        setNewPrice({
            ...newPrice,
            [property]: value,
        });
    };

    const getTreatment = async () => {
        try {
            const response = await http.get(`/treatment/${treatmentId}`);
            setTreatment(response.data);
            console.log('Treatment fetch successful:', response.data);

            // Now that treatment is set, call getPrices
            await getPrices(response.data.id);
        } catch (error) {
            console.error(error);
        }
    };

    const updateTreatment = async () => {
        try {
            const response = await http.post(`/updateTreatment/${treatment.id}`, treatment);
            console.log('Treatment updated:', response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteTreatment = async () => {
        try {
            const response = await http.delete(`/deleteTreatment/${treatment.id}`);
            console.log('Treatment deleted:', response.data);
            navigate('/treatments');
        } catch (error) {
            console.error(error);
        }
    };

    const getPrices = async (treatmentId) => {
        try {
            const response = await http.get(`/prices/${treatmentId}`);
            const newPrices = {};

            response.data.forEach((item) => {
                const { agency } = item;
                const agencyId = agency.id;

                if (!newPrices[agencyId]) {
                    newPrices[agencyId] = {
                        agencyInfo: { ...agency },
                        pricesList: [],
                    };
                }

                newPrices[agencyId].pricesList.push(item);
            });

            setPrices(newPrices); // Update prices state
            console.log('Prices fetch successful:', newPrices);
        } catch (error) {
            console.error(error);
        }
    };

    const deletePrice = async (price) => {
        try {
            const response = await http.delete(`/deletePrice/${price.id}`);
            console.log('Price deleted:', response.data);
            await getPrices();
        } catch (error) {
            console.error(error);
        }
    };

    const addPrice = async () => {
        try {
            console.log(newPrice);
            const response = await http.post(`/addPriceForTreatment`, { ...newPrice, treatment: treatment, date: format(newPrice.date, 'yyyy-MM-dd HH:mm') });
            console.log('Price added:', response.data);
            await getPrices();
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data) {
                const errorObjects = error.response.data.map((error) => error.defaultMessage);
                setErrorMessages(errorObjects);
            }
        }
    };

    const loadAgencies = async (inputValue, callback) => {
        try {
            const params = {
                searchQuery: inputValue,
                size: 10,
                page: 0,
            };
            const response = await http.get(`/agencies`, { params });
            const options = response.data.content.map((agency) => ({
                value: agency,
                label: agency.name,
            }));
            console.log('Doctors fetch on query {' + inputValue + '} successful: ', options);
            callback(options);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container className="mt-4">
            <h2 mb={4}>Treatment page</h2>
            <Row mb={2}>
                <Col md={6}>
                    <Form.Group as="div" controlId="formFullName" className="mb-2">
                        <Form.Label>Full name</Form.Label>
                        <Form.Control
                            type="text"
                            value={treatment ? treatment.name || '' : ''}
                            onChange={(event) => setTreatment({ ...treatment, name: event.target.value })}
                        />
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Button variant="danger" className="mb-2 mt-4" style={{ height: 40 }} onClick={deleteTreatment}>
                        Delete Treatment
                    </Button>
                </Col>
            </Row>


            <h4 className="mb-4 mt-4">Add New Price</h4>
            <Form>
                <Row>
                    <Col md={4}>
                        <Form.Group controlId="newPriceAgency">
                            <AsyncSelect
                                loadOptions={loadAgencies}
                                isClearable={true}
                                onChange={(event) => handleInputChange(event?.value, 'agency')}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="date-picker-div">
                            <DatePicker
                                selected={newPrice.date}
                                onChange={(date) => handleInputChange(date, 'date')}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={10}
                                dateFormat="d MMMM, yyyy HH:mm"
                                className="form-control"
                                timeCaption="время"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group controlId='newPrice'>
                            <Form.Control
                                placeholder="price"
                                onChange={(event) => handleInputChange(event.target.value, 'price')}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Button variant="primary" onClick={addPrice}>
                            Add Price
                        </Button>
                    </Col>
                </Row>
            </Form>

            <h3 className="mb-4 mt-4">Prices by Agency</h3>
            {prices && (
                <div>
                    {Object.keys(prices).map((agencyId) => {
                        const { agencyInfo, pricesList } = prices[agencyId];

                        return (
                            <div key={agencyId}>
                                <h4>Agency {agencyInfo.name}</h4>
                                <ul>
                                    {pricesList.map((element) => (
                                        <li key={element.id}>
                                            Price: {element.price}, Date: {element.date}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            )}

            
        </Container>
    );
};

export default Treatment;