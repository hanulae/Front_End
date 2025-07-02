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

// 첨부파일 타입 정의
export interface AttachedFile {
  uri: string;
  name: string;
  type?: string;
  file?: File;
}

export interface ISignupInfo {
  userType: UserType;
  userName: string;
  password: string;
  phoneNumber: string;
  attachedFiles: AttachedFile[]; // 배열로 변경
  funeralName?: string; // 장례식장만 사용.
  accountInfo: {
    bankName: string;
    accountNumber: string;
  };
  agreedTerms: IAgreement;
  isUsernameChecked?: boolean; // 아이디 인증 여부
  confirmPassword: string; // 비밀번호 확인
  isPhoneVerified: boolean; // 휴대폰 인증 여부
}

export const signupAtom = atom<ISignupInfo>({
  userType: 'manager',
  userName: '',
  password: '',
  phoneNumber: '',
  attachedFiles: [], // 빈 배열로 초기화
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
  isUsernameChecked: false,
  confirmPassword: '',
  isPhoneVerified: false,
});
