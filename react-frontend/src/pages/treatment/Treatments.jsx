import React from 'react';
import EntitySearchTemplate from '../templates/EntitySearchTemplate';

const Treatments = () => {
    return (
        <EntitySearchTemplate entityName="treatment" apiEndpoint="treatments" titleText="Treatment search" />
    );
};

export default Treatments;