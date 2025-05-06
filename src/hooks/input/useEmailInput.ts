import {isValidEmail} from '../../util/validation';
import {useInputBase} from './useInputBase';

export const useEmailInput = () => {
  return useInputBase({
    validate: value => ({
      valid: isValidEmail(value),
      message: '이메일 형식이 아닙니다.',
    }),
  });
};
