import {useState} from 'react';
import {useInputBase} from '../../../hooks/input/useInputBase';
import CommonInput from './CommonInput';
import {View, StyleSheet} from 'react-native';
import Typo from '../Typo';

interface IFuneralInputProps {
  input: ReturnType<typeof useInputBase>;
  type?: 'text' | 'password' | 'phone' | 'number' | 'email';
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  unit?: string; // 단위 prop 추가
}

export const FuneralInput = ({
  input,
  type = 'text',
  placeholder,
  disabled = false,
  unit, // unit prop 추가
}: IFuneralInputProps) => {
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
    <View style={styles.container}>
      <CommonInput
        style={[styles.input, unit && styles.inputWithUnit]}
        disabled={disabled}
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
        keyboardType={keyboardType}
      />
      {unit && <Typo style={styles.unitText}>{unit}</Typo>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
  },
  inputWithUnit: {
    paddingRight: 40, // 단위 텍스트를 위한 여백
  },
  unitText: {
    position: 'absolute',
    right: 30,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Pretendard-Regular',
  },
});
