import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, FormGroup } from 'react-bootstrap';
import http from '../../http-common';
import { Link, useNavigate, useParams } from 'react-router-dom';

const Treatment = () => {
    const navigate = useNavigate();
    const { treatmentId } = useParams();
    const [treatment, setTreatment] = useState(null);
    const [prices, setPrices] = useState([]);

    const [newPrice, setNewPrice] = useState({
        agency: null,
        treatment: null,
        price: 0,
    });
    
    const [errorMessages, setErrorMessages] = useState('');

    useEffect(() => {
        getTreatment();
    }, []);

    useEffect(() => {
        getPrices();
    }, [treatment])

    const handleNewPriceChange = (e) => {
        const { property, value } = e.target;
        setNewPrice((prev) => ({ ...prev, [property]: value }));
    };


    // this piece of code essentially turns list of prices into map with agency as key
    // mapping it by object itself does not work, so I map it by stringifying object
    // and then parsing it back (my best solution, considering this map is immutable)
    function priceArrayToMap(pricesArray) {
        const pricesMap = pricesArray.reduce((map, price) => {
            const { agency, ...rest } = price;
            const key = JSON.stringify(agency);

            if (map.has(key)) {
                map.get(key).push(rest);
            } else {
                map.set(key, [rest]);
            }
            return map;
        }, new Map());

        const map = new Map();
        pricesMap.forEach((values, key) => {
            const agencyObject = JSON.parse(key);
            map.set(agencyObject, values);
        });
        return map;
    }

    const getTreatment = () => {
        http
            .get(`/treatment/${treatmentId}`)
            .then((response) => {
                setTreatment(response.data);
                console.log('Treatment fetch successful:', response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getPrices = () => {
        http
            .get(`/prices/${treatmentId}`)
            .then((response) => {
                setPrices(priceArrayToMap(response.data));
                console.log('Prices fetch successful:', prices);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const deletePrice = (priceId) => {
        http
            .delete(`/deletePrice/${priceId}`)
            .then((response) => {
                console.log('Price deleted:', response.data);
                getTreatment();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const deleteTreatment = () => {
        http
            .delete(`/deleteTreatment/${treatmentId}`)
            .then((response) => {
                console.log('Treatment deleted:', response.data);
                navigate('/treatments');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const addPrice = () => {
        http
            .post(`/addPriceForTreatment`, newPrice)
            .then((response) => {
                console.log('Price added:', response.data);
            })
            .catch((error) => {
                console.log(error);
                if (error.response && error.response.data) {
                    const errorObjects = error.response.data.map((error) => error.defaultMessage);
                    setErrorMessages(errorObjects);
                }
            });
    };


    return (
        <Container className="mt-4">
            <h2 mb={4}>Treatment page</h2>

            <Row mb={2}>
                <Col md={6}>
                    <FormGroup>
                        <label htmlFor="name">Treatment name</label>
                        <input type="text" className="form-control" style={{ height: 40 }} id="name" value={treatment?.name || ''} readOnly />
                    </FormGroup>
                </Col>
                <Col md={2}>
                    <Button variant="danger" className="mb-2 mt-4" style={{ height: 40 }} onClick={deleteTreatment}>
                        Delete Treatment
                    </Button>
                </Col>
            </Row>

            <h2 className="mb-4">Prices by Agency</h2>
            {prices && (
                <Row>
                    {Array.from(prices).map(([agency, pricesList]) => (
                        <Col key={agency.id} md={6} lg={4} className="mb-4">
                            <Card>
                                <Card.Header>
                                    <h3>{agency.name}</h3>
                                </Card.Header>
                                <Card.Body>
                                    <ul className="list-group">
                                        {pricesList.map((price) => (
                                            <li key={price.id} className="list-group-item">
                                                {price.price} at {price.date} for {price.treatment.name}
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <h4 className="mb-4">Add New Price</h4>
            {/* <Form onSubmit={addPrice}>
                <Row>
                    <Col md={4}>
                        <Form.Group controlId="newPriceAgency">
                            <Form.Label>Select Agency</Form.Label>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="newPriceTreatment">
                            <Form.Label>Select Treatment</Form.Label>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="newPriceAmount">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter price"
                                name="price"
                                value={newPrice.price}
                                onChange={handleNewPriceChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="primary" type="submit">
                    Add Price
                </Button>
            </Form> */}
            {/* <div className = "journal-container" >
                <div className="form-group mb-2">
                    <label htmlFor="doctor">Doctor</label>
                    <AsyncSelect
                        loadOptions={loadDoctors}
                        isClearable={true}
                        onChange={handleDoctorChange}
                    />
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="patient">Patient</label>
                    <AsyncSelect
                        loadOptions={loadPatients}
                        isClearable={true}
                        onChange={handlePatientChange}
                    />
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="date-picker-div">Date</label>
                    <div className="date-picker-div">
                        <DatePicker
                            selected={journal.date}
                            onChange={handleDateChange}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={10}
                            dateFormat="d MMMM, yyyy HH:mm"
                            className="form-control"
                            locale={ru}
                            timeCaption="время"
                        />
                    </div>
                </div>
            </div > */}
            
        </Container>
    );
};

export default Treatment;