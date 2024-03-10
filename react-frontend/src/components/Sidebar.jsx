import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Nav.css';

const Sidebar = () => {
    return (
        <aside>
            <ul className="">
                <li className="">
                    <Link className="" to="/journals">
                        Journals
                    </Link>
                </li>
                <li className="">
                    <Link className="" to="/patients">
                        Patients
                    </Link>
                </li>
                <li className="">
                    <Link className="" to="/doctors">
                        Doctors
                    </Link>
                </li>
                <li className="">
                    <Link className="" to="/treatments">
                        Treatments
                    </Link>
                </li>

                <li className="">
                    <Link className="" to="/agencies">
                        Agencies
                    </Link>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;