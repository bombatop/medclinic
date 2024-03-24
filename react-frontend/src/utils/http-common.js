import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    }
});

const jsonAxios = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    }
});

const uploadAxios = axios.create({
    baseURL: 'http://localhost:8080/api/files',
    headers: {
        'Content-Type': 'multipart/form-data',
    }
});

const downloadAxios = axios.create({
    baseURL: 'http://localhost:8080/api/files',
    responseType: 'blob',
});

export default http;
export { http, jsonAxios, downloadAxios, uploadAxios };
