import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import http from '../../http-common';
import CustomPagination from '../../utils/pagination';

const Patients = () => {
    const navigate = useNavigate();
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
        <div className="container mt-4">
            <h2>Patient Search</h2>

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
                    <Link to="/newPatient" className="btn btn-primary" style={{ height: 40 }}>
                        Add new
                    </Link>
                </div>
            </div>

            <div className="row mb-2">
                <div className="col-8">
                    <ul className="list-group">
                        {patients.map((patient) => (
                            <li className="list-group-item" key={patient.id}>
                                <Link to={`/patient/${patient.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                                    {patient.name}
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

export default Patients;