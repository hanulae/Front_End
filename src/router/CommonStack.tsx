import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainPage from '../page/common/MainPage';
import LoginPage from '../page/auth/LoginPage';
import FindEmailPage from '../page/auth/FindEmailPage';
import FindPWpage from '../page/auth/FindPWPage';
import SignupPage from '../page/auth/SignupPage';
import FuneralSearchPage from '../page/common/FuneralSearchPage';

const Stack = createNativeStackNavigator();

const CommonStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={MainPage} />
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Signup" component={SignupPage} />
      <Stack.Screen name="FindEmail" component={FindEmailPage} />
      <Stack.Screen name="FindPW" component={FindPWpage} />
      <Stack.Screen name="FindFuneral" component={FuneralSearchPage} />
    </Stack.Navigator>
  );
};

export default CommonStack;
