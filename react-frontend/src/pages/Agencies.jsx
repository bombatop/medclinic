import React, { useState, useEffect } from 'react';
import http from '../http-common';
import { Link, useNavigate, useParams } from 'react-router-dom';

const Agencies = () => {
    const navigate = useNavigate();
    const [agencies, setAgencies] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        getAgencies();
    }, [currentPage, searchQuery]);

    const getAgencies = () => {
        const pageSize = 5;
        const params = {
            page: currentPage,
            size: pageSize,
            searchQuery: searchQuery,
        };
        http
            .get(`/agencies`, { params })
            .then((response) => {
                setAgencies(response.data.content);
                setTotalPages(response.data.totalPages);
                console.log('Agencies fetch successful:', response.data.content, 'pages amount: ', response.data.totalPages);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(0);
    };

    const filteredAgencies = agencies
        ? agencies.filter((agency) =>
            agency.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h2 className="text-info">Agency list page</h2>

            <div className="row">
                <div className="col mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={{
                            height: 40,
                        }}
                    />
                </div>

                <Link className="col-2 btn btn-primary" style={{ height: 40 }} to="/newAgency">
                    Add new
                </Link>
            </div>

            <ul className="list-group mb-2">
                {filteredAgencies.map((agency) => (
                    <li className="col-10 list-group-item" key={agency.id}>
                        <Link to={`/agency/${agency.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                            {agency.name}
                        </Link>
                    </li>
                ))}
            </ul>
            {(totalPages > 0 ? (
                <div className="pagination">
                    <button className="btn btn-secondary" onClick={handlePreviousPage} disabled={currentPage === 0}>
                        Previous
                    </button>
                    <span className="mx-2 mt-1">Page {currentPage + 1 - (totalPages === 0)} of {totalPages}</span>
                    <button className="btn btn-secondary" onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
                        Next
                    </button>
                </div>
            ) : (
                <p>No results found.</p>)
            )}
        </div>
    );
};

export default Agencies;