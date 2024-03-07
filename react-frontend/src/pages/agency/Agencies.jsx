import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import http from "../../http-common";
import CustomPagination from "../../utils/pagination";

const Agencies = () => {
    const [agencies, setAgencies] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPage, setSelectedPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        getAgencies();
    }, [selectedPage]);

    const getAgencies = async () => {
        const params = {
            page: selectedPage - 1,
            searchQuery: searchQuery,
            size: 4,
        };

        try {
            const response = await http.get("/agencies", { params });
            setAgencies(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) setSelectedPage(page);
    };

    return (
        <div className="container mt-4">
            <h2>Agency Search</h2>

            <div className="row mb-3">
                <div className="col-xs-8">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="col-xs-2">
                    <Link href="/newAgency" className="btn btn-primary" style={{ height: 40 }}>
                        Add new
                    </Link>
                </div>
            </div>

            <div className="row mb-2">
                <div className="col-xs-8">
                    <ul className="list-group">
                        {agencies.map((agency) => (
                            <li className="list-group-item" key={agency.id}>
                                <Link to={`/agency/${agency.id}`} style={{ textDecoration: "none", color: "black" }}>
                                    {agency.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="row mb-2">
                <div className="col-xs-8">
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

export default Agencies;