import React from 'react';
import EntitySearchTemplate from '../templates/EntitySearchTemplate';

const Patients = () => {
    return (
        <EntitySearchTemplate entityName="patient" apiEndpoint="patients" titleText="Patient search" />
    );
};

export default Patients;