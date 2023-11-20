import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, ListGroup, ListGroupItem } from 'react-bootstrap';

import http from '../../http-common';
import CustomPagination from '../../utils/pagination';

const Treatments = () => {
    const [treatments, setTreatments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPage, setSelectedPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        getTreatments();
    }, [selectedPage, searchQuery]);

    const getTreatments = () => {
        const params = {
            page: selectedPage - 1,
            searchQuery: searchQuery,
            size: 4,
        };

        http
            .get(`/treatments`, { params })
            .then((response) => {
                setTreatments(response.data.content);
                setTotalPages(response.data.totalPages);
                console.log(
                    'Treatments fetch successful:',
                    response.data.content,
                    response.data.totalPages
                );
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages)
            setSelectedPage(page);
    };

    return (
        <Container className="mt-4">
            <h2>Treatment Search</h2>

            <Row className="mb-3">
                <Col xs={8}>
                    <Form.Control type="text" placeholder="Search by name" value={searchQuery}
                        onChange={(e) => handleSearchChange(e)}
                    />
                </Col>
                <Col xs={2}>
                    <Link className="btn btn-primary" style={{ height: 40 }} to="/newTreatment">
                        Add new
                    </Link>
                </Col>
            </Row>

            <Row className="mb-2">
                <Col xs={8}>
                    <ListGroup>
                        {treatments.map((treatment) => (
                            <ListGroupItem key={treatment.id}>
                                <Link to={`/treatment/${treatment.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                                    {treatment.name}
                                </Link>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </Col>
            </Row>

            <Row className="mb-2">
                <Col xs={8}>
                    {totalPages > 0 && (
                        <CustomPagination selectedPage={selectedPage} totalPages={totalPages} handler={handlePageChange} />
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Treatments;
