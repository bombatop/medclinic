import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8080/courseproject-1.0-SNAPSHOT/api", // указание адреса сервера
  headers: {
    "Content-Type": "application/json", // обмен данными будем осуществлять в формате json
  }
});