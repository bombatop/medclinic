import React, { useState, useEffect } from 'react';
import DebouncedSearchSelect from '../../components/DebouncedSearchSelect';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import http from '../../utils/http-common';
import { useNavigate, useParams } from 'react-router-dom';

const Diagnosis = () => {
    const navigate = useNavigate();
    const { diagnosisId } = useParams();
    const [diagnosis, setDiagnosis] = useState({ name: '', icdCode: '' });

    useEffect(() => {
        if (diagnosisId) {
            getDiagnosis();
        }
    }, [diagnosisId]);

    const getDiagnosis = async () => {
        try {
            const { data } = await http.get(`/diagnoses/${diagnosisId}`);
            setDiagnosis((prevDiagnosis) => ({ ...prevDiagnosis, name: data.name, icdCode: data.icdCode }));
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (value, property) => {
        setDiagnosis((prev) => ({ ...prev, [property]: value }));
    };

    const deleteDiagnosis = async () => {
        try {
            await http.delete(`/diagnoses/${diagnosisId}`);
            navigate('/diagnoses');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Diagnosis Details</h2>
            <form className="mb-5">
                <div className="form-group mb-3">
                    <label htmlFor="formCode">Diagnosis code</label>
                    <input
                        type="text"
                        className="form-control"
                        id="formCode"
                        value={diagnosis.icdCode}
                        onChange={(e) => handleInputChange(e.target.value, 'icdCode')}
                    />
                    <label htmlFor="formFullName">Diagnosis Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="formFullName"
                        value={diagnosis.name}
                        onChange={(e) => handleInputChange(e.target.value, 'name')}
                    />
                </div>
                <button type="button" className="btn btn-danger" onClick={deleteDiagnosis}>
                    Delete Diagnosis
                </button>
            </form>
        </div>
    );
};

export default Diagnosis;
