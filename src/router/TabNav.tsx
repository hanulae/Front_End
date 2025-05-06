import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet} from 'react-native';
import FuneralSearchPage from '../page/common/FuneralSearchPage';
import HomeIconOn from '../assets/TabBar/Tabbar_HomeBlue.svg';
import HomeIconOff from '../assets/TabBar/Tabbar_HomeBlack.svg';
import CartIconOn from '../assets/TabBar/Tabbar_BasketBlue.svg';
import CartIconOff from '../assets/TabBar/Tabbar_BasketBlack.svg';
import MyIconOn from '../assets/TabBar/Tabbar_MyBlue.svg';
import MyIconOff from '../assets/TabBar/Tabbar_MyBlack.svg';
import CartPage from '../page/teamManager/CartPage';
import ManagerProfilePage from '../page/teamManager/ManagerProfilePage';
const Tab = createBottomTabNavigator();

const TabNav = () => {
  return (
    <Tab.Navigator
      initialRouteName="FindFuneral"
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="FindFuneral"
        component={FuneralSearchPage}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({focused, size}) =>
            focused ? (
              <HomeIconOn width={size} height={size} />
            ) : (
              <HomeIconOff width={size} height={size} />
            ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartPage}
        options={{
          tabBarLabel: '장바구니',
          tabBarIcon: ({focused, size}) =>
            focused ? (
              <CartIconOn width={size} height={size} />
            ) : (
              <CartIconOff width={size} height={size} />
            ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={ManagerProfilePage}
        options={{
          tabBarLabel: '마이',
          tabBarIcon: ({focused, size}) =>
            focused ? (
              <MyIconOn width={size} height={size} />
            ) : (
              <MyIconOff width={size} height={size} />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNav;

const styles = StyleSheet.create({});
