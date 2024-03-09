import React, { useState, useCallback, useRef } from 'react';

const onChangeDelay = 400; //ms

function DebouncedInput({ onChange, onFocus, className }) {
    const [localValue, setLocalValue] = useState(''); //value to pass on return
    const timeoutRef = useRef(null); // timer

    const clearTimeoutRef = useCallback(() => {
        clearTimeout(timeoutRef.current);
    }, []);

    const handleOnChange = useCallback((event) => {
        const enteredValue = event.target.value;
        setLocalValue(enteredValue); // saving value
        onFocus(true); // calling onFocus (if some action is needed while debounce is happening)

        clearTimeoutRef(); // resetting timer
        timeoutRef.current = setTimeout(() => {
            onChange(enteredValue);
            onFocus(false);
        }, onChangeDelay);
    });

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