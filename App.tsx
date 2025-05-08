/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {Provider as JotaiProvider} from 'jotai';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StatusBar} from 'react-native';
import CommonStack from './src/router/CommonStack';
import ManagerStack from './src/router/ManagerStack';
import {useAtomValue} from 'jotai';
import {userInfoAtom} from './src/state/local_state/userinfoAtom';
import FuneralStack from './src/router/FuneralStack';
import RootStack from './src/router/RootStack';

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  const userInfo = useAtomValue(userInfoAtom);
  console.log('userInfo', userInfo);
  const isLogin = userInfo?.isLogin;
  const userType = userInfo?.userType;

  return (
    <SafeAreaProvider>
      {/* <JotaiProvider> */}
      <QueryClientProvider client={queryClient}>
        <StatusBar barStyle="dark-content" />
        <NavigationContainer>
          <RootStack isLogin={isLogin} userType={userType} />
        </NavigationContainer>
      </QueryClientProvider>
      {/* </JotaiProvider> */}
    </SafeAreaProvider>
  );
}

export default App;
