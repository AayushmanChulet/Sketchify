import { useEffect, useState } from "react";

export default function UseDebounce(value : string,  delay : number){
    const [debouncedValue, useDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            useDebouncedValue(value);
        }, delay)
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}