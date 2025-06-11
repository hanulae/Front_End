import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_INFO_KEY = 'userInfo';

export interface UserInfo {
  userType: 'manager' | 'funeral';
  userId: string;
  data: any;
}

// 토큰 저장
export const storeTokens = async (
  accessToken: string,
  refreshToken: string,
) => {
  try {
    await AsyncStorage.multiSet([
      [ACCESS_TOKEN_KEY, accessToken],
      [REFRESH_TOKEN_KEY, refreshToken],
    ]);
  } catch (error) {
    console.error('토큰 저장 오류:', error);
    throw error;
  }
};

// 액세스 토큰 가져오기
export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('액세스 토큰 가져오기 오류:', error);
    return null;
  }
};

// 리프레시 토큰 가져오기
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('리프레시 토큰 가져오기 오류:', error);
    return null;
  }
};

// 사용자 정보 저장
export const storeUserInfo = async (userInfo: UserInfo) => {
  try {
    await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  } catch (error) {
    console.error('사용자 정보 저장 오류:', error);
    throw error;
  }
};

// 사용자 정보 가져오기
export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const userInfo = await AsyncStorage.getItem(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('사용자 정보 가져오기 오류:', error);
    return null;
  }
};

// 모든 토큰과 사용자 정보 삭제 (로그아웃)
export const clearTokens = async () => {
  try {
    await AsyncStorage.multiRemove([
      ACCESS_TOKEN_KEY,
      REFRESH_TOKEN_KEY,
      USER_INFO_KEY,
    ]);
  } catch (error) {
    console.error('토큰 삭제 오류:', error);
    throw error;
  }
};

// 토큰 유효성 체크 (간단한 형태)
export const isTokenValid = (token: string): boolean => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (error) {
    return false;
  }
};
