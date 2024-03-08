import React from 'react';
import EntitySearchTemplate from '../templates/EntitySearchTemplate';

const Doctors = () => {
    return (
        <EntitySearchTemplate entityName="doctor" apiEndpoint="doctors" titleText="Doctor search" />
    );
};

export default Doctors;