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

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const isLogin = false; // Replace with your actual login state
  const queryClient = new QueryClient();
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar barStyle="dark-content" />
        <NavigationContainer>
          {isLogin === false && <CommonStack />}
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;

<NavigationContainer>
  <Stack.Navigator initialRouteName="Main">
    <Stack.Screen name="Main" component={MainPage} />
  </Stack.Navigator>
</NavigationContainer>;
