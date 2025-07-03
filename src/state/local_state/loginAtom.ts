import {atom} from 'jotai';

export type UserType = 'manager' | 'funeral' | null;

export interface ILoginUser {
  userType: UserType;
  isLogin: boolean;
  accessToken: string;
  refreshToken?: string;
  userId?: string;
  userName?: string;
  phoneNumber?: string;
  password?: string;
}

export const loginAtom = atom<ILoginUser>({
  userType: null,
  isLogin: false,
  accessToken: '',
  refreshToken: '',
  userId: '',
  userName: '',
  phoneNumber: '',
  password: '',
});
