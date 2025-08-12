/**
 * 로그인 페이지
 * Props: navigation
 * 주요 라이브러리: react-native, react-navigation, jotai
 */
import React, {useState} from 'react';
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
import {useCallback} from 'react';
import Toast from 'react-native-toast-message';
import api from '../../api/config';
import {storeTokens, storeUserInfo} from '../../utils/tokenStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useInputBase} from '../../hooks/input/useInputBase';
import notificationService from '../../services/notificationService';

//BSK ADD IMPORTS
import {useAtom} from 'jotai';
import {loginAtom} from '../../state/local_state/loginAtom'; // 경로에 맞게 조정

interface ILoginPageProps {
  navigation: NavigationProp<any>;
}
// interface ILoginPageParam {
//   userType: 'manager' | 'funeral';
// }
const {height, width: screenWidth} = Dimensions.get('window');
const LoginPage = ({navigation}: ILoginPageProps) => {
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
  const password = usePasswordInput();
  const setLogin = useSetAtom(userInfoAtom);

  //BSK ADD LOGIN ATOM
  const [_loginInfo, _setLoginInfo] = useAtom(loginAtom);

  // 직원 로그인 여부 확인 (탭 방식으로 대체)
  // const isEmployeeLogin = userType === 'funeral' && email.isEmployee;
  const [funeralTab, setFuneralTab] = useState<'대표' | '직원'>('대표');

  const goToFindEmail = () => {
    navigation.navigate('FindEmail', {userType});
  };
  const goToFindPassword = () => {
    navigation.navigate('FindPW', {userType});
  };
  const goToSignup = () => {
    if (userType === 'manager') {
      navigation.navigate('Signup', {userType: 'manager'});
    } else if (userType === 'funeral') {
      navigation.navigate('Signup', {userType: 'funeral'});
    }
  };

  /**
   * 로그인 성공 후 처리 (토큰 저장, 사용자 정보 설정, FCM 등록)
   * 입력: response - 로그인 응답 데이터
   * 출력: 없음 (상태 변경 및 FCM 토큰 등록)
   */
  const handleLogin = async (response: any) => {
    try {
      // 토큰 저장
      await AsyncStorage.setItem('accessToken', response.data.accessToken);
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);

      // 사용자 정보 저장 필요시 추가

      setLogin({
        userType: userType,
        isLogin: true,
        userName:
          userType === 'manager'
            ? response.data.manager?.managerName
            : funeralTab === '대표'
            ? response.data.funeral?.funeralName
            : response.data.staff?.funeralStaffName,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });

      // ✅ 로그인 성공 후 FCM 토큰 등록
      try {
        // 3. 로그인된 경우 알림 서비스 초기화
        console.log('🔔 로그인 성공 - FCM 토큰 등록 시작');
        await notificationService.initialize();
        const success = await notificationService.registerFCMTokenToServer();
        if (success) {
          console.log('✅ FCM 토큰 백엔드 등록 완료');
          Toast.show({
            type: 'success',
            text1: '로그인 완료',
            text2: '알림 설정이 완료되었습니다.',
            position: 'top',
            topOffset: 100,
          });
        } else {
          console.log('❌ FCM 토큰 백엔드 등록 실패');
          // FCM 등록 실패해도 로그인 자체는 성공으로 처리
          Toast.show({
            type: 'success',
            text1: '로그인 완료',
            position: 'top',
            topOffset: 100,
          });
        }
      } catch (fcmError) {
        console.error('FCM 토큰 등록 중 오류:', fcmError);
        // FCM 등록 실패해도 로그인 자체는 성공으로 처리
        Toast.show({
          type: 'success',
          text1: '로그인 완료',
          position: 'top',
          topOffset: 100,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const username = useInputBase({initialValue: ''});

  /**
   * 비밀번호 유효성 검증
   * 입력: password - 검증할 비밀번호
   * 출력: boolean - 유효성 여부
   */
  const isPasswordValid = (password: string) => {
    const regex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  /**
   * 로그인 처리
   * 입력: 없음
   * 출력: 없음 (API 호출 후 로그인 처리)
   */
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
        // 탭에 따라 다른 API 엔드포인트 호출
        if (funeralTab === '대표') {
          response = await api.post('/funeral/auth/login', {
            funeralUsername: username.value,
            funeralPassword: password.value,
          });
        } else {
          // 직원 로그인 API (실제 엔드포인트는 백엔드에 맞게 조정 필요)
          response = await api.post('/funeral/staff/login', {
            funeralStaffPhoneNumber: username.value,
            funeralStaffPassword: password.value,
          });
        }
      }
      if (!response || !response.data) {
        throw new Error('Login response is invalid');
      }

      // Handle login success
      console.log('Login response:', response);
      const {accessToken, refreshToken} = response.data;

      if (userType === 'manager') {
        const {manager} = response.data;
        await storeUserInfo({
          isLogin: true,
          userType,
          userId: manager.managerId,
          data: manager,
        });
      } else if (userType === 'funeral') {
        if (funeralTab === '대표') {
          const {funeral} = response.data;
          await storeUserInfo({
            isLogin: true,
            userType,
            userId: funeral.funeralId,
            data: funeral,
          });
        } else {
          // 직원 로그인 처리
          const {staff} = response.data;
          await storeUserInfo({
            isLogin: true,
            userType: 'funeral',
            userId: staff.funeralStaffId,
            data: {
              funeralId: staff.funeralId,
              funeralName: staff.funeralStaffName,
              funeralPhoneNumber: staff.funeralStaffPhoneNumber,
              funeralStaffRole: staff.funeralStaffRole,
              // 직원 관련 추가 정보들
              isStaff: true,
              staffId: staff.funeralStaffId,
              staffName: staff.funeralStaffName,
              staffPhoneNumber: staff.funeralStaffPhoneNumber,
              staffRole: staff.funeralStaffRole,
              // 권한 정보 추가
              permissions: response.data.permissions,
            },
          });
        }
      }

      await storeTokens(accessToken, refreshToken);

      handleLogin(response);
    } catch (error: any) {
      console.log('Login error', error);
      // 백엔드에서 받은 오류 메시지 확인
      const errorMessage =
        error.response?.data?.message || '로그인에 실패했습니다.';
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
        {/* funeral일 때만 탭 노출 */}
        {userType === 'funeral' && (
          <View style={styles.tabContainer}>
            <Pressable
              style={[
                styles.tabButton,
                funeralTab === '대표' && styles.tabButtonActive,
              ]}
              onPress={() => setFuneralTab('대표')}>
              <Typo
                style={[
                  styles.tabText,
                  funeralTab === '대표' && styles.tabTextActive,
                ]}>
                대표 계정
              </Typo>
            </Pressable>
            <Pressable
              style={[
                styles.tabButton,
                funeralTab === '직원' && styles.tabButtonActive,
              ]}
              onPress={() => setFuneralTab('직원')}>
              <Typo
                style={[
                  styles.tabText,
                  funeralTab === '직원' && styles.tabTextActive,
                ]}>
                직원 계정
              </Typo>
            </Pressable>
          </View>
        )}
        <View style={styles.formSection}>
          {/* 모든 경우에 아이디/비밀번호 입력 UI 사용 */}
          <Input input={username} placeholder="아이디를 입력하세요" />
          <Input
            input={password}
            type="password"
            placeholder="비밀번호를 입력하세요."
          />
        </View>
        <View style={styles.buttonSection}>
          <CustomButton
            onPress={handleSignin}
            style={[
              styles.button,
              isPasswordValid(password.value)
                ? {backgroundColor: '#2D81F1'}
                : {backgroundColor: '#D3D3D3'},
            ]}>
            <Typo
              style={[
                isPasswordValid(password.value)
                  ? {color: 'white'}
                  : {color: '#6F717D'},
              ]}>
              로그인
            </Typo>
          </CustomButton>
        </View>
        <View style={styles.formToolSection}>
          <CustomButton onPress={goToFindEmail}>
            <Typo style={styles.toolText}>아이디 찾기</Typo>
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
    gap: screenWidth <= 360 ? 60 : 35, // Galaxy S9 등 작은 화면에서 더 큰 gap
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
    marginTop: screenWidth <= 360 ? 14 : 0,
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
    marginTop: 5,
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: screenWidth <= 360 ? 14 : 8,
    gap: 12,
    paddingHorizontal: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#2D81F1',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6F717D',
    fontFamily: 'Pretendard-Medium',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
});
