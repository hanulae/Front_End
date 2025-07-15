import axios from 'axios';
import {Platform} from 'react-native';
import {
  getAccessToken,
  getRefreshToken,
  storeTokens,
  clearTokens,
} from '../utils/tokenStorage';

// const API_URL = 'http://localhost:3000/api'; // Replace with your API URL

const API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8000/api'
    : 'http://localhost:8000/api';

// export const API_URL = 'http://15.164.166.8:3000/api';

//export const API_URL = 'https://www.wooricenter.co.kr/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10초
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 자동으로 토큰을 헤더에 추가
api.interceptors.request.use(
  async config => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터: 401 에러 시 토큰 갱신 시도
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getRefreshToken();
        if (refreshToken) {
          // 리프레시 토큰으로 새로운 액세스 토큰 요청
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken: refreshToken,
          });

          const {accessToken, refreshToken: newRefreshToken} = response.data;
          await storeTokens(accessToken, newRefreshToken);

          // 원래 요청을 새로운 토큰으로 재시도
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우 로그아웃 처리
        await clearTokens();
        // 로그인 화면으로 리다이렉트 로직 추가 가능
        console.error('토큰 갱신 실패:', refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
