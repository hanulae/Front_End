import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FuneralProfilePage from '../page/funeralHall/FuneralProfilePage';
import FuneralModiftyPage from '../page/funeralHall/FuneralModifyPage';

const Stack = createNativeStackNavigator();

const FuneralStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="FuneralMain"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="FuneralMain" component={FuneralProfilePage} />
      <Stack.Screen name="FuneralModify" component={FuneralModiftyPage} />
    </Stack.Navigator>
  );
};

export default FuneralStack;
