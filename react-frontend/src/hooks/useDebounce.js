import { useRef, useEffect, useMemo } from 'react';
import { debounce } from 'lodash'

const useDebounce = (callback, wait) => {
    const ref = useRef();

    useEffect(() => {
        ref.current = callback;
    }, [callback]);

    const debouncedCallback = useMemo(() => {
        const func = (...args) => {
            ref.current?.(...args);
        };

        return debounce(func, wait);
    }, []);

    return debouncedCallback;
};

export default useDebounce;