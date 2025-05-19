import React, {JSX} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/common/Header';
import ManagerHeader from '../components/common/ManagerHeader';

interface IManagerLayoutProps {
  children: React.ReactNode;
  headerShown?: boolean;
  headerTitle?: string;
  homeButton?: boolean;
  logoutButton?: boolean;
  homeRouteName?: string;
  onLogoutPress?: () => void;
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
  top,
}: IManagerLayoutProps): JSX.Element => {
  return (
    <SafeAreaView
      style={[styles.safeArea, {backgroundColor: color}]}
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
