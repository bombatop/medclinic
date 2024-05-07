import React, { useState, useEffect } from 'react';
import DebouncedSearchSelect from '../../components/DebouncedSearchSelect';
import './ToothSelectionModal.css';

const ToothSelectionModal = ({ show, onClose, onSelect, initialDiagnosis, initialToothCodes }) => {
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
    const [selectedTeeth, setSelectedTeeth] = useState([]);

    useEffect(() => {
        if (initialDiagnosis) {
            setSelectedDiagnosis(initialDiagnosis);
        }
        if (initialToothCodes) {
            setSelectedTeeth(initialToothCodes);
        }
    }, [initialDiagnosis, initialToothCodes]);

    const toggleSelectTeeth = (number) => {
        setSelectedTeeth(prev => prev.includes(number) ? prev.filter(item => item !== number) : [...prev, number]);
    };

    const handleDiagnosisChange = (event) => {
        setSelectedDiagnosis(event.value);
    };

    const handleSave = () => {
        if (selectedDiagnosis && selectedTeeth.length > 0) {
            onSelect(selectedDiagnosis, selectedTeeth);
            onClose();
            if (!initialDiagnosis) {
                setSelectedDiagnosis(null);
                setSelectedTeeth([]);
            }
        } else {
            alert("Please select a diagnosis and at least one tooth code.");
        }
    };

    if (!show) return null;

    const teethNumbers = ["18", "17", "16", "15", "14", "13", "12", "11",
        "21", "22", "23", "24", "25", "26", "27", "28",
        "48", "47", "46", "45", "44", "43", "42", "41",
        "31", "32", "33", "34", "35", "36", "37", "38"];

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>{initialDiagnosis ? 'Edit Tooth Codes' : 'Select Diagnosis and Tooth Codes'}</h2>
                {!initialDiagnosis &&
                <DebouncedSearchSelect
                    placeholder="Select Diagnosis"
                    defaultValue={selectedDiagnosis ? { label: selectedDiagnosis.name, value: selectedDiagnosis } : null}
                    onChange={handleDiagnosisChange}
                    api="diagnoses"
                />
                }
                <div className="grid">
                    {teethNumbers.map((number) => (
                        <button
                            key={number}
                            className={`tooth-button ${selectedTeeth.includes(number) ? 'selected' : ''}`}
                            onClick={() => toggleSelectTeeth(number)}
                        >
                            {number}
                        </button>
                    ))}
                </div>
                <button className="save-button" onClick={handleSave}>Save Selection</button>
            </div>
        </div>
    );
};

export default ToothSelectionModal;
