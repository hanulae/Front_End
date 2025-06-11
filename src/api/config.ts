import axios from 'axios';
import {Platform} from 'react-native';

// const API_URL = 'http://localhost:3000/api'; // Replace with your API URL

const API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/api'
    : 'http://localhost:3000/api';

const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000, // 10초
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (필요시)
api.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터 (필요시)
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  },
);

export default api;
