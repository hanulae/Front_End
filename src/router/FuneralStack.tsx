import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FuneralProfilePage from '../page/funeralHall/FuneralProfilePage';
import FuneralModiftyPage from '../page/funeralHall/FuneralModifyPage';
import RoomManagementPage from '../page/funeralHall/RoomManagementPage';
import StaffManagementPage from '../page/funeralHall/StaffManagementPage';
import AddRoomPage from '../page/funeralHall/AddRoomPage';
import DispatchHistoryPage from '../page/funeralHall/DispatchHistoryPage';
import DispatchDetailPage from '../page/funeralHall/DispatchDetailPage';
import EstimateHistoryPage from '../page/funeralHall/EstimateHistoryPage';
import QuoteProposalPage from '../page/funeralHall/QuoteProposalPage';
import PendingDispatchPage from '../page/funeralHall/PendingDispatchPage';
import DispatchRequestDetailPage from '../page/funeralHall/DispatchRequestDetailPage';
import ConfirmTransactionPage from '../page/funeralHall/ConfirmTransactionPage';
import PointHistoryPage from '../page/common/PointHistoryPage';
import PointRefundPage from '../page/common/PointRefundPage';
import AppSettingPage from '../page/common/AppSettingPage';
import ModifyUserInfoPage from '../page/funeralHall/ModifyUserInfoPage';
import NotificationListPage from '../page/common/NotificationListPage';

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
      <Stack.Screen name="DispatchDetail" component={DispatchDetailPage} />
      <Stack.Screen name="EstimateHistory" component={EstimateHistoryPage} />
      <Stack.Screen name="QuoteProposal" component={QuoteProposalPage} />
      <Stack.Screen name="PendingDispatch" component={PendingDispatchPage} />
      <Stack.Screen
        name="DispatchRequestDetail"
        component={DispatchRequestDetailPage}
      />
      <Stack.Screen
        name="ConfirmTransaction"
        component={ConfirmTransactionPage}
      />
      <Stack.Screen name="PointHistory" component={PointHistoryPage} />
      <Stack.Screen name="PointRefund" component={PointRefundPage} />
      <Stack.Screen name="AppSetting" component={AppSettingPage} />
      <Stack.Screen name="ModifyUserInfo" component={ModifyUserInfoPage} />
      <Stack.Screen name="Notification" component={NotificationListPage} />
    </Stack.Navigator>
  );
};

export default FuneralStack;
