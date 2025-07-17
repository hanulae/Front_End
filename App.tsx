/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {
  StatusBar,
  Appearance,
  Platform,
  PermissionsAndroid,
  BackHandler,
  Alert,
} from 'react-native';
import {useAtom} from 'jotai';
import {userInfoAtom} from './src/state/local_state/userinfoAtom';
import RootStack from './src/router/RootStack';
// import BootSplash from 'react-native-bootsplash';
import notificationService from './src/services/notificationService';
import notifee from '@notifee/react-native';
import {getNavigationTarget} from './src/services/api/notificationService';
import {getUserInfo} from './src/utils/tokenStorage';
import {navigationRef} from './src/util/navigationRef';
import messaging from '@react-native-firebase/messaging';

const queryClient = new QueryClient();

// 네비게이션 참조 생성
// const navigationRef = createNavigationContainerRef();

function App(): React.JSX.Element {
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const isLogin = userInfo?.isLogin;
  const userType = userInfo?.userType;
  const initialNotificationHandled = useRef(false);
  console.log('isLogin', isLogin);
  console.log('현재 플랫폼 버전', Platform.Version);
  // 알림 권한 요청 함수
  const requestNotificationPermission = async () => {
    try {
      console.log('=== 알림 권한 요청 시작 ===');

      if (Platform.OS === 'ios') {
        console.log('iOS: 알림 권한 요청...');
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('✅ iOS 알림 권한 허용:', authStatus);
        } else {
          console.log('❌ iOS 알림 권한 거부:', authStatus);
        }
      } else if (Platform.OS === 'android' && Platform.Version >= 33) {
        console.log('Android 13+: POST_NOTIFICATIONS 권한 요청...');
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('✅ Android 알림 권한 허용');
        } else {
          console.log('❌ Android 알림 권한 거부');
        }
      } else {
        console.log('Android 12 이하: 별도 권한 요청 불필요');
      }

      console.log('=== 알림 권한 요청 완료 ===');
    } catch (error) {
      console.error('알림 권한 요청 중 오류:', error);
    }
  };

  // 앱 초기화 함수
  const initializeApp = async () => {
    try {
      console.log('=== 앱 초기화 시작 ===');

      // 1. 알림 권한 요청
      await requestNotificationPermission();

      // 2. 저장된 사용자 정보 불러오기
      const storedUserInfo = await getUserInfo();
      if (storedUserInfo && storedUserInfo.isLogin) {
        let userName = '';
        if (storedUserInfo.userType === 'manager') {
          userName = storedUserInfo.data?.managerName || '';
        } else if (storedUserInfo.userType === 'funeral') {
          if (storedUserInfo.data?.isStaff) {
            userName = storedUserInfo.data?.staffName || '';
          } else {
            userName = storedUserInfo.data?.funeralName || '';
          }
        }

        setUserInfo({
          userType: storedUserInfo.userType,
          isLogin: storedUserInfo.isLogin,
          userName: userName,
          accessToken: '',
          refreshToken: '',
        });
        console.log('저장된 사용자 정보 불러옴:', storedUserInfo);

        // 3. 로그인된 경우 알림 서비스 초기화
        await notificationService.initialize();
        console.log('알림 서비스 초기화 완료');

        // 4. FCM 토큰 백엔드 등록
        const success = await notificationService.registerFCMTokenToServer();
        if (success) {
          console.log('FCM 토큰 백엔드 등록 완료');
        } else {
          console.log('FCM 토큰 백엔드 등록 실패');
        }
      } else {
        console.log('저장된 사용자 정보 없음');
      }

      console.log('=== 앱 초기화 완료 ===');
    } catch (error) {
      console.error('앱 초기화 중 오류:', error);
    }
  };

  useEffect(() => {
    Appearance.setColorScheme('light');
  }, []);

  // ✅ 앱 시작 시 초기화
  useEffect(() => {
    initializeApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 앱 시작 시 한 번만 실행

  // ✅ 부트스플래시 숨기기
  // useEffect(() => {
  //   const init = async () => {
  //     await new Promise(resolve => setTimeout(resolve, 1000));
  //     await BootSplash.hide({fade: true});
  //   };

  //   init();
  // }, []);

  // ✅ 앱 종료 상태에서 알림 클릭으로 인한 실행 처리
  useEffect(() => {
    console.log('1. 앱 종료 상태에서 알림 클릭 으로 useEffect 실행');
    const handleInitialNotification = async () => {
      try {
        if (initialNotificationHandled.current) return;

        const initialNotification = await notifee.getInitialNotification();
        console.log('초기 알림 확인:', initialNotification);

        if (initialNotification) {
          initialNotificationHandled.current = true;
          console.log('앱 시작 시 알림으로 인한 실행 감지');

          const notificationType = initialNotification.notification.data
            ?.notificationType as string;
          const notificationData = initialNotification.notification.data;

          console.log('초기 알림 타입:', notificationType);
          console.log('초기 알림 데이터:', notificationData);

          if (notificationType && notificationData) {
            const navigationTarget = getNavigationTarget(
              notificationType,
              notificationData,
            );
            console.log('초기 네비게이션 타겟:', navigationTarget);

            if (navigationTarget) {
              if (isLogin) {
                setTimeout(() => {
                  if (navigationRef.current?.isReady()) {
                    (navigationRef.current as any).navigate(
                      navigationTarget.screen,
                      navigationTarget.params,
                    );
                    console.log(
                      '초기 알림 네비게이션 실행:',
                      navigationTarget.screen,
                    );
                  }
                }, 1000);
              } else {
                console.log('로그인 후 알림 네비게이션 처리 예정');
              }
            }
          }
        }
      } catch (error) {
        console.error('초기 알림 처리 중 오류:', error);
      }
    };

    if (navigationRef.current?.isReady()) {
      handleInitialNotification();
    } else {
      const unsubscribe = navigationRef.current?.addListener('state', () => {
        if (navigationRef.current?.isReady()) {
          unsubscribe?.();
          handleInitialNotification();
        }
      });
    }
  }, [isLogin]);

  // ✅ 뒤로 가기 버튼 눌렀을 때 앱 종료 방지
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        '앱 종료',
        '앱을 종료하시겠습니까?',
        [
          {
            text: '취소',
            onPress: () => null,
            style: 'cancel',
          },
          {text: '확인', onPress: () => BackHandler.exitApp()},
        ],
        {cancelable: false},
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <NavigationContainer
          ref={navigationRef}
          onReady={() => {
            console.log('✅ NavigationContainer is ready');
            notificationService.setupNotificationListeners(); // 이제 navRef 인자 필요 없음
          }}>
          <RootStack isLogin={isLogin} userType={userType} />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;
