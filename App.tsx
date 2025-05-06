/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import MainPage from './src/page/common/MainPage';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StatusBar} from 'react-native';
import CommonStack from './src/router/CommonStack';
import ManagerStack from './src/router/ManagerStack';
import {useAtomValue} from 'jotai';
import {userInfoAtom} from './src/state/local_state/userinfoAtom';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const userInfo = useAtomValue(userInfoAtom);
  const isLogin = userInfo?.isLogin;
  const userType = userInfo?.userType;
  const queryClient = new QueryClient();
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar barStyle="dark-content" />
        <NavigationContainer>
          {isLogin === false ? (
            <CommonStack />
          ) : userType === 'manager' ? (
            <ManagerStack />
          ) : (
            <ManagerStack />
          )}
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;
