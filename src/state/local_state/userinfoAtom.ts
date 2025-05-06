import {atom} from 'jotai';
import {UserType} from './signupAtom';

export interface IUserInfo {
  userType: UserType;
  isLogin: boolean;
}

export const userInfoAtom = atom<IUserInfo>({
  userType: 'manager',
  isLogin: false,
});
