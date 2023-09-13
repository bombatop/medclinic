import React, { useState, useEffect } from 'react';
import http from '../http-common';
import { Link, useNavigate, useParams } from 'react-router-dom';

const Treatment = () => {
    const navigate = useNavigate();
    const { treatmentId } = useParams();
    const [treatment, setTreatment] = useState(null);
    const [price, setPrice] = useState({
        date: getCurrentDatetime()
    });
    const [prices, setPrices] = useState(null);

    function getCurrentDatetime() {
        var now = new Date();
        var year = now.getFullYear();
        var month = (now.getMonth() + 1).toString().padStart(2, "0");
        var day = now.getDate().toString().padStart(2, "0");
        var hours = now.getHours().toString().padStart(2, "0");
        var minutes = now.getMinutes().toString().padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    const handleNameChange = (event) => {
        setTreatment({
            ...treatment,
            name: event.target.value
        })
    };

    const handlePriceChange = (event) => {
        setPrice({
            ...price,
            price: Number(event.target.value)
        })
    };

    const handleDateChange = (event) => {
        setPrice({
            ...price,
            date: event.target.value
        });
    };

    useEffect(() => {
        getTreatment();
        getPrices();
    }, [])

    const getTreatment = () => {
        http
            .get(`/treatment/${treatmentId}`)
            .then((response) => {
                setTreatment(response.data);
                console.log('Treatment fetch successful:', response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getPrices = () => {
        http
            .get(`/prices/${treatmentId}`)
            .then((response) => {
                setPrices(response.data);
                console.log('Prices fetch successful:', response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const updateTreatment = () => {
        http
            .post(`/updateTreatment/${treatmentId}`, treatment)
            .then((response) => {
                console.log('Treatment updated:', response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const addPrice = () => {
        if (price.date.indexOf("T") !== -1) {
            price.date = price.date.replace("T", " ");
        }
        price.treatment = treatment;
        http
            .post(`/addPriceForTreatment`, price)
            .then((response) => {
                console.log('Price added:', response.data);
                const sortedPrices = [...prices, response.data].sort((a, b) => new Date(b.date) - new Date(a.date));
                setPrices(sortedPrices);
            })
            .catch((error) => {
                console.log(error);
            });
    };


    const deletePrice = (priceId) => {
        http
            .delete(`/deletePrice/${priceId}`)
            .then((response) => {
                console.log('Price deleted:', response.data);
                getPrices();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const deleteTreatment = () => {
        http
            .delete(`/deleteTreatment/${treatmentId}`)
            .then((response) => {
                console.log('Treatment deleted:', response.data);
                navigate('/treatments');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="container">
            <h2 className="text-info">Treatment page</h2>

            <div className="row">
                <div className="form-group col-6 mb-2">
                    <label htmlFor="name">Treatment name</label>
                    <input type="text" className="form-control" style={{height: 40}} id="name" value={treatment?.name || ''} onChange={handleNameChange} />
                </div>
                <button type="submit" className="btn btn-primary col-2 mb-2 mt-4" style={{height: 40}} onClick={updateTreatment}>Update info</button>
                <button type="button" className="btn btn-danger col-2 mb-2 mt-4 mx-2" style={{height: 40}} onClick={deleteTreatment}>Delete Treatment</button>
            </div>

            <div className="row mt-4">
                <div className="col-3">
                    <label htmlFor="price">Price</label>
                    <input type="text" className="form-control" id="price" value={price?.price || ''} onChange={handlePriceChange} />
                </div>

                <div className="col-3">
                    <label htmlFor="date">Date</label>
                    <input type="datetime-local" className="form-control" id="date" value={price?.date || ''} onChange={handleDateChange} />
                </div>

                <button type="submit" className="btn btn-primary col-2 mt-4" onClick={addPrice}>Add new price</button>
            </div>

            <table className="table mt-3">
                <tbody>
                    {prices &&
                        prices.map((price) => (
                            <tr key={price.id}>
                                <td className="col-3">{price.price}</td>
                                <td className="col-3">{price.date}</td>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => deletePrice(price.id)}
                                    style={{
                                        color: 'red',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    &times; Delete
                                </button>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default Treatment;
