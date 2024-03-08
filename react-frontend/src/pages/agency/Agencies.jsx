import React from 'react';
import EntitySearchTemplate from '../templates/EntitySearchTemplate';

const Agencies = () => {
    return (
        <EntitySearchTemplate entityName="agency" apiEndpoint="agencies" titleText="Agency search" />
    );
};

export default Agencies;