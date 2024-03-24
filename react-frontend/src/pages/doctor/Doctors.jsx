import React from 'react';
import EntitySearchTemplate from '../templates/EntitySearchTemplate';

const Doctors = () => {
    return (
        <EntitySearchTemplate entityName="doctor" api="doctors" pageTitleText="Doctor search" />
    );
};

export default Doctors;