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

export default api;
export { axios_multipart, axios_blob, api };
