import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Nav.css';

const Sidebar = () => {
    return (
        <div>
            <ul className="nav nav-pills flex-column">
                <li className="nav-item">
                    <Link className="nav-link link-dark" to="/journals">
                        Journals
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link link-dark" to="/patients">
                        Patients
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link link-dark" to="/doctors">
                        Doctors
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link link-dark" to="/treatments">
                        Treatments
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link link-dark" to="/agencies">
                        Agencies
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;