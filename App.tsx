/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StatusBar, Appearance} from 'react-native';
import {useAtom, useAtomValue, useSetAtom} from 'jotai';
import {userInfoAtom} from './src/state/local_state/userinfoAtom';
import RootStack from './src/router/RootStack';
import BootSplash from 'react-native-bootsplash';
import notificationService from './src/services/notificationService';
import notifee from '@notifee/react-native';
import {getNavigationTarget} from './src/services/api/notificationService';
import {getUserInfo} from './src/utils/tokenStorage';

const queryClient = new QueryClient();

// 네비게이션 참조 생성
const navigationRef = createNavigationContainerRef();

function App(): React.JSX.Element {
  // const userInfo = useAtomValue(userInfoAtom);
  // const setUserInfo = useSetAtom(userInfoAtom);
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const isLogin = userInfo?.isLogin;
  const userType = userInfo?.userType;
  const initialNotificationHandled = useRef(false);
  console.log('isLogin', isLogin);

  useEffect(() => {
    Appearance.setColorScheme('light');
  }, []);

  // ✅ 앱 시작시 저장된 사용자 정보 불러오기
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const storedUserInfo = await getUserInfo();
        if (storedUserInfo && storedUserInfo.isLogin) {
          // AsyncStorage에 저장된 정보를 atom에 업데이트
          let userName = '';
          if (storedUserInfo.userType === 'manager') {
            userName = storedUserInfo.data?.managerName || '';
          } else if (storedUserInfo.userType === 'funeral') {
            if (storedUserInfo.data?.isStaff) {
              // 직원인 경우
              userName = storedUserInfo.data?.staffName || '';
            } else {
              // 대표인 경우
              userName = storedUserInfo.data?.funeralName || '';
            }
          }

          setUserInfo({
            userType: storedUserInfo.userType,
            isLogin: storedUserInfo.isLogin,
            userName: userName,
            accessToken: '', // 토큰은 별도로 관리되므로 빈 값
            refreshToken: '',
          });
          console.log('저장된 사용자 정보 불러옴:', storedUserInfo);
        } else {
          console.log('저장된 사용자 정보 없음');
        }
      } catch (error) {
        console.error('사용자 정보 불러오기 실패:', error);
      }
    };

    loadUserInfo();
  }, [setUserInfo]);

  // ✅ 부트스플래시 숨기기
  useEffect(() => {
    const init = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 가짜 지연
      await BootSplash.hide({fade: true});
    };

    init();
  }, []);

  // ✅ 앱 종료 상태에서 알림 클릭으로 인한 실행 처리
  useEffect(() => {
    const handleInitialNotification = async () => {
      try {
        if (initialNotificationHandled.current) return;

        const initialNotification = await notifee.getInitialNotification();
        console.log('초기 알림 확인:', initialNotification);

        if (initialNotification) {
          initialNotificationHandled.current = true;
          console.log('앱 시작 시 알림으로 인한 실행 감지');

          // 알림 데이터에서 타입과 정보 추출
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
              // 로그인 상태를 확인하고 적절히 처리
              if (isLogin) {
                // 로그인된 상태면 바로 네비게이션
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
                }, 1000); // 네비게이션이 준비될 때까지 대기
              } else {
                // 로그인되지 않은 상태면 로그인 후 처리하도록 상태 저장
                // (필요시 전역 상태에 저장)
                console.log('로그인 후 알림 네비게이션 처리 예정');
              }
            }
          }
        }
      } catch (error) {
        console.error('초기 알림 처리 중 오류:', error);
      }
    };

    // 네비게이션이 준비된 후 실행
    if (navigationRef.current?.isReady()) {
      handleInitialNotification();
    } else {
      // 네비게이션이 준비되지 않았으면 준비될 때까지 대기
      const unsubscribe = navigationRef.current?.addListener('state', () => {
        if (navigationRef.current?.isReady()) {
          unsubscribe?.();
          handleInitialNotification();
        }
      });
    }
  }, [isLogin]);

  // ✅ 알림 서비스 초기화 (앱 시작 시 한 번만)
  useEffect(() => {
    const initNotifications = async () => {
      try {
        // 알림 서비스 초기화
        await notificationService.initialize();

        // 네비게이션이 준비된 후에 이벤트 리스너 설정
        const setupListeners = () => {
          console.log(
            '네비게이션 준비 상태 확인:',
            navigationRef.current?.isReady(),
          );
          console.log('네비게이션 참조 존재:', !!navigationRef.current);

          if (navigationRef.current?.isReady()) {
            notificationService.setupNotificationListeners(navigationRef);
            console.log('알림 서비스 초기화 완료');
          } else {
            // 네비게이션이 준비되지 않았으면 준비될 때까지 대기
            setTimeout(setupListeners, 200);
          }
        };

        setupListeners();
      } catch (error) {
        console.error('알림 서비스 초기화 실패:', error);
      }
    };

    initNotifications();
  }, []); // 앱 시작 시 한 번만 실행

  // ✅ FCM 토큰 백엔드 등록 (로그인 상태 변경 시)
  useEffect(() => {
    const registerToken = async () => {
      if (isLogin) {
        // 잠시 대기 후 FCM 토큰 등록 (토큰 획득 시간 고려)
        setTimeout(async () => {
          try {
            const success =
              await notificationService.registerFCMTokenToServer();
            if (success) {
              console.log('FCM 토큰 백엔드 등록 완료');
            } else {
              console.log('FCM 토큰 백엔드 등록 실패');
            }
          } catch (error) {
            console.error('FCM 토큰 백엔드 등록 중 오류:', error);
          }
        }, 2000); // 2초 대기
      }
    };

    registerToken();
  }, [isLogin]); // 로그인 상태 변경 시에만 실행

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <NavigationContainer ref={navigationRef}>
          <RootStack isLogin={isLogin} userType={userType} />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;
