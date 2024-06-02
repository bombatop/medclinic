import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api-v1",
    headers: {
        "Content-Type": "application/json",
    }
});

const axios_multipart = axios.create({
    baseURL: 'http://localhost:8080/api-v1',
    headers: {
        'Content-Type': 'multipart/form-data',
    }
});

const axios_blob = axios.create({
    baseURL: 'http://localhost:8080/api-v1',
    responseType: 'blob',
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const { store } = require("../store/storeInstance"); // Lazy import to avoid circular dependency
        const state = store.getState();
        const token = state.auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
export { axios_multipart, axios_blob, api };
