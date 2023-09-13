import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div>
            <header>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/journals">
                                    Journals
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/patients">
                                    Patients
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/doctors">
                                    Doctors
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/treatments">
                                    Treatments
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/report">
                                    Profits Report
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        </div>
    );
};

export default Header;
