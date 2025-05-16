import React from "react";
import { del, get, post, put } from "../utils/api";
import { Alert } from "react-native";

export const useHttpGet = (url: string, params: {}) => {
    const [data, setData] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const fetchData = () => {
        setIsLoading(true);
        get(url, params)
            .then(response => setData(response.data))
            .catch(error => { setError(error.response.data.error); Alert.alert("Error", error.response.data.error) })
            .finally(() => setIsLoading(false))
    };

    React.useEffect(() => {
        fetchData();
    }, [url]);

    return { data, isLoading, error, refetch: fetchData };
}

export const useHttpPost = (url: string, params: {}) => {
    const [data, setData] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const doPost = () => {
        setIsLoading(true);
        post(url, {}, params)
            .then(response => setData(response.data))
            .catch(error => { setError(error.response.data.error); Alert.alert("Error", error.response.data.error) })
            .finally(() => setIsLoading(false))
    };

    return { data, isLoading, error, doPost };
}

export const useHttpPut = (url: string, params: {}) => {
    const [data, setData] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const doPut = () => {
        setIsLoading(true);
        put(url, {}, params)
            .then(response => setData(response.data))
            .catch(error => { setError(error.response.data.error); Alert.alert("Error", error.response.data.error) })
            .finally(() => setIsLoading(false))
    };

    return { data, isLoading, error, doPut };
}


export const useHttpDelete = (url: string, params: {}) => {
    const [data, setData] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const doDelete = () => {
        setIsLoading(true);
        del(url, params, {})
            .then(response => setData(response.data))
            .catch(error => { setError(error.response.data.error); Alert.alert("Error", error.response.data.error) })
            .finally(() => setIsLoading(false))
    };

    return { data, isLoading, error, doDelete };
}