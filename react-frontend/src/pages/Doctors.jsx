import React, { useState, useEffect } from 'react';
import http from '../http-common';
import { Link } from 'react-router-dom';

const Doctors = () => {
    const [doctors, setDoctors] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        getDoctors();
    }, [currentPage, searchQuery]);

    const getDoctors = () => {
        const pageSize = 5;
        const params = {
            page: currentPage,
            size: pageSize,
            searchQuery: searchQuery,
        };
        http
            .get(`/doctors`, { params })
            .then((response) => {
                setDoctors(response.data.content);
                setTotalPages(response.data.totalPages);
                console.log('Doctors fetch successful:', response.data.content, response.data.totalPages);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(0);
    };

    const filteredDoctors = doctors
        ? doctors.filter((doctor) =>
            doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <div className="container">
            <h2 className="text-info">Doctor list page</h2>

            <div className="row">
                <div className="col mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={{
                            height: 40
                        }}
                    />
                </div>

                <Link
                    className="col-2 btn btn-primary" 
                    to="/newDoctor"
                    style={{
                        height: 40
                    }}
                >
                Add new
                </Link>
            </div>

            <ul className="list-group mb-2">
                {filteredDoctors.map(doctor =>
                    <li className="col-10 list-group-item" key={doctor.id}>
                        <Link to={`/doctor/${doctor.id}`} style={{ textDecoration: 'none', color: 'black' }}> 
                            {doctor.name}
                        </Link>
                    </li>
                )}
            </ul>

            <div className="pagination">
                <button className="btn btn-secondary" onClick={handlePreviousPage} disabled={currentPage === 0}>
                    Previous
                </button>
                <span className="mx-2 mt-1">Page {currentPage + 1 - (totalPages === 0)} of {totalPages}</span>
                <button className="btn btn-secondary" onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Doctors;
