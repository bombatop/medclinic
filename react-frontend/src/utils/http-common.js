import axios from "axios";
export default axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
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

export { downloadAxios, uploadAxios };
