import React, { useState, useEffect } from 'react';
import http from '../../utils/http-common';
import { useNavigate, useParams } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const Treatment = () => {
    const navigate = useNavigate();
    const { treatmentId } = useParams();

    const [errorMessages, setErrorMessages] = useState(null);

    const [treatment, setTreatment] = useState(null);
    const [prices, setPrices] = useState({});

    const [newPrice, setNewPrice] = useState({
        agency: null,
        treatment: null,
        price: 0,
        date: new Date(),
    });

    useEffect(() => {
        if (!treatmentId) return;

        (async () => {
            await getTreatment();
            // Note: getPrices will be called inside the getTreatment function
        })();
    }, [treatmentId]);

    useEffect(() => {
        if (treatment && treatment.name) {
            updateTreatment();
        }
    }, [treatment?.name]);

    const handleInputChange = (value, property) => {
        if (value === null) return;
        setNewPrice({
            ...newPrice,
            [property]: value,
        });
    };

    const getTreatment = async () => {
        try {
            const response = await http.get(`/treatment/${treatmentId}`);
            setTreatment(response.data);
            console.log('Treatment fetch successful:', response.data);

            // Now that treatment is set, call getPrices
            await getPrices(response.data.id);
        } catch (error) {
            console.error(error);
        }
    };

    const updateTreatment = async () => {
        try {
            const response = await http.post(`/updateTreatment/${treatment.id}`, treatment);
            console.log('Treatment updated:', response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteTreatment = async () => {
        try {
            const response = await http.delete(`/deleteTreatment/${treatment.id}`);
            console.log('Treatment deleted:', response.data);
            navigate('/treatments');
        } catch (error) {
            console.error(error);
        }
    };

    const getPrices = async (treatmentId) => {
        try {
            const response = await http.get(`/prices/${treatmentId}`);
            const newPrices = {};

            response.data.forEach((item) => {
                const { agency } = item;
                const agencyId = agency.id;

                if (!newPrices[agencyId]) {
                    newPrices[agencyId] = {
                        agencyInfo: { ...agency },
                        pricesList: [],
                    };
                }

                newPrices[agencyId].pricesList.push(item);
            });

            setPrices(newPrices);
            console.log('Prices fetch successful:', newPrices);
        } catch (error) {
            console.error(error);
        }
    };

    const deletePrice = async (price) => {
        try {
            const response = await http.delete(`/deletePrice/${price.id}`);
            console.log('Price deleted:', response.data);
            await getPrices();
        } catch (error) {
            console.error(error);
        }
    };

    const addPrice = async () => {
        try {
            console.log(newPrice);
            const response = await http.post(`/addPriceForTreatment`, { ...newPrice, treatment: treatment, date: format(newPrice.date, 'yyyy-MM-dd HH:mm') });
            console.log('Price added:', response.data);
            await getPrices();
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data) {
                const errorObjects = error.response.data.map((error) => error.defaultMessage);
                setErrorMessages(errorObjects);
            }
        }
    };

    const loadAgencies = async (inputValue, callback) => {
        try {
            const params = {
                searchQuery: inputValue,
                size: 10,
                page: 0,
            };
            const response = await http.get(`/agencies`, { params });
            const options = response.data.content.map((agency) => ({
                value: agency,
                label: agency.name,
            }));
            console.log('Doctors fetch on query {' + inputValue + '} successful: ', options);
            callback(options);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Treatment page</h2>

            {/* Main Content */}
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="formFullName">Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="formFullName"
                            value={treatment?.name || ''}
                            onChange={(event) => setTreatment({ ...treatment, name: event.target.value })}
                        />
                    </div>
                </div>
                <div className="col-auto">
                    <button className="btn btn-danger" onClick={deleteTreatment}>
                        Delete Treatment
                    </button>
                </div>
            </div>

            {/* Prices Section */}
            <div className="row my-5">
                <h4 className="col-auto mb-3">Add New Price</h4>
                <div className="col-md-9 ms-auto">
                    <AsyncSelect
                        cacheOptions
                        defaultOptions
                        loadOptions={loadAgencies}
                        isClearable={true}
                        onChange={(event) => handleInputChange(event?.value, 'agency')}
                    />
                    <DatePicker
                        selected={newPrice.date}
                        onChange={(date) => handleInputChange(date, 'date')}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={10}
                        dateFormat="d MMMM, yyyy HH:mm"
                        locale={ru}
                        className="form-control mt-3"
                        timeCaption="Время"
                    />
                    <input
                        type="number"
                        step="any"
                        min="0"
                        className="form-control mt-3"
                        placeholder="Price"
                        value={newPrice.price}
                        onChange={(event) => handleInputChange(parseFloat(event.target.value), 'price')}
                    />
                    <button className="btn btn-success mt-3" onClick={addPrice}>
                        Add Price
                    </button>
                </div>
            </div>

            {/* Agencies Prices Listing */}
            <div className="row">
                {prices && Object.entries(prices).map(([key, value]) => (
                    <React.Fragment key={key}>
                        <h4 className="col-auto mb-3">Agency: {value.agencyInfo.name}</h4>
                        <ul className="col-md-9 ms-auto ps-0">
                            {value.pricesList.map((price) => (
                                <li className="d-flex justify-content-between align-items-center mb-2" key={price.id}>
                                    <span> {price.price}</span>
                                    <span>{format(new Date(price.date), 'd MMMM, yyyy HH:mm', { locale: ru })}</span>
                                    <button className="btn btn-danger btn-sm ms-2" onClick={() => deletePrice(price)}>
                                        X
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default Treatment;