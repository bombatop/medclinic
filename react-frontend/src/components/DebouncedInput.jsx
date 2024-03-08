import React, { useState, useCallback, useRef } from 'react';

function DebouncedInput({ onChange, value, className }) {
    const [localValue, setLocalValue] = useState('');
    const timeoutRef = useRef(null);

    const clearTimeoutRef = useCallback(() => {
        clearTimeout(timeoutRef.current);
    }, []);

    const handleOnChange = useCallback((event) => {
        const enteredValue = event.target.value;
        setLocalValue(enteredValue);

        clearTimeoutRef();
        timeoutRef.current = setTimeout(() => {
            onChange(enteredValue);
        }, 300);
    }, [clearTimeoutRef, onChange]);

    return (
        <input
            type="text"
            className={className}
            value={localValue}
            onChange={handleOnChange}
        />
    );
}

export default DebouncedInput;