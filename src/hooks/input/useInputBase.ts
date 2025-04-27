import {useCallback, useState} from 'react';

interface IUseInputOptions {
  initialValue?: string;
  validate?: (value: string) => {valid: boolean; message: string};
}

export const useInputBase = ({
  initialValue = '',
  validate,
}: IUseInputOptions = {}) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const runValidation = useCallback(
    (val: string) => {
      if (!validate) {
        return;
      }
      const result = validate(val);
      setError(result.valid ? '' : result.message);
    },
    [validate],
  );

  const onChangeText = (text: string) => {
    setValue(text);
    if (touched && validate) {
      runValidation(text);
    }
  };

  const onBlur = () => {
    setTouched(true);
    if (validate) {
      runValidation(value);
    }
  };

  const reset = () => {
    setValue(initialValue);
    setError('');
    setTouched(false);
  };

  const isValid = error === '';

  return {
    value,
    error,
    touched,
    isValid,
    onChangeText,
    onBlur,
    reset,
  };
};
