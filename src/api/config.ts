import axios from 'axios';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_URL = 'http://localhost:3000/api'; // Replace with your API URL

const getApiUrl = () => {
  return Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/api'
    : 'http://localhost:3000/api';
};

const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000, // 10초
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (필요시)
api.interceptors.request.use(
  async config => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('토큰 가져오기 실패: ', error);
    }
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
