import React, { useEffect } from 'react';
import './JournalSelectionModal.css';

const JournalSelectionModal = ({ show, onClose, onSelect, type, journals }) => {
    useEffect(() => {
        if (show) {
            // Fetch journals when modal is shown
        }
    }, [show]);

    const handleSelect = (journal) => {
        onSelect(journal);
        onClose();
    };

    if (!show) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Select {type === 'previous' ? 'Previous' : 'Next'} Journal</h2>
                <ul>
                    {journals.map((journal) => (
                        <li key={journal.id} onClick={() => handleSelect(journal)}>
                            {journal.date} - {journal.patient.name} - {journal.doctor.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default JournalSelectionModal;
