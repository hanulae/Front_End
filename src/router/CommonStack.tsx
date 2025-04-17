import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainPage from '../page/common/MainPage';
import LoginPage from '../page/auth/LoginPage';

const Stack = createNativeStackNavigator();

const CommonStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={MainPage} />
      <Stack.Screen name="Login" component={LoginPage} />
    </Stack.Navigator>
  );
};

export default CommonStack;
