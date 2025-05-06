import {useState} from 'react';
import {useInputBase} from '../../../hooks/input/useInputBase';
import BaseInput from './BaseInput';

interface IInputProps {
  input: ReturnType<typeof useInputBase>;
  type?: 'text' | 'password' | 'phone';
  placeholder?: string;
  label?: string;
}

export const Input = ({
  input,
  type = 'text',
  placeholder,
}: // label,
IInputProps) => {
  // const [secure, setSecure] = useState(type === 'password');
  const secure = type === 'password';
  const [_, setFocused] = useState(false);

  return (
    <BaseInput
      value={input.value}
      onChangeText={input.onChangeText}
      onBlur={() => {
        input.onBlur();
        setFocused(false);
      }}
      onFocus={() => setFocused(true)}
      error={input.error}
      secureTextEntry={type === 'password' ? secure : false}
      placeholder={placeholder}
      clearable
    />
  );
};
