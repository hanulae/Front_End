import {useState} from 'react';
import {useInputBase} from '../../../hooks/input/useInputBase';
import BaseInput from './BaseInput';

interface IInputProps {
  input: ReturnType<typeof useInputBase>;
  type?: 'text' | 'password' | 'phone' | 'number' | 'email';
  placeholder?: string;
  label?: string;
  onFocus?: () => void;
}

export const Input = ({
  input,
  type = 'text',
  placeholder,
  onFocus,
}: // label,
IInputProps) => {
  // const [secure, setSecure] = useState(type === 'password');
  const secure = type === 'password';
  const [_, setFocused] = useState(false);

  let keyboardType: 'default' | 'email-address' | 'phone-pad' | 'number-pad' =
    'default';

  if (type === 'phone') {
    keyboardType = 'phone-pad';
  } else if (type === 'number') {
    keyboardType = 'number-pad';
  } else if (type === 'text') {
    keyboardType = 'default';
  } else if (type === 'password') {
    keyboardType = 'default'; // 비밀번호도 기본 키보드
  }

  return (
    <BaseInput
      value={input.value}
      onChangeText={input.onChangeText}
      onBlur={() => {
        input.onBlur();
        setFocused(false);
      }}
      onFocus={() => {
        setFocused(true);
        onFocus?.();
      }}
      error={input.error}
      secureTextEntry={type === 'password' ? secure : false}
      placeholder={placeholder}
      clearable
      keyboardType={keyboardType}
    />
  );
};
