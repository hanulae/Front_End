import {isValidPhoneNumber} from '../../util/validation';
import {useInputBase} from './useInputBase';

const autoHyphen = (value: string) =>
  value.replace(/[^0-9]/g, '').replace(/^(\d{3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);

export const usePhoneInput = () => {
  const hook = useInputBase({
    validate: value => ({
      valid: isValidPhoneNumber(value),
      message: '전화번호 형식이 올바르지 않습니다.',
    }),
  });

  return {
    ...hook,
    onChangeText: (text: string) => {
      const formatted = autoHyphen(text);
      hook.onChangeText(formatted);
    },
  };
};
