import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ children }) => {
    const auth = useSelector((state) => state.auth);

    if (auth.token) {
        return <Navigate to="/journals-table" replace />;
    }

    return children;
};

export default PublicRoute;
