import React from 'react';
import EntitySearchTemplate from '../../templates/EntitySearchTemplate';

const Treatments = () => {
    return (
        <EntitySearchTemplate entityName="treatment" api="treatments" pageTitleText="Treatment search" />
    );
};

export default Treatments;