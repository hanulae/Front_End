import {useDebouncedEffect} from '../../util/debounce';
import {matchValidator} from '../../util/validation';
import {useInputBase} from './useInputBase';

export const useConfirmPasswordInput = (
  getPassword: () => string,
  initialValue = '',
) => {
  const input = useInputBase({
    initialValue,
    validate: value => matchValidator(value, getPassword()),
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
