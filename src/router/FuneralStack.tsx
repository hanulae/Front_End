import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FuneralProfilePage from '../page/funeralHall/FuneralProfilePage';

const Stack = createNativeStackNavigator();

const FuneralStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="FuneralMain"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="FuneralMain" component={FuneralProfilePage} />
    </Stack.Navigator>
  );
};

export default FuneralStack;
