import React from "react";
import { get } from "../utils/http/api";

export const useHttpGet = (url: string, params: {}) => {
    const [data, setData] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const fetchData = () => {
        setIsLoading(true);
        get(url, params)
            .then(response => setData(response.data))
            .catch(error => setError(error.response.data.error))            
            .finally(() => setIsLoading(false))
    };

    React.useEffect(() => {
        fetchData();
    }, [url]);

    return { data, isLoading, error, refetch: fetchData, setData };
}