import React, { useState, useEffect } from 'react';
import DebouncedSearchSelect from '../../components/DebouncedSearchSelect';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import http from '../../utils/http-common';
import { useNavigate, useParams } from 'react-router-dom';

const Treatment = () => {
    const navigate = useNavigate();
    const { treatmentId } = useParams();
    const [treatment, setTreatment] = useState({ name: '', pricesByAgency: {} });
    const [newPrice, setNewPrice] = useState({ agency: '', price: '', date: new Date() });

    useEffect(() => {
        if (treatmentId) {
            getTreatment();
            getPrices();
        }
    }, [treatmentId]);

    const getTreatment = async () => {
        try {
            const { data } = await http.get(`/treatments/${treatmentId}`);
            setTreatment((prevTreatment) => ({ ...prevTreatment, name: data.name }));
        } catch (error) {
            console.error(error);
        }
    };

    const getPrices = async () => {
        try {
            const { data } = await http.get(`/prices/${treatmentId}`);
            const pricesByAgency = data.reduce((acc, price) => {
                const { agency } = price;
                if (!acc[agency.id]) {
                    acc[agency.id] = { agencyInfo: agency, pricesList: [] };
                }
                acc[agency.id].pricesList.push(price);
                return acc;
            }, {});
            console.log('prices by agency', pricesByAgency);
            setTreatment((prevTreatment) => ({ ...prevTreatment, pricesByAgency }));
        } catch (error) {
            console.error(error.response.data);
        }
    };

    const handleInputChange = (value, property) => {
        setNewPrice((prev) => ({ ...prev, [property]: value }));
    };

    const updateTreatmentName = (name) => {
        setTreatment((prev) => ({ ...prev, name }));
    };

    const addPrice = async () => {
        try {
            const response = await http.post('/prices', {
                ...newPrice,
                treatmentId: treatment.id,
                date: format(newPrice.date, 'yyyy-MM-dd HH:mm'),
            });
            setTreatment((prev) => ({
                ...prev,
                prices: [...prev.prices, response.data],
            }));
            setNewPrice({ agency: '', price: '', date: new Date() });
        } catch (error) {
            console.error(error);
        }
    };

    const deletePrice = async (priceId) => {
        try {
            await http.delete(`/prices/${priceId}`);
            setTreatment((prev) => ({
                ...prev,
                prices: prev.prices.filter((price) => price.id !== priceId),
            }));
        } catch (error) {
            console.error(error);
        }
    };

    const deleteTreatment = async () => {
        try {
            await http.delete(`/treatments/${treatmentId}`);
            navigate('/treatments');
        } catch (error) {
            console.error(error);
        }
    };
    

    return (
        <div className="container mt-4">
            <h2>Treatment Details</h2>
            <form className="mb-5">
                <div className="form-group mb-3">
                    <label htmlFor="formFullName">Treatment Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="formFullName"
                        value={treatment.name}
                        onChange={(e) => updateTreatmentName(e.target.value)}
                    />
                </div>
                <button type="button" className="btn btn-danger" onClick={deleteTreatment}>
                    Delete Treatment
                </button>
            </form>

            <form className="mb-5">
                <h4>Add New Price</h4>
                <DebouncedSearchSelect
                    onChange={(value) => handleInputChange(value, 'agency')}
                    api='agencies'
                    placeholder="Select Agency"
                />
                <DatePicker
                    selected={newPrice.date}
                    onChange={(date) => handleInputChange(date, 'date')}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="d MMMM, yyyy HH:mm"
                    locale={ru}
                    className="form-control mt-3"
                    placeholderText="Select date and time"
                />
                <input
                    type="number"
                    step="any"
                    min="0"
                    className="form-control mt-3"
                    placeholder="Enter price"
                    value={newPrice.price}
                    onChange={(e) => handleInputChange(e.target.value, 'price')}
                />
                <button type="button" className="btn btn-primary mt-3" onClick={addPrice}>
                    Add Price
                </button>
            </form>

            {treatment.pricesByAgency && Object.entries(treatment.pricesByAgency).length > 0 ? (
                Object.entries(treatment.pricesByAgency).map(([agencyId, { agencyInfo, pricesList }]) => (
                    <React.Fragment key={agencyId}>
                        <h5>{agencyInfo.name}</h5>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Price</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pricesList.map((price) => (
                                    <tr key={price.id}>
                                        <td>{price.price}</td>
                                        <td>{format(new Date(price.date), 'd MMMM, yyyy HH:mm', { locale: ru })}</td>
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={() => deletePrice(price.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </React.Fragment>
                ))
            ) : (
                <p>No prices available for this treatment.</p>
            )}
        </div>
    );
};

export default Treatment;
