import {useState} from 'react';

const usePhoneAuthInput = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  // 전화번호 형식 검증
  const isValidPhoneNumber = phoneNumber.replace(/[^0-9]/g, '').length === 11;

  // 인증코드 형식 검증 (6자리 숫자)
  const isValidAuthCode = authCode.replace(/[^0-9]/g, '').length === 6;

  // 전화번호 포맷팅 (010-1234-5678)
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7)
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
      7,
      11,
    )}`;
  };

  const handlePhoneNumberChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setPhoneNumber(formatted);
  };

  const handleAuthCodeChange = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '').slice(0, 6);
    setAuthCode(numbers);
  };

  return {
    // 상태
    phoneNumber,
    authCode,
    isCodeSent,
    timer,
    isVerified,

    // 상태 변경 함수
    setPhoneNumber: handlePhoneNumberChange,
    setAuthCode: handleAuthCodeChange,
    setIsCodeSent,
    setTimer,
    setIsVerified,

    // 유틸
    isValidPhoneNumber,
    isValidAuthCode,
  };
};

export default usePhoneAuthInput;
