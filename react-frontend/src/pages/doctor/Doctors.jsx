import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, ListGroup, ListGroupItem } from 'react-bootstrap';

import http from '../../http-common';
import CustomPagination from '../../uitls/pagination';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPage, setSelectedPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        getDoctors();
    }, [selectedPage, searchQuery]);

    const getDoctors = () => {
        const params = {
            page: selectedPage - 1,
            searchQuery: searchQuery,
            size: 4,
        };

        http
            .get(`/doctors`, { params })
            .then((response) => {
                setDoctors(response.data.content);
                setTotalPages(response.data.totalPages);
                console.log(
                    'Doctors fetch successful:',
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
            <h2>Doctor Search</h2>

            <Row className="mb-3">
                <Col xs={8}>
                    <Form.Control type="text" placeholder="Search by name" value={searchQuery}
                        onChange={(e) => handleSearchChange(e)}
                    />
                </Col>
                <Col xs={2}>
                    <Link className="btn btn-primary" style={{ height: 40 }} to="/newDoctor">
                        Add new
                    </Link>
                </Col>
            </Row>

            <Row className="mb-2">
                <Col xs={8}>
                    <ListGroup>
                        {doctors.map((doctor) => (
                            <ListGroupItem key={doctor.id}>
                                <Link to={`/doctor/${doctor.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                                    {doctor.name}
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

export default Doctors;
