import { useState, useCallback } from "react";


export const useHttp = () => {
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(null);
    const [process, setProcess] = useState('waiting'); // for FSMachine

    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {

        // setLoading(true);
        setProcess('loading'); // for FSMachine
        try {
            const response = await fetch (url, {method, body, headers});

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status ${response.status}`);
            }

            const data = await response.json();

            // setLoading(false);
            return(data);
        } catch(e) {
            // setLoading(false);
            // setError(e.message);
            setProcess('error'); // for FSMachine
            throw e;
        }

    }, [])

    // const clearError = useCallback(() => setError(null), []);

    const clearError = useCallback(() => {
        // setError(null);
        setProcess('loading') // for FSMachine
    }, []);


    // return {loading, request, error, clearError, process, setProcess} 
    return { request, clearError, process, setProcess} // process and setProcess for FSMachine

}