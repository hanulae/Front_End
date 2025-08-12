import {useAtom} from 'jotai';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {signupAtom} from '../../../state/local_state/signupAtom';
import {usePasswordInput} from '../../../hooks/input/usePasswordInput';
import {useConfirmPasswordInput} from '../../../hooks/input/useConfirmPasswordInput';
import {Input} from '../../../components/common/input/Input';
import CustomButton from '../../../components/common/CustomButton';
import Typo from '../../../components/common/Typo';
import {useInputBase} from '../../../hooks/input/useInputBase';
import {useState, useEffect, useRef} from 'react';
import {useRoute} from '@react-navigation/native';

//BSKIM IMPORTS ADD
import useCheckUsername from '../../../hooks/input/useCheckUsername';
import Toast from 'react-native-toast-message';

/**
 * 회원가입 1단계 컴포넌트 (아이디/비밀번호 입력)
 * - 아이디 중복확인 및 비밀번호 유효성 검사 기능
 * - 비밀번호 일치 확인 및 실시간 유효성 검증
 * - 모든 조건을 만족해야 다음 단계 진행 가능
 *
 * Props: onNext (다음 단계 이동 콜백 함수)
 * 주요 라이브러리: jotai (상태관리), react-native-keyboard-aware-scroll-view (키보드 처리)
 */
interface Props {
  onNext: () => void;
}

/**
 * 회원가입 1단계 컴포넌트
 *
 * 관리하는 상태값들:
 * - username: 아이디 입력 상태 및 유효성 검사
 * - password: 비밀번호 입력 상태 및 유효성 검사
 * - confirmPassword: 비밀번호 확인 입력 상태 및 일치 검사
 * - isUsernameChecked/Available: 아이디 중복확인 상태
 */
const SignupStepOne = ({onNext}: Props) => {
  console.log('SignupStepOne');
  const route = useRoute();
  const {userType} = route.params as {userType: 'manager' | 'funeral'};
  const [signupInfo, setSignupInfo] = useAtom(signupAtom);
  /**
   * 아이디 입력값 유효성 검사 함수
   * @param value - 입력된 아이디 문자열
   * @returns 유효성 결과와 오류 메시지
   */
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
  const scrollViewRef = useRef(null);
  const isPasswordValid = password.isValid;
  const isPasswordMatchValid = confirmPassword.isValid;
  // 전체 폼 유효성 검사 (아이디 중복확인 + 비밀번호 유효성 + 비밀번호 일치)
  const isFormValid =
    isUsernameChecked &&
    isUsernameAvailable &&
    isPasswordMatchValid &&
    isPasswordValid;

  // ✅ 여기에 추가하세요
  console.log({
    isUsernameChecked,
    isUsernameAvailable,
    isPasswordValid,
    isPasswordMatchValid,
    password: password.value,
    confirmPassword: confirmPassword.value,
    userName: username.value,
    isFormValid,
  });
  /**
   * 다음 단계로 이동 처리
   * 아이디 중복확인 완료 여부를 검사하고 전역 상태 업데이트
   */
  const handleNext = () => {
    // 아이디 중복확인 완료 여부 검사
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

  /**
   * 아이디 중복확인 처리
   * 사용자 입력 아이디의 중복 여부를 API로 확인
   */
  const handleCheckUsername = () => {
    if (username.value.trim()) {
      checkUsername(username.value.trim()); // API 호출
      // 중복확인 요청 시 기존 결과 초기화
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

  /**
   * 아이디 중복확인 API 결과 처리
   * useCheckUsername 훅에서 반환되는 available 상태를 감지하여 전역 상태 업데이트
   */
  useEffect(() => {
    // 아이디 중복확인 결과에 따른 상태 업데이트
    if (available === true) {
      // 사용 가능한 아이디
      setIsUsernameChecked(true);
      setIsUsernameAvailable(true);
      setSignupInfo(prev => ({
        ...prev,
        isUsernameChecked: true,
        isUsernameAvailable: true,
      }));
    } else if (available === false) {
      // 이미 사용 중인 아이디
      setIsUsernameChecked(true);
      setIsUsernameAvailable(false);
      setSignupInfo(prev => ({
        ...prev,
        isUsernameChecked: true,
        isUsernameAvailable: false,
      }));
    }
  }, [available, setSignupInfo]);

  return (
    <View style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          ref={scrollViewRef}
          style={{flex: 1}}
          contentContainerStyle={{paddingBottom: 80}}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          extraScrollHeight={100}
          enableAutomaticScroll={true}>
          <View style={styles.formWrapper}>
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
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>

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
  );
};

export default SignupStepOne;
const styles = StyleSheet.create({
  wrapperContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
    justifyContent: 'space-between',
  },
  formWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  formContainer: {
    flex: 1,
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
    marginBottom: 4,
    marginLeft: 10,
  },
  authContainer: {
    flexDirection: 'column',
  },
  container: {
    flexDirection: 'column',
    marginBottom: 25,
    gap: 8,
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
    borderRadius: 8,
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
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 10,
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
