import React, { useState, useCallback, useRef } from 'react';

function DebouncedInput({ onChange, onLoading, className }) {
    const [enteredValue, setEnteredValue] = useState(''); //value to pass on return
    const timeoutRef = useRef(null);

    const handleOnChange = useCallback((event) => {
        const enteredValue = event.target.value;
        setEnteredValue(enteredValue); // saving value
        onLoading(true); // calling onLoading(true) (to set isLoading state to true);

        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            onChange(enteredValue);
            onLoading(false);
        }, 350); //ms
    });

    return (
        <input
            type="text"
            className={className}
            value={enteredValue}
            onChange={handleOnChange}
        />
    );
}

export default DebouncedInput;