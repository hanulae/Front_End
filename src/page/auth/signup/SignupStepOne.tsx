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
import {useState} from 'react';
import EmailInput from '../../../components/common/input/EmailInput';
import useEmailPartsInput from '../../../hooks/input/useEmailPartsInput';
import {useRoute} from '@react-navigation/native';
import api from '../../../api/config';

interface Props {
  onNext: () => void;
}

const SignupStepOne = ({onNext}: Props) => {
  console.log('SignupStepOne');
  const route = useRoute();
  const {userType} = route.params as {userType: 'manager' | 'funeral'};
  const [signupInfo, setSignupInfo] = useAtom(signupAtom);
  const email = useEmailPartsInput(signupInfo.email);
  const password = usePasswordInput(signupInfo.password);
  const authCode = useInputBase();
  const confirmPassword = useConfirmPasswordInput(
    () => password.value,
    signupInfo.confirmPassword,
  );
  const [isEmailVerified, setIsEmailVerified] = useState(
    signupInfo.isEmailVerified,
  );
  const isPasswordValid = password.isValid;
  const isPasswordMatchValid = confirmPassword.isValid;
  const isFormValid =
    isEmailVerified && isPasswordMatchValid && isPasswordValid;

     // ✅ 여기에 추가하세요
  console.log({
    isEmailVerified,
    isPasswordValid,
    isPasswordMatchValid,
    password: password.value,
    confirmPassword: confirmPassword.value,
    email: email.fullEmail,
  });
  const handleNext = () => {
    console.log({
      isEmailVerified,
      isPasswordValid,
      isPasswordMatchValid,
      password: password.value,
      confirmPassword: confirmPassword.value,
      email: email.fullEmail,
    });
    setSignupInfo(prev => ({
      ...prev,
      email: email.fullEmail,
      password: password.value,
      confirmPassword: confirmPassword.value,
    }));
    onNext();
  };

  const handleRequestCode = async () => {
    console.log('인증 코드 요청:', email.fullEmail);
    try {
      console.log('userType:', userType);
      // userType이 manager인 경우
      if (userType === 'manager') {
        const res = await api.post('/manager/email/send', {
          email: email.fullEmail,
        });
        console.log('📨 manager 이메일 발송 성공:', res.data);
      }
  
      // userType이 funeral인 경우
      if (userType === 'funeral') {
        const res = await api.post('/funeral/email/send', {
          email: email.fullEmail,
        });
        console.log('📨 funeral 이메일 발송 성공:', res.data);
      }
    } catch (error: any) {
      console.log('❌ 이메일 발송 실패:', error.response?.data || error.message);
    }
  };

  const handleVerifyCode = async () => {
    console.log('인증 코드 확인:', authCode.value);

  // if (!email.fullEmail || !authCode.value) {
  //   console.warn('⚠️ 이메일 또는 인증 코드가 비어 있습니다.');
  //   return;
  // }

  // try {
  //   let res;

  //   // userType에 따라 API 경로 다르게 처리
  //   if (userType === 'manager') {
  //     res = await api.post('/manager/email/verify', {
  //       email: email.fullEmail,
  //       code: authCode.value,
  //     });
  //   } else if (userType === 'funeral') {
  //     res = await api.post('/funeral/email/verify', {
  //       email: email.fullEmail,
  //       code: authCode.value,
  //     });
  //   }

  //   // 인증 성공 시 상태 업데이트
  //   if (res?.status === 200) {
  //     console.log('✅ 인증 성공:', res.data);
  //     setIsEmailVerified(true);
  //     setSignupInfo(prev => ({
  //       ...prev,
  //       isEmailVerified: true,
  //     }));
  //   }
  // } catch (error: any) {
  //   console.log('❌ 인증 실패:', error.response?.data?.message || error.message);
  // }

    // 테스트용: 값이 '1234'일 때 인증 성공 처리
    if (authCode.value === '1234') {
      setIsEmailVerified(true);
      setSignupInfo(prev => ({
        ...prev,
        isEmailVerified: true,
      }));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.wrapperContainer}>
        <View style={styles.authContainer}>
          <Typo fontSize={16} style={styles.containerTitle}>
            이메일 인증
          </Typo>
          <View style={styles.authSection}>
            <EmailInput input={email} userType={userType} />
            <CustomButton
            onPress={handleRequestCode}
            style={styles.requestButton}
            disabled={false} // ❗️버튼이 항상 활성화되도록 명시
          >
            <Typo color="white" fontSize={14} style={styles.buttonText}>
              인증코드받기
            </Typo>
          </CustomButton>
          </View>
        </View>
        <View style={styles.authSection}>
          <Input input={authCode} placeholder="인증코드를 입력하세요." />
          <CustomButton
            onPress={handleVerifyCode}
            style={[
              styles.verifyButton,
              isEmailVerified && {backgroundColor: '#D3D3D3'},
            ]}>
            <Typo color="white" fontSize={14} style={styles.verifyButtonText}>
              {isEmailVerified ? '인증확인완료' : '인증코드확인'}
            </Typo>
          </CustomButton>
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
    backgroundColor: '#8990A0',
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
