import React from 'react';
import {
  Dimensions,
  Keyboard,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import Typo from '../../components/common/Typo';
import {Input} from '../../components/common/input/Input';
import CustomButton from '../../components/common/CustomButton';
import {
  NavigationProp,
  useFocusEffect,
  useRoute,
} from '@react-navigation/native';
import {usePasswordInput} from '../../hooks/input/usePasswordInput';
import {useSetAtom} from 'jotai';
import {userInfoAtom} from '../../state/local_state/userinfoAtom';
import {useCallback, useState} from 'react';
import EmailInput from '../../components/common/input/EmailInput';
import useEmailPartsInput from '../../hooks/input/useEmailPartsInput';
import PhoneAuthInput from '../../components/common/input/PhoneAuthInput';
import usePhoneAuthInput from '../../hooks/input/usePhoneAuthInput';
import UserSelectSheet from '../../components/common/UserSelectSheet';
import Toast from 'react-native-toast-message';
import api from '../../api/config';
import {storeTokens, storeUserInfo} from '../../utils/tokenStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useInputBase } from '../../hooks/input/useInputBase';

//BSK ADD IMPORTS
import { useAtom } from 'jotai';
import { loginAtom } from '../../state/local_state/loginAtom'; // 경로에 맞게 조정

interface ILoginPageProps {
  navigation: NavigationProp<any>;
}
// interface ILoginPageParam {
//   userType: 'manager' | 'funeral';
// }
const {height} = Dimensions.get('window');
const LoginPage = ({navigation}: ILoginPageProps) => {
  console.log('LoginPage');
  const [showSelectSheet, setShowSelectSheet] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#3287F8');
        StatusBar.setBarStyle('dark-content');
      } else {
        StatusBar.setBarStyle('dark-content');
      }
    }, []),
  );
  const route = useRoute();
  const {userType} = route.params as {userType: 'manager' | 'funeral'};
  const email = useEmailPartsInput();
  const phoneAuth = usePhoneAuthInput();
  const password = usePasswordInput();
  const setLogin = useSetAtom(userInfoAtom);

  //BSK ADD LOGIN ATOM
  const [loginInfo, setLoginInfo] = useAtom(loginAtom);

  // 직원 로그인 여부 확인
  const isEmployeeLogin = userType === 'funeral' && email.isEmployee;

  const goToFindEmail = () => {
    console.log('goToFindEmail');
    navigation.navigate('FindEmail');
  };
  const goToFindPassword = () => {
    navigation.navigate('FindPW');
  };
  const goToSignup = () => {
    console.log('goToSignup');
    setShowSelectSheet(true);
  };

  const handleLogin = async (response: any) => {
    try {
      // 토큰 저장
      await AsyncStorage.setItem('accessToken', response.data.accessToken);
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);

      // 사용자 정보 저장 필요시 추가

      setLogin({
        userType: userType,
        isLogin: true,
      });

      console.log('Login success', response.data.accessToken);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // 인증코드 발송 함수
  const handleSendCode = async (phoneNumber: string) => {
    try {
      const response = await api.post('/funeral/auth/send-verification-code', {
        phoneNumber: phoneNumber,
      });
      console.log('Code sent response:', response);
    } catch (error) {
      console.error('Send code error:', error);
      throw error;
    }
  };

  // 인증코드 확인 함수
  const handleVerifyCode = async (
    phoneNumber: string,
    authCode: string,
  ): Promise<boolean> => {
    try {
      const response = await api.post('/funeral/auth/verify-code', {
        phoneNumber: phoneNumber,
        verificationCode: authCode,
      });
      console.log('Verify code response:', response);
      return response.data.success === true;
    } catch (error) {
      console.error('Verify code error:', error);
      return false;
    }
  };

  const username = useInputBase({ initialValue: '' });

  const isPasswordValid = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  // 로그인 핸들러
  const handleSignin = async () => {
    console.log('handleSignin');
    if (!username.value || !password.value) {
      Toast.show({
        type: 'error',
        text1: '아이디와 비밀번호를 입력해주세요.',
        position: 'top',
        topOffset: 100,
      });
      return;
    }
    console.log('username', username.value);

    if (!isPasswordValid(password.value)) {
      console.log('Password is invalid'); // 디버깅용
      Toast.show({
        type: 'error',
        text1: '비밀번호는 대문자, 소문자, 숫자, 특수기호를 포함해야 합니다.',
        position: 'top',
        topOffset: 100,
      });
      return;
    }

    try {
      let response;
      if (userType === 'manager') {
        response = await api.post('/manager/auth/login', {
          managerUsername: username.value,
          managerPassword: password.value,
        });
      } else if (userType === 'funeral') {
        response = await api.post('/funeral/auth/login', {
          funeralUsername: username.value,
          funeralPassword: password.value,
        });
      }
      if (!response || !response.data) {
        throw new Error('Login response is invalid');
      }
      
      // Handle login success
      console.log('Login response:', response);
      const { accessToken, refreshToken } = response.data;

      if (userType === 'manager') {
        const { manager } = response.data;
        await storeUserInfo({
          userType,
          userId: manager.managerId,
          data: manager,
        });
      } else if (userType === 'funeral') {
        const { funeral } = response.data;
        await storeUserInfo({
          userType,
          userId: funeral.funeralId,
          data: funeral,
        });
      }

      await storeTokens(accessToken, refreshToken);

      handleLogin(response);

    } catch (error: any) {
      console.log('Login error', error);
      // 백엔드에서 받은 오류 메시지 확인
  const errorMessage = error.response?.data?.message || '로그인에 실패했습니다.';
      Toast.show({
        type: 'error',
        text1: errorMessage,
        position: 'top',
        topOffset: 100,
      });
    }
  };
  return (
    <DefaultLayout
      headerShown={true}
      // headerTitle="로그인"
      color="white"
      homeButton={true}
      logoutButton={false}
      homeRouteName="Main">
      <Pressable onPress={Keyboard.dismiss}>
        {/* <ScrollView style={styles.wrapper}> */}
        <View style={styles.logoSection}>
          <Typo style={styles.logoText}>하늘애</Typo>
        </View>
        <View
          style={[
            styles.formSection,
            isEmployeeLogin && {height: height * 0.25, gap: 16},
          ]}>
          {isEmployeeLogin ? (
            <PhoneAuthInput
              input={phoneAuth}
              onSendCode={handleSendCode}
              onVerifyCode={handleVerifyCode}
            />
          ) : (
            <>
              <Input
                input={username}
                placeholder="아이디를 입력하세요"
              />
              <Input
                input={password}
                type="password"
                placeholder="비밀번호를 입력하세요."
              />
            </>
          )}
        </View>
        <View style={styles.buttonSection}>
          <CustomButton
            onPress={handleSignin}
            style={[
              styles.button,
              isPasswordValid(password.value) ? { backgroundColor: '#2D81F1' } : { backgroundColor: '#D3D3D3' }
            ]}
          >
            <Typo>로그인</Typo>
          </CustomButton>
        </View>
        <View style={styles.formToolSection}>
          <CustomButton onPress={goToFindEmail}>
            <Typo style={styles.toolText}>이메일 찾기</Typo>
          </CustomButton>
          <Typo style={styles.divider}> | </Typo>
          <CustomButton onPress={goToFindPassword}>
            <Typo style={styles.toolText}>비밀번호 찾기</Typo>
          </CustomButton>
          <Typo style={styles.divider}> | </Typo>
          <CustomButton onPress={goToSignup}>
            <Typo style={[styles.toolText, {color: '#2D81F1'}]}>회원가입</Typo>
          </CustomButton>
        </View>
        {/* </ScrollView> */}
      </Pressable>
      {showSelectSheet && (
        <UserSelectSheet
          onClose={() => setShowSelectSheet(false)}
          targetScreen="Signup"
        />
      )}
      <Toast />
    </DefaultLayout>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  logoSection: {
    // flex: 3,
    height: height * 0.3,
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: '400',
    textAlign: 'center',
    color: '#2F86F8',
    fontFamily: 'GmarketSansTTFMedium',
  },
  formSection: {
    height: height * 0.15,
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 70,
    // alignItems: 'center',
  },
  formToolSection: {
    // flex: 1,
    // borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 4,
  },
  buttonSection: {
    // flex: 3,
    // borderWidth: 1,
    flexDirection: 'column',
    gap: 16,
    marginBottom: 32,
  },
  button: {
    // flex: 1,
    // borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(137, 144, 160, 0.5)',
    paddingVertical: 18,
    marginHorizontal: 18,
    marginTop: 60,
    // marginVertical: 16,
    borderRadius: 8,
  },
  toolText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6F717D',
    fontFamily: 'Pretendard-Medium',
  },
  divider: {
    fontSize: 10,
    color: '#AFB3BB',
  },
});
