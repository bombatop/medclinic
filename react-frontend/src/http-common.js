import axios from "axios";

export default axios.create({
  baseURL: "http://192.168.0.3:8080/courseproject-1.0-SNAPSHOT/api",
  headers: {
    "Content-Type": "application/json",
  }
});

const uploadAxios = axios.create({
  baseURL: 'http://192.168.0.3:8080/courseproject-1.0-SNAPSHOT/api/files',
  headers: {
      'Content-Type': 'multipart/form-data',
  }
});

const downloadAxios = axios.create({
  baseURL: 'http://192.168.0.3:8080/courseproject-1.0-SNAPSHOT/api/files',
  responseType: 'blob',
});

export { downloadAxios, uploadAxios };
