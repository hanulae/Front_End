import React, {JSX} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../components/common/Header';
import ManagerHeader from '../components/common/ManagerHeader';
import {useNavigation, useRoute} from '@react-navigation/native';

interface IManagerLayoutProps {
  children: React.ReactNode;
  headerShown?: boolean;
  headerTitle?: string;
  homeButton?: boolean;
  logoutButton?: boolean;
  homeRouteName?: string;
  onLogoutPress?: () => void;
  backIconColor?: string;
  color?: string;
  top?: boolean;
}

const ManagerLayout = ({
  children,
  headerShown = false,
  headerTitle = '',
  homeButton = false,
  logoutButton = false,
  homeRouteName,
  onLogoutPress,
  color,
  backIconColor,
  top,
}: IManagerLayoutProps): JSX.Element => {
  const insets = useSafeAreaInsets();
  // const navigation = useNavigation();
  const route = useRoute();

  const isTabScreen =
    route.name === 'FuneralSearch' ||
    route.name === 'Cart' ||
    route.name === 'MyPage';
  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: color,
          paddingBottom: isTabScreen ? 0 : insets.bottom,
        },
      ]}
      edges={[
        ...(top === false ? [] : ['top' as const]),
        'left' as const,
        'right' as const,
      ]}>
      {headerShown && (
        <ManagerHeader
          title={headerTitle}
          homeButton={homeButton}
          logoutButton={logoutButton}
          homeRouteName={homeRouteName}
          onLogoutPress={onLogoutPress}
          backIconColor={backIconColor}
        />
      )}
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
};

export default ManagerLayout;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});
