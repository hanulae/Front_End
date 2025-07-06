import {useDebouncedEffect} from '../../util/debounce';
import {matchValidator} from '../../util/validation';
import {useInputBase} from './useInputBase';

export const useConfirmPasswordInput = (
  getPassword: () => string,
  initialValue = '',
) => {
  const input = useInputBase({
    initialValue,
    validate: value => {
      // 빈 문자열인 경우 항상 유효하지 않다고 처리
      if (!value.trim()) {
        return {
          valid: false,
          message: '비밀번호를 다시 입력해주세요.',
        };
      }
      return matchValidator(value, getPassword());
    },
  });

  useDebouncedEffect(
    () => {
      input.onBlur();
    },
    [input.value, getPassword()],
    500,
  );

  return {
    ...input,
  };
};
