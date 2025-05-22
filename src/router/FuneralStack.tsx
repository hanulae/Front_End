import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FuneralProfilePage from '../page/funeralHall/FuneralProfilePage';
import FuneralModiftyPage from '../page/funeralHall/FuneralModifyPage';
import RoomManagementPage from '../page/funeralHall/RoomManagementPage';
import StaffManagementPage from '../page/funeralHall/StaffManagementPage';
import AddRoomPage from '../page/funeralHall/AddRoomPage';
import DispatchHistoryPage from '../page/funeralHall/DispatchHistoryPage';

const Stack = createNativeStackNavigator();

const FuneralStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="FuneralMain"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="FuneralMain" component={FuneralProfilePage} />
      <Stack.Screen name="FuneralModify" component={FuneralModiftyPage} />
      <Stack.Screen name="RoomManagement" component={RoomManagementPage} />
      <Stack.Screen name="StaffManagement" component={StaffManagementPage} />
      <Stack.Screen name="AddRoom" component={AddRoomPage} />
      <Stack.Screen name="DispatchHistory" component={DispatchHistoryPage} />
    </Stack.Navigator>
  );
};

export default FuneralStack;
