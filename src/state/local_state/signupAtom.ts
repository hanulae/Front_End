import {atom} from 'jotai';

export type UserType = 'manager' | 'funeral' | null;

export interface ISignupInfo {
  userType: UserType;
  email: string;
  password: string;
  phoneNumber: string;
  attachedFile: File | null;
  funeralName?: string; // 장례식장만 사용.
  accountInfo: {
    bankName: string;
    accountNumber: string;
  };
  agreedTerms: boolean;
}

export const signupAtom = atom<ISignupInfo>({
  userType: 'manager',
  email: '',
  password: '',
  phoneNumber: '',
  attachedFile: null,
  funeralName: '',
  accountInfo: {
    bankName: '',
    accountNumber: '',
  },
  agreedTerms: false,
});
