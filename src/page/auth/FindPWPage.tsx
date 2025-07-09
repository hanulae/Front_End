import {NavigationProp, useRoute} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import {usePasswordInput} from '../../hooks/input/usePasswordInput';
import {useConfirmPasswordInput} from '../../hooks/input/useConfirmPasswordInput';
import DefaultLayout from '../../layout/DefaultLayout';
import {Input} from '../../components/common/input/Input';
import CustomButton from '../../components/common/CustomButton';
import {useInputBase} from '../../hooks/input/useInputBase';
import {usePhoneInput} from '../../hooks/input/usePhoneInput';
import Typo from '../../components/common/Typo';
import {useState} from 'react';
import Toast from 'react-native-toast-message';

//BSK IMPORT ADD
import api from '../../api/config';

interface IFindPWPageProps {
  navigation: NavigationProp<any>;
}

const FindPWpage = ({navigation}: IFindPWPageProps) => {
  const phoneNumber = usePhoneInput();
  const password = usePasswordInput();
  const authCode = useInputBase();
  const route = useRoute();
  const {userType} = route.params as {userType: 'manager' | 'funeral'};
  const pageName =
    userType === 'manager'
      ? '상조팀장 비밀번호 변경'
      : '장례식장 비밀번호 변경';
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const confirmPassword = useConfirmPasswordInput(
    () => password.value,
    password.value,
  );
  const isFormValid =
    isPhoneVerified && password.isValid && confirmPassword.isValid;
  // 인증코드 요청 함수
const handleRequestCode = async (phoneNumber: string) => {
  console.log("🚀 ~ handleRequestCode ~ phoneNumber:", phoneNumber)
  try {
    const response = await api.post('manager/sms/send', {
      phoneNumber: phoneNumber,
      userType: userType,
    });
    console.log('Code sent response:', response);

    // 성공 Toast
    Toast.show({
      type: 'success',
      text1: '인증번호가 발송되었습니다.',
      position: 'top',
    });
  } catch (error: any) {
    console.error('Send code error:', error);

    // 실패 Toast
    Toast.show({
      type: 'error',
      text1: '인증번호 발송 실패',
      text2: error.response?.data?.message || '오류가 발생했습니다.',
      position: 'top',
    });
  }
};

// 인증코드 확인 함수
const handleVerifyCode = async (phoneNumber: string, authCode: string): Promise<boolean> => {
  try {
    const response = await api.post('manager/sms/verify', {
      phoneNumber: phoneNumber,
      code: authCode,
      userType: userType,
    });
    console.log('Verify code response:', response);

    if (response.data.success === true) {
      setIsPhoneVerified(true);
      Toast.show({
        type: 'success',
        text1: '인증 성공',
        position: 'top',
      });
      return response.data.success === true;
    } else {
      Toast.show({
        type: 'error',
        text1: '인증 실패',
        text2: '인증코드가 틀렸거나 만료되었습니다.',
        position: 'top',
      });
      return false;
    }
  } catch (error: any) {
    console.error('Verify code error:', error);
    Toast.show({
      type: 'error',
      text1: '서버 오류',
      text2: error.response?.data?.message || '잠시 후 다시 시도해주세요.',
      position: 'top',
    });
    return false;
  }
};

  const handleChangePassword = async () => {
    try {
      const phone = phoneNumber.value; // phoneNumber 훅의 value
      const newPassword = password.value;

      let response;
      if (userType === 'manager') {
        // 상조팀장용 비밀번호 변경 API
        response = await api.patch('manager/auth/update/password/lost', {
          phoneNumber: phone,
          newPassword,
        });
      } else {
        // 장례식장용 비밀번호 변경 API
        response = await api.patch('funeral/auth/update/password/lost', {
          phoneNumber: phone,
          newPassword,
        });
      }

      if (response.data) {
        Toast.show({
          type: 'success',
          text1: '비밀번호 변경 완료',
          position: 'top',
        });
        navigation.goBack();
      }
    } catch (error: any) {
      console.error('비밀번호 변경 오류:', error.message);
      Toast.show({
        type: 'error',
        text1: '비밀번호 변경 실패',
        text2: error.response?.data?.message || '다시 시도해주세요.',
        position: 'top',
      });
    }
  };

  return (
    <DefaultLayout
      headerShown={true}
      headerTitle={pageName}
      color="white"
      homeButton={true}
      logoutButton={false}
      homeRouteName="Main">
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <Typo fontSize={16} style={styles.containerTitle}>
            휴대전화번호 인증
          </Typo>
          <View style={styles.authSection}>
            <Input
              input={phoneNumber}
              placeholder="전화번호를 입력하세요."
              type="phone"
            />
            <CustomButton
              onPress={() => handleRequestCode(phoneNumber.value)}
              style={styles.requestButton}>
              <Typo color="white" fontSize={14} style={{fontWeight: '700'}}>
                인증코드받기
              </Typo>
            </CustomButton>
          </View>
        </View>
        <View style={styles.container}>
          <Typo fontSize={16} style={styles.containerTitle}>
            인증코드 확인
          </Typo>
          <View style={styles.verifySection}>
            <Input
              input={authCode}
              placeholder="인증코드를 입력하세요."
              type="number"
            />
            <CustomButton
              onPress={() => handleVerifyCode(phoneNumber.value, authCode.value)}
              style={styles.verifyButton}>
              <Typo color="white" style={styles.verifyButtonText}>
                인증코드확인
              </Typo>
            </CustomButton>
          </View>
        </View>
        {isPhoneVerified && (
          <>
            <View style={styles.passwordContainer}>
              <Typo fontSize={16} style={styles.containerTitle}>
                새로운 비밀번호
              </Typo>
              <View style={styles.passwordSection}>
                <Input
                  input={password}
                  placeholder="비밀번호를 입력하세요"
                  type="password"
                />
              </View>
            </View>
            <View style={styles.container}>
              <Typo fontSize={16} style={styles.containerTitle}>
                새로운 비밀번호 확인
              </Typo>
              <View style={styles.passwordSection}>
                <Input
                  input={confirmPassword}
                  label="비밀번호 확인"
                  placeholder="비밀번호를 다시 입력하세요"
                  type="password"
                />
              </View>
            </View>
          </>
        )}
      </View>
      <View style={styles.buttonConatiner}>
        <CustomButton
          onPress={handleChangePassword}
          style={[
            styles.confirmButton,
            !isFormValid && {backgroundColor: '#D3D3D3'},
          ]}
          disabled={!isFormValid}>
          <Typo style={styles.confimButtonText}>확인</Typo>
        </CustomButton>
        {/*  <CustomButton
          onPress={handleNext}
          style={[
            styles.confirmButton,
            !isFormValid && {backgroundColor: '#D3D3D3'},
          ]}
          disabled={!isFormValid}>
          <Typo color="white" fontSize={14} style={styles.confrimButtonText}>
            다음
          </Typo>
        </CustomButton> */}
        <Toast />
      </View>
    </DefaultLayout>
  );
};

export default FindPWpage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 16,
  },
  container: {
    // borderWidth: 1,
  },
  passwordContainer: {
    marginTop: 32,
  },
  containerTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard-Light',
    // marginBottom: 5,
    marginLeft: 10,
    color: '#000',
  },
  authSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  requestButton: {
    backgroundColor: '#8990A0',
    padding: 10,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  requestButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Light',
  },
  verifySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  verifyButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(137, 175, 248, 0.75)',
    paddingHorizontal: 9,
    paddingVertical: 17,
    borderRadius: 10,
    alignItems: 'center',
  },
  verifyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A83E3',
    fontFamily: 'Pretendard-Light',
  },
  passwordSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  checkSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  buttonConatiner: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  confirmButton: {
    backgroundColor: '#2D81F1',
    padding: 10,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  confimButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Light',
  },
});
