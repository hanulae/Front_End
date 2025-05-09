import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
// import Typo from '../Typo';
import BtnClose from '../../../assets/Icon/Icon_BtnCloseGray.svg';
import {useState} from 'react';

interface IBaseInputProps extends TextInputProps {
  error?: string;
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
}

const BaseInput = ({
  error,
  clearable = false,
  value,
  onChangeText,
  disabled,
  ...props
}: IBaseInputProps) => {
  const [focused, setFocused] = useState(false);
  const showClear = clearable && focused && !!value;
  console.log('type', typeof BtnClose);
  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChangeText={onChangeText}
        placeholder={props.placeholder}
        style={[styles.input, error && styles.errorInput]}
        editable={!disabled}
      />
      {showClear && (
        <TouchableOpacity
          onPress={() => onChangeText?.('')}
          style={styles.clearButton}
          hitSlop={{top: 0, bottom: 0, left: 0, right: 0}}>
          <BtnClose width={16} height={16} />
        </TouchableOpacity>
      )}
      {/* {error && <Typo style={styles.errorText}>{error}</Typo>} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
  },
  input: {
    width: '100%',
    fontSize: 16,
    height: 56,
    borderRadius: 10,
    fontWeight: '500',
    paddingVertical: 18,
    backgroundColor: '#eaeaea',
    paddingHorizontal: 20,
  },
  errorInput: {},
  errorText: {},
  clearButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{translateY: 6}],
    padding: 4,
  },
});

export default BaseInput;
