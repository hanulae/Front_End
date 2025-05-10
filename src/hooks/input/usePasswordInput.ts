import {useDebouncedEffect} from '../../util/debounce';
import {isValidPassword} from '../../util/validation';
import {useInputBase} from './useInputBase';

export const usePasswordInput = (initialValue = '') => {
  const input = useInputBase({
    initialValue,
    validate: value => ({
      valid: isValidPassword(value),
      message: '비밀번호는 8자 이상, 문자, 숫자, 특수문자 포함해야 합니다.',
    }),
  });

  useDebouncedEffect(
    () => {
      input.onBlur();
    },
    [input.value],
    500,
  );

  return {...input};
};
