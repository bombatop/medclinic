import React from 'react';
import EntitySearchTemplate from '../../templates/EntitySearchTemplate';

const Diagnoses = () => {
    return (
        <EntitySearchTemplate entityName="diagnosis" api="diagnoses" pageTitleText="Diagnoses search" />
    );
};

export default Diagnoses;