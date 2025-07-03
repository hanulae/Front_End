import {atom} from 'jotai';
import {UserType} from './signupAtom';

export interface IUserInfo {
  userType: UserType;
  isLogin: boolean;
  userName: string;
  accessToken: string;
  refreshToken?: string;
}

export const userInfoAtom = atom<IUserInfo>({
  userType: null,
  isLogin: false,
  userName: '',
  accessToken: '',
  refreshToken: '',
});
