import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import http from '../../http-common';
import CustomPagination from '../../utils/pagination';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPage, setSelectedPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        getDoctors();
    }, [selectedPage, searchQuery]);

    const getDoctors = async () => {
        const params = {
            page: selectedPage - 1,
            searchQuery: searchQuery,
            size: 4,
        };

        try {
            const response = await http.get(`/doctors`, { params });
            setDoctors(response.data.content);
            setTotalPages(response.data.totalPages);
            console.log(
                'Doctors fetch successful:',
                response.data.content,
                response.data.totalPages
            );
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
        <div className="container mt-4">
            <h2>Doctor Search</h2>

            <div className="row mb-3">
                <div className="col-8">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e)}
                    />
                </div>
                <div className="col-2">
                    <Link to="/newDoctor" className="btn btn-primary w-100 h-100">
                        Add new
                    </Link>
                </div>
            </div>

            <div className="row mb-2">
                <div className="col-8">
                    <ul className="list-group">
                        {doctors.map((doctor) => (
                            <li className="list-group-item" key={doctor.id}>
                                <Link to={`/doctor/${doctor.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                                    {doctor.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="row mb-2">
                <div className="col-8">
                    {totalPages > 0 && (
                        <CustomPagination
                            selectedPage={selectedPage}
                            totalPages={totalPages}
                            handler={handlePageChange}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Doctors;