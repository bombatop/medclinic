import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8080/courseproject-1.0-SNAPSHOT/api",
  headers: {
    "Content-Type": "application/json",
  }
});

const multipartAxios = axios.create({
  baseURL: 'http://localhost:8080/courseproject-1.0-SNAPSHOT/api/files',
  headers: {
      'Content-Type': 'multipart/form-data',
  }
});

export { multipartAxios };
