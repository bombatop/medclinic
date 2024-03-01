import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, ListGroup, ListGroupItem } from 'react-bootstrap';

import http from '../../http-common';
import CustomPagination from '../../utils/pagination';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPage, setSelectedPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        getPatients();
    }, [selectedPage, searchQuery]);

    const getPatients = async () => {
        const params = {
            page: selectedPage - 1,
            searchQuery: searchQuery,
            size: 4,
        };

        try {
            const response = await http.get(`/patients`, { params });
            const data = response.data;
            setPatients(data.content);
            setTotalPages(data.totalPages);
            console.log('Patients fetch successful:', data.content, data.totalPages);
        } catch (error) {
            console.error(error);
        }
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
            <h2>Patient Search</h2>

            <Row className="mb-3">
                <Col xs={8}>
                    <Form.Control type="text" placeholder="Search by name" value={searchQuery}
                        onChange={(e) => handleSearchChange(e)}
                    />
                </Col>
                <Col xs={2}>
                    <Link className="btn btn-primary" style={{ height: 40 }} to="/newPatient">
                        Add new
                    </Link>
                </Col>
            </Row>

            <Row className="mb-2">
                <Col xs={8}>
                    <ListGroup>
                        {patients.map((patient) => (
                            <ListGroupItem key={patient.id}>
                                <Link to={`/patient/${patient.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                                    {patient.name}
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

export default Patients;
