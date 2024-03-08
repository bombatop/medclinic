import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import http from '../../http-common';
import CustomPagination from '../../components/CustomPagination';
import DebouncedInput from '../../components/DebouncedInput';

const EntitySearchTemplate = ({ entityName, apiEndpoint, titleText }) => {
    const navigate = useNavigate();
    const [entities, setEntities] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPage, setSelectedPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        getEntities();
    }, [selectedPage, searchQuery]);

    const getEntities = async () => {
        const params = {
            page: selectedPage - 1,
            searchQuery: searchQuery,
            size: 4,
        };

        try {
            const response = await http.get(`/${apiEndpoint}`, { params });
            const data = response.data;
            setEntities(data.content);
            setTotalPages(data.totalPages);
            console.log(`${entityName} fetch successful:`, data.content, data.totalPages);
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
            <h2>{titleText}</h2>

            <div className="row mb-3">
                <div className="col-8">
                    <DebouncedInput
                        onChange={setSearchQuery}
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

            <div className="row mb-2">
                <div className="col-8">
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

export default EntitySearchTemplate;