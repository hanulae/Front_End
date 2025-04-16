// 이메일 양식 검증
export const isValidEmail = (email: string): boolean => {
  const Regex = /^\S+@\S+\.\S+$/;
  return Regex.test(email);
};

// 비밀번호 양식 검증
export const isValidPassword = (password: string): boolean => {
  // 8자 이상, 문자, 숫자, 특수문자 포함
  const Regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return Regex.test(password);
};

// 전화번호 양식 검증
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const Regex = /^\d{3}-\d{3,4}-\d{4}$/;
  return Regex.test(phoneNumber);
};

// 일치 여부 검증
export const matchValidator = (
  a: string,
  b: string,
): {valid: boolean; message: string} => {
  if (a !== b) {
    return {
      valid: false,
      message: '일치하지 않습니다.',
    };
  }
  return {
    valid: true,
    message: '',
  };
};

// API 호출 하는 검증 함수
