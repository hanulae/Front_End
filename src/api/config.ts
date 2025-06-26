import axios from 'axios';
import { Platform } from 'react-native';

// const API_URL = 'http://localhost:3000/api'; // Replace with your API URL

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';
//export const API_URL = 'http://15.164.166.8:3000/api';
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
