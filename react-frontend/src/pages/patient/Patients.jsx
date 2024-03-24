import React from 'react';
import EntitySearchTemplate from '../templates/EntitySearchTemplate';

const Patients = () => {
    return (
        <EntitySearchTemplate entityName="patient" api="patients" pageTitleText="Patient search" />
    );
};

export default Patients;