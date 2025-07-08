/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StatusBar, Appearance} from 'react-native';
import {useAtomValue} from 'jotai';
import {userInfoAtom} from './src/state/local_state/userinfoAtom';
import RootStack from './src/router/RootStack';
import BootSplash from 'react-native-bootsplash';
import notificationService from './src/services/notificationService';

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  const userInfo = useAtomValue(userInfoAtom);
  const isLogin = userInfo?.isLogin;
  const userType = userInfo?.userType;
  console.log('isLogin', isLogin);

  useEffect(() => {
    Appearance.setColorScheme('light');
  }, []);

  // ✅ 부트스플래시 숨기기
  useEffect(() => {
    const init = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 가짜 지연
      await BootSplash.hide({fade: true});
    };

    init();
  }, []);

  // ✅ 알림 서비스 초기화 및 FCM 토큰 등록
  useEffect(() => {
    const initNotifications = async () => {
      try {
        // 알림 서비스 초기화
        await notificationService.initialize();
        notificationService.setupNotificationListeners();
        console.log('알림 서비스 초기화 완료');

        // 로그인 상태일 때만 FCM 토큰을 백엔드로 전송
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
      } catch (error) {
        console.error('알림 서비스 초기화 실패:', error);
      }
    };

    initNotifications();
  }, [isLogin]); // isLogin이 변경될 때마다 실행

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <NavigationContainer>
          <RootStack isLogin={isLogin} userType={userType} />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;
