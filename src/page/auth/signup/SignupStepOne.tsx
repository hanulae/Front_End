import {useSetAtom} from 'jotai';

import {Button, View, Text, StyleSheet} from 'react-native';

import {signupAtom} from '../../../state/local_state/signupAtom';
import {useEmailInput} from '../../../hooks/input/useEmailInput';
import {usePasswordInput} from '../../../hooks/input/usePasswordInput';
import {useConfirmPasswordInput} from '../../../hooks/input/useConfirmPasswordInput';
import {Input} from '../../../components/common/input/Input';
import CustomButton from '../../../components/common/CustomButton';
import Typo from '../../../components/common/Typo';
import {useInputBase} from '../../../hooks/input/useInputBase';
import {useState} from 'react';

interface Props {
  onNext: () => void;
}

const SignupStepOne = ({onNext}: Props) => {
  const setSignupInfo = useSetAtom(signupAtom);
  const email = useEmailInput();
  const password = usePasswordInput();
  const authCode = useInputBase();
  const confirmPassword = useConfirmPasswordInput(() => password.value);
  const [selectedType, setSelectedType] = useState<
    'manager' | 'funeral' | null
  >(null);
  const handleSelectUserType = (type: 'manager' | 'funeral') => {
    setSignupInfo(prev => ({...prev, userType: type}));
    setSelectedType(type); // 선택된 타입 저장
  };

  const handleNext = () => {
    setSignupInfo(prev => ({
      ...prev,
      email: email.value,
      password: password.value,
    }));
    onNext();
  };

  const handleRequestCode = () => {
    // 인증 코드 요청 로직
    console.log('인증 코드 요청:', email.value);
  };

  const handleVerifyCode = () => {
    // 인증 코드 확인 로직
    console.log('인증 코드 확인:', authCode.value);
  };

  return (
    <View style={{flex: 1, paddingHorizontal: 16, paddingVertical: 18}}>
      <Text>회원 유형 선택</Text>
      <View style={styles.typeContainer}>
        <CustomButton
          onPress={() => handleSelectUserType('manager')}
          style={[
            styles.typeButton,
            selectedType === 'manager' && styles.typeButtonSelected,
          ]}>
          <Typo
            style={
              selectedType === 'manager'
                ? styles.typeButtonTextSelected
                : undefined
            }>
            상조팀장
          </Typo>
        </CustomButton>

        <CustomButton
          onPress={() => handleSelectUserType('funeral')}
          style={[
            styles.typeButton,
            selectedType === 'funeral' && styles.typeButtonSelected,
          ]}>
          <Typo
            style={
              selectedType === 'funeral'
                ? styles.typeButtonTextSelected
                : undefined
            }>
            장례식장
          </Typo>
        </CustomButton>
      </View>
      <View style={styles.authSection}>
        <Input input={email} placeholder="전화번호를 입력하세요." />
        <CustomButton onPress={handleRequestCode} style={styles.requestButton}>
          <Typo color="white" fontSize={14} style={{fontWeight: '700'}}>
            인증코드요청
          </Typo>
        </CustomButton>
      </View>
      <View style={styles.authSection}>
        <Input input={authCode} placeholder="인증코드를 입력하세요." />
        <CustomButton onPress={handleVerifyCode} style={styles.requestButton}>
          <Typo color="white" fontSize={14} style={{fontWeight: '700'}}>
            인증코드확인
          </Typo>
        </CustomButton>
      </View>
      <View style={styles.passwordSection}>
        <Input
          input={password}
          placeholder="비밀번호를 입력하세요"
          type="password"
        />
        <Input
          input={confirmPassword}
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력하세요"
          type="password"
        />
      </View>
      <CustomButton onPress={handleNext} style={styles.requestButton}>
        <Typo color="white" fontSize={14} style={{fontWeight: '700'}}>
          다음
        </Typo>
      </CustomButton>
    </View>
  );
};

export default SignupStepOne;

const styles = StyleSheet.create({
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  authSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    // paddingHorizontal: 16,
  },
  requestButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    paddingVertical: 18,
    borderRadius: 5,
    alignItems: 'center',
  },
  passwordSection: {
    height: 200,
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
});
