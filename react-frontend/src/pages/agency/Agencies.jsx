import React from 'react';
import EntitySearchTemplate from '../../templates/EntitySearchTemplate';

const Agencies = () => {
    return (
        <EntitySearchTemplate entityName="agency" api="agencies" pageTitleText="Agency search" />
    );
};

export default Agencies;