import {useAtom} from 'jotai';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {signupAtom} from '../../../state/local_state/signupAtom';
import {usePasswordInput} from '../../../hooks/input/usePasswordInput';
import {useConfirmPasswordInput} from '../../../hooks/input/useConfirmPasswordInput';
import {Input} from '../../../components/common/input/Input';
import CustomButton from '../../../components/common/CustomButton';
import Typo from '../../../components/common/Typo';
import {useInputBase} from '../../../hooks/input/useInputBase';
import {useState, useEffect} from 'react';
import {useRoute} from '@react-navigation/native';

//BSKIM IMPORTS ADD
import useCheckUsername from '../../../hooks/input/useCheckUsername';
import Toast from 'react-native-toast-message';

interface Props {
  onNext: () => void;
}

const SignupStepOne = ({onNext}: Props) => {
  console.log('SignupStepOne');
  const route = useRoute();
  const {userType} = route.params as {userType: 'manager' | 'funeral'};
  const [signupInfo, setSignupInfo] = useAtom(signupAtom);
  //const email = useEmailPartsInput(signupInfo.email);
  const validateUsername = (value: string) => {
    if (!value) {
      return {valid: false, message: '아이디를 입력해주세요'};
    }
    if (value.length < 4) {
      return {valid: false, message: '아이디는 4자 이상'};
    }
    return {valid: true, message: ''};
  };
  const username = useInputBase({
    initialValue: signupInfo.userName || '',
    validate: validateUsername,
  });
  const {available, message, checkUsername} = useCheckUsername(userType);
  const password = usePasswordInput(signupInfo.password || '');
  //const authCode = useInputBase();
  const confirmPassword = useConfirmPasswordInput(
    () => password.value,
    signupInfo.confirmPassword || '',
  );
  const [isUsernameChecked, setIsUsernameChecked] = useState(
    signupInfo.isUsernameChecked,
  );
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(
    signupInfo.isUsernameAvailable,
  );
  const isPasswordValid = password.isValid;
  const isPasswordMatchValid = confirmPassword.isValid;
  const isFormValid =
    signupInfo.isUsernameChecked &&
    signupInfo.isUsernameAvailable &&
    isPasswordMatchValid &&
    isPasswordValid;

  // ✅ 여기에 추가하세요
  console.log({
    isUsernameChecked,
    isPasswordValid,
    isPasswordMatchValid,
    password: password.value,
    confirmPassword: confirmPassword.value,
    userName: username.value,
  });
  const handleNext = () => {
    if (!isUsernameChecked || !isUsernameAvailable) {
      Toast.show({
        type: 'error',
        text1: '아이디 확인',
        text2: '아이디 중복 확인을 해주세요.',
        position: 'top',
      });
      return;
    }

    console.log('isUsernameChecked', isUsernameChecked);
    console.log('isPasswordMatchValid', isPasswordMatchValid);
    console.log('isPasswordValid', isPasswordValid);
    console.log('isFormValid', isFormValid);

    setSignupInfo(prev => ({
      ...prev,
      userName: username.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    }));
    onNext();
  };

  const handleCheckUsername = () => {
    if (username.value.trim()) {
      checkUsername(username.value.trim());
      // 중복확인 요청 시, 결과를 초기화
      setSignupInfo(prev => ({
        ...prev,
        isUsernameChecked: false,
        isUsernameAvailable: false,
      }));
    }
  };

  useEffect(() => {
    console.log('Signup Info:', signupInfo);
  }, [signupInfo]);

  // available 상태 변화 감지하여 isUsernameChecked 업데이트
  useEffect(() => {
    if (available === true) {
      setIsUsernameChecked(true);
      setSignupInfo(prev => ({
        ...prev,
        isUsernameChecked: true,
        isUsernameAvailable: true, // 추가
      }));
    } else if (available === false) {
      setIsUsernameChecked(false);
      setSignupInfo(prev => ({
        ...prev,
        isUsernameChecked: false,
        isUsernameAvailable: false, // 추가
      }));
    }
  }, [available, setSignupInfo]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.wrapperContainer}>
        <View style={styles.formContainer}>
          <View style={styles.container}>
            <Typo fontSize={16} style={styles.containerTitle}>
              아이디
            </Typo>
            <View style={styles.authSection}>
              <Input input={username} placeholder="아이디를 입력하세요" />
              <CustomButton
                onPress={handleCheckUsername}
                style={styles.requestButton}>
                <Typo color="white" fontSize={14} style={styles.buttonText}>
                  중복확인
                </Typo>
              </CustomButton>
            </View>
            {message ? (
              <Typo
                fontSize={12}
                color={available ? '#2D81F1' : 'red'}
                style={{marginLeft: 10}}>
                {message}
              </Typo>
            ) : null}
          </View>
          <View style={styles.container}>
            <Typo fontSize={16} style={styles.containerTitle}>
              비밀번호
            </Typo>
            <Input
              input={password}
              placeholder="비밀번호를 입력하세요"
              type="password"
            />
            {password.touched && password.error ? (
              <Typo fontSize={12} color="red" style={{marginLeft: 10}}>
                {password.error}
              </Typo>
            ) : null}
          </View>
          <View style={styles.container}>
            <Typo fontSize={16} style={styles.containerTitle}>
              비밀번호 확인
            </Typo>
            <Input
              input={confirmPassword}
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력하세요"
              type="password"
            />
            {confirmPassword.touched && confirmPassword.error ? (
              <Typo fontSize={12} color="red" style={{marginLeft: 10}}>
                {confirmPassword.error}
              </Typo>
            ) : null}
          </View>
        </View>

        <View style={styles.confirmButtonContainer}>
          <CustomButton
            onPress={handleNext}
            style={[
              styles.confirmButton,
              !isFormValid && {backgroundColor: '#D3D3D3'},
            ]}
            disabled={!isFormValid}>
            <Typo color="white" fontSize={14} style={styles.confrimButtonText}>
              다음
            </Typo>
          </CustomButton>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignupStepOne;

const styles = StyleSheet.create({
  wrapperContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  formContainer: {
    flex: 2,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  containerTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard-Light',
    marginBottom: 10,
    marginLeft: 10,
  },
  authContainer: {
    flexDirection: 'column',
  },
  container: {
    flexDirection: 'column',
    marginBottom: 30,
    gap: 10,
    flex: 1,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Pretendard-Light',
  },
  verifyButton: {
    backgroundColor: '#4F7CFF',
    borderRadius: 5,
    padding: 10,
    paddingVertical: 18,
  },
  verifyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Pretendard-Light',
  },
  authSection: {
    // marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    // paddingHorizontal: 16,
  },
  requestButton: {
    backgroundColor: '#4F7CFF',
    padding: 10,
    paddingVertical: 18,
    borderRadius: 5,
    alignItems: 'center',
  },
  passwordSection: {
    // height: 200,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 18,
  },
  typeButtonSelected: {
    backgroundColor: '#4F7CFF', // 선택됐을 때 배경색
    borderColor: '#4F7CFF',
    borderWidth: 1,
  },
  typeButtonTextSelected: {
    color: '#fff', // 텍스트 색도 바꿔주기
    fontWeight: 'bold',
  },
  confirmButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  confirmButton: {
    paddingVertical: 18,
    backgroundColor: '#2D81F1',
    borderRadius: 10,
    alignItems: 'center',
  },
  confrimButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Pretendard-Light',
  },
});
