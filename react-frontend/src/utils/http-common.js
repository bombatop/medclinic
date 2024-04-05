import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8080/api-v1",
    headers: {
        "Content-Type": "application/json",
    }
});

const uploadAxios = axios.create({
    baseURL: 'http://localhost:8080/api-v1',
    headers: {
        'Content-Type': 'multipart/form-data',
    }
});

const downloadAxios = axios.create({
    baseURL: 'http://localhost:8080/api-v1',
    responseType: 'blob',
});

export default http;
export { http, downloadAxios, uploadAxios };
