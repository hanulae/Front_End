import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Replace with your API URL

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
