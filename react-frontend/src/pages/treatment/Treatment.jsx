// ... Previous Code

return (
    <div className="container mt-4">
        {/* Header */}
        <div className="row justify-content-between">
            <h2 className="col-auto mb-3">Treatment Page</h2>
            <div className="col-auto">
                <button className="btn btn-danger" onClick={deleteTreatment}>
                    Delete Treatment
                </button>
            </div>
        </div>

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
                                <span>{format(new Date(price.date), 'd MMMM, yyyy HH:mm', { locale: ru })}</span>
                                <span>&#8372; {price.price}</span>
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