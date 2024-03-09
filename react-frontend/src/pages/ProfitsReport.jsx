import React, { useState, useEffect } from 'react';
import http from '../utils/http-common'

const ProfitsReport = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctors, setSelectedDoctors] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        getDoctors();
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        setStartDate(formatDate(startOfMonth));
        setEndDate(formatDate(endOfMonth));
    }, []);

    function formatDate(givenDate) {
        const d = new Date(givenDate);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const getDoctors = () => {
        http
            .get(`/doctors`)
            .then((response) => {
                setDoctors(response.data);
                console.log('Doctors fetch successful:', response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleDoctorChange = (event) => {
        const clickedOptionValue = event.target.value;
        setSelectedDoctors((prevSelectedDoctors) => {
            if (prevSelectedDoctors.includes(clickedOptionValue)) {
                return prevSelectedDoctors.filter((doctorId) => doctorId !== clickedOptionValue);
            } else {
                return [...prevSelectedDoctors, clickedOptionValue];
            }
        });
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const getReport = () => {
        console.log('Fetching report: ', { doctors: selectedDoctors, startDate, endDate });
        http
            .post('/reportPricesForDoctors', { doctors: selectedDoctors, startDate, endDate })
            .then((response) => {
                console.log("Fetching report successful: ", response.data)
                setData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="container">
            <h2 className="text-info">Profit report</h2>

            <div className="form-group mb-2 col-10">
                <label htmlFor="doctors">Select Doctors</label>
                <select
                    id="doctors"
                    className="form-select"
                    multiple
                    value={selectedDoctors}
                    onChange={handleDoctorChange}
                >
                    {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                            {doctor.name} 
                        </option>
                    ))}
                </select>
            </div>

            <div className="row">
                <div className="col-5 form-group">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="startDate"
                        value={startDate}
                        onChange={handleStartDateChange}
                    />
                </div>

                <div className="col-5 form-group">
                    <label htmlFor="endDate">End Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="endDate"
                        value={endDate}
                        onChange={handleEndDateChange}
                    />
                </div>
            </div>

            <button type="button" className="mt-2 btn btn-primary" onClick={getReport}>
                Construct Report
            </button>

            {data.length > 0 && (
                <table className="table mt-4">
                    <thead>
                        <tr>
                            <th>Doctor</th>
                            <th>Treatment amount</th>
                            <th>Profit sum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.doctorId}>
                                <td>{item.doctor.name} </td>
                                <td>{item.numberOfJournals}</td>
                                <td>{item.sumOfPrices}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ProfitsReport;
