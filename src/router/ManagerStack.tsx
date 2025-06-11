import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet} from 'react-native';
import ManagerMainPage from '../page/teamManager/MainPage';
import FuneralSearchPage from '../page/common/FuneralSearchPage';
import TabNav from './TabNav';
import EstimateFormPage from '../page/teamManager/EstimateFormPage';
import ModifyUserInfoPage from '../page/teamManager/ModifyUserInfoPage';
import EstimateListPage from '../page/teamManager/EstimateListPage';
import ClientEstimatePage from '../page/teamManager/ClientEstimatePage';
import EstimateDetailPage from '../page/teamManager/EstimateDetailPage';
import CallFormPage from '../page/teamManager/CallFormPage';
import ProceedCallPage from '../page/teamManager/ProceedCallPage';
import CallHistoryPage from '../page/teamManager/CallHistoryPage';
import PointHistoryPage from '../page/common/PointHistoryPage';
import PointRefundPage from '../page/common/PointRefundPage';
import ClientDetailPage from '../page/teamManager/ClientDetailPage';
import AppSettingPage from '../page/common/AppSettingPage';
import FuneralDetailPage from '../page/teamManager/FuneralDetailPage';

const Stack = createNativeStackNavigator();

const ManagerStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ManagerMain"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="ManagerMain" component={ManagerMainPage} />
      <Stack.Screen name="FindFuneral" component={TabNav} />
      <Stack.Screen name="EstimateForm" component={EstimateFormPage} />
      <Stack.Screen name="ModifyUserInfo" component={ModifyUserInfoPage} />
      <Stack.Screen name="EstimateList" component={EstimateListPage} />
      <Stack.Screen name="ClientEstimate" component={ClientEstimatePage} />
      <Stack.Screen name="ClientDetail" component={ClientDetailPage} />
      <Stack.Screen name="EstimateDetail" component={EstimateDetailPage} />
      <Stack.Screen name="CallForm" component={CallFormPage} />
      <Stack.Screen name="ProceedCall" component={ProceedCallPage} />
      <Stack.Screen name="CallHistory" component={CallHistoryPage} />
      <Stack.Screen name="PointHistory" component={PointHistoryPage} />
      <Stack.Screen name="PointRefund" component={PointRefundPage} />
      <Stack.Screen name="AppSetting" component={AppSettingPage} />
      <Stack.Screen name="FuneralDetail" component={FuneralDetailPage} />
    </Stack.Navigator>
  );
};

export default ManagerStack;
