import axios from "axios";

const API = axios.create({
  baseURL: "/api/books"  // Proxy → backend:5000 automatically
});

export default API;

