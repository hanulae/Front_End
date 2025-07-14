import {StyleSheet, View, TouchableOpacity} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import {usePhoneInput} from '../../hooks/input/usePhoneInput';
import {Input} from '../../components/common/input/Input';
import CustomButton from '../../components/common/CustomButton';
import Typo from '../../components/common/Typo';
import {useInputBase} from '../../hooks/input/useInputBase';
import BaseInput from '../../components/common/input/BaseInput';
import {NavigationProp, useRoute} from '@react-navigation/native';
import {request} from 'react-native-permissions';
import api from '../../api/config';
import React, { useState } from 'react';
import Toast from 'react-native-toast-message';

interface IFindEmailPageProps {
  navigation: NavigationProp<any>;
}

const FindEmailPage = ({navigation}: IFindEmailPageProps) => {
  const phoneNumber = usePhoneInput();
  const route = useRoute();
  const {userType} = route.params as {userType: 'manager' | 'funeral'};
  const authCode = useInputBase();

  const [username, setUsername] = useState<string | null>(null);
  const [isVerifyButtonDisabled, setIsVerifyButtonDisabled] = useState(false);

  const handleRequestCode = async () => {
    try {
      let response;
      if (userType === 'manager') {
        response = await api.post('manager/auth/find/username/send', {
          managerPhoneNumber: phoneNumber.value,
        });
      } else {
        response = await api.post('funeral/auth/find/username/send', {
          funeralPhoneNumber: phoneNumber.value,
        });
      }

      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: '성공',
          text2: '인증 코드가 전송되었습니다.',
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: '오류',
        text2:
          error.response?.data?.message || '인증 코드 전송에 실패했습니다.',
      });
    }
  };
  const pageName =
    userType === 'manager' ? '상조팀장 아이디 찾기' : '장례식장 아이디 찾기';

  const handleVerifyCode = async () => {
    try {
      let response;
      if (userType === 'manager') {
        response = await api.post('manager/auth/find/username/verify', {
          managerPhone: phoneNumber.value,
          code: authCode.value,
        });
      } else {
        response = await api.post('funeral/auth/find/username/verify', {
          funeralPhoneNumber: phoneNumber.value,
          code: authCode.value,
        });
      }

      console.log("🚀 ~ handleVerifyCode ~ response:", response)

      if (response.status === 200 && response.data.verified) {
        setUsername(response.data.username);
        setIsVerifyButtonDisabled(true); // Disable the button
        Toast.show({
          type: 'success',
          text1: '성공',
          text2: '인증이 완료되었습니다. 아이디를 확인하세요.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: '오류',
          text2: '인증에 실패했습니다.',
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: '오류',
        text2: error.response?.data?.message || '인증에 실패했습니다.',
      });
    }
  };

  const handleCheckEmail = () => {
    navigation.goBack();
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
            <TouchableOpacity
              onPress={handleRequestCode}
              style={styles.requestButton}
              activeOpacity={0.5}>
              <Typo color="white" fontSize={14} style={{fontWeight: '700'}}>
                인증코드받기
              </Typo>
            </TouchableOpacity>
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
              onPress={handleVerifyCode}
              style={[
                styles.verifyButton,
                { backgroundColor: isVerifyButtonDisabled ? '#C0C0C0' : '#FFFFFF' } // Change color when disabled
              ]}
              disabled={isVerifyButtonDisabled} // Disable the button
            >
              <Typo color="white" style={styles.verifyButtonText}>
                인증코드확인
              </Typo>
            </CustomButton>
          </View>
        </View>
        <View style={styles.container}>
          <Typo fontSize={16} style={styles.containerTitle}>
            나의 아이디
          </Typo>
          <View style={styles.checkSection}>
            <BaseInput
              value={username || '인증코드 확인 후 아이디를 확인하세요.'}
              editable={false}
              style={{flex: 1}}
              placeholder="인증코드 확인 후 아이디를 확인하세요."
              clearable={false}
            />
          </View>
        </View>
        <View style={styles.buttonConatiner}>
          <CustomButton onPress={handleCheckEmail} style={styles.confirmButton}>
            <Typo style={styles.confimButtonText}>확인</Typo>
          </CustomButton>
        </View>
        <Toast />
      </View>
    </DefaultLayout>
  );
};

export default FindEmailPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 16,
  },
  container: {
    // borderWidth: 1,
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
    marginVertical: 16,
  },
  requestButton: {
    backgroundColor: '#2D81F1',
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
    marginVertical: 16,
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
  checkSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginVertical: 16,
  },
  buttonConatiner: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 16,
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
