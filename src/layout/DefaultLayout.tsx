import React, {JSX} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/common/Header';

interface IDefaultLayoutProps {
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

const DefaultLayout = ({
  children,
  headerShown = false,
  headerTitle = '',
  homeButton = false,
  logoutButton = false,
  homeRouteName,
  onLogoutPress,
  color,
  top,
}: IDefaultLayoutProps): JSX.Element => {
  return (
    <SafeAreaView
      style={[styles.safeArea, {backgroundColor: color}]}
      edges={[
        ...(top === false ? [] : ['top' as const]),
        'left' as const,
        'right' as const,
      ]}>
      {headerShown && (
        <Header
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

export default DefaultLayout;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    // borderWidth: 1,
  },
});
