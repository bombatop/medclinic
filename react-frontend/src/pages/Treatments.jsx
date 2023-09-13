import React, { useState, useEffect } from 'react';
import http from '../http-common';
import { Link, useNavigate, useParams } from 'react-router-dom';

const Treatments = () => {
    const navigate = useNavigate();
    const [treatments, setTreatments] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        getTreatments();
    }, [currentPage, searchQuery]);

    const getTreatments = () => {
        const pageSize = 5;
        const params = {
            page: currentPage,
            size: pageSize,
            searchQuery: searchQuery,
        };
        http
            .get(`/treatments`, { params })
            .then((response) => {
                setTreatments(response.data.content);
                setTotalPages(response.data.totalPages);
                console.log('Treatments fetch successful:', response.data.content, response.data.totalPages);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(0);
    };

    const filteredTreatments = treatments
        ? treatments.filter((treatment) =>
            treatment.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h2 className="text-info">Treatment list page</h2>
            <div className="row">
                <div className="col-8 mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by treatment name"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={{
                            height: 40
                        }}
                    />
                </div>

                <Link
                    className="col-2 btn btn-primary"
                    to="/newTreatment"
                    style={{
                        height: 40
                    }}
                >
                Add new
                </Link>
            </div>
            

            <ul className="list-group mb-2">
                {filteredTreatments.map(treatment =>
                    <li className="col-10 list-group-item" key={treatment.id}>
                        <Link to={`/treatment/${treatment.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                            {treatment.name}
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

export default Treatments;
