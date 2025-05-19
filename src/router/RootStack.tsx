import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CommonStack from './CommonStack';
import {UserType} from '../state/local_state/signupAtom';
import ManagerStack from './ManagerStack';
import FuneralStack from './FuneralStack';

interface IRootStackProps {
  isLogin: boolean;
  userType: UserType;
}

const Stack = createNativeStackNavigator();

const RootStack = ({isLogin, userType}: IRootStackProps) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isLogin === false ? (
        <Stack.Screen name="Common" component={CommonStack} />
      ) : userType === 'manager' ? (
        <Stack.Screen name="Manager" component={ManagerStack} />
      ) : (
        <Stack.Screen name="Funeral" component={FuneralStack} />
      )}
    </Stack.Navigator>
  );
};

export default RootStack;
