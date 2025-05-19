import {atom} from 'jotai';

export type UserType = 'manager' | 'funeral' | null;

interface IAgreement {
  all: boolean;
  service: boolean;
  privacy: boolean;
  location: boolean;
  age: boolean;
  marketing: boolean;
}
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
  agreedTerms: IAgreement;
  isEmailVerified?: boolean; // 이메일 인증 여부
  confirmPassword: string; // 비밀번호 확인
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
  agreedTerms: {
    all: false,
    service: false,
    privacy: false,
    location: false,
    age: false,
    marketing: false,
  },
  isEmailVerified: false,
  confirmPassword: '',
});
