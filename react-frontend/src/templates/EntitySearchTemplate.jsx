import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import http from '../utils/http-common';
import CustomPagination from '../components/CustomPagination';
import DebouncedInput from '../components/DebouncedInput';
import LoadingOverlay from '../components/LoadingOverlay'

const EntitySearchTemplate = ({ entityName, api, pageTitleText }) => {
    const [entities, setEntities] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPage, setSelectedPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getEntities();
    }, [selectedPage, searchQuery]);

    const getEntities = async () => {
        setIsLoading(true);
        setEntities([]);

        const params = {
            page: selectedPage - 1,
            searchQuery: searchQuery,
            size: 5,
        };

        try {
            const response = await http.get(`/${api}`, { params });
            const data = response.data;
            setEntities(data.content);
            setTotalPages(data.totalPages);
            setIsLoading(false);
            console.log(`${entityName} fetch successful:`, data.content, data.totalPages);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const handlePageChange = (page) => {
        if (page <= 0 || page > totalPages || page === selectedPage)
            return;
        setSelectedPage(page);
    };

    return (
        <div className="container">
            <h2>{pageTitleText}</h2>

            <div className="row mb-3">
                <div className="col-8">
                    <DebouncedInput
                        onChange={handleSearchChange}
                        onLoading={setIsLoading}
                        value={searchQuery}
                        className="form-control"
                        placeholder={`Search by name`}
                    />
                </div>
                <div className="col-2">
                    <Link to={`/new${entityName}`} className="btn btn-primary" style={{ height: 40 }}>
                        Add new
                    </Link>
                </div>
            </div>

            <div className="col-8">
                {isLoading ? (
                    <LoadingOverlay size={45}/>
                ) : (
                    <div>
                        {totalPages > 0 && entities.length > 0 && (
                            <div className="row mb-2">
                                <div className="col">
                                    <ul className="list-group">
                                        {entities.map((entity) => (
                                            <li className="list-group-item" key={entity.id}>
                                                <Link to={`/${entityName}/${entity.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                                                    {entity.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="row mb-2">
                                    <div className="col">
                                        <CustomPagination
                                                selectedPage={selectedPage}
                                                totalPages={totalPages}
                                                pageChangeHandler={handlePageChange}
                                            />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EntitySearchTemplate;