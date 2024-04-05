import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
    return (
        <div className="container mt-5">
            <h2>Page Not Found</h2>
            <p>The requested page does not exist.</p>
            <Link to="/journals" className="btn btn-primary">Go to Journals</Link>
        </div>
    );
};

export default ErrorPage;