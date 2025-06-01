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
import {StatusBar} from 'react-native';
import {useAtomValue} from 'jotai';
import {userInfoAtom} from './src/state/local_state/userinfoAtom';
import RootStack from './src/router/RootStack';
import BootSplash from 'react-native-bootsplash';
import {LogBox} from 'react-native';

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  LogBox.ignoreAllLogs();
  const userInfo = useAtomValue(userInfoAtom);
  console.log('userInfo', userInfo);
  const isLogin = userInfo?.isLogin;
  const userType = userInfo?.userType;

  // ✅ 부트스플래시 숨기기
  useEffect(() => {
    const init = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 가짜 지연
      await BootSplash.hide({fade: true});
    };

    init();
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar barStyle="dark-content" />
        <NavigationContainer>
          <RootStack isLogin={isLogin} userType={userType} />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;
