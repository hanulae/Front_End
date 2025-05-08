import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/common/Header';
import FuneralHeader from '../components/common/FuneralHeader';
// import {Header} from 'react-native/Libraries/NewAppScreen';

interface IFuneralLayoutProps {
  children: React.ReactNode;
  headerShown?: boolean;
  headerTitle?: string;
  homeButton?: boolean;
  logoutButton?: boolean;
  homeRouteName?: string;
  onLogoutPress?: () => void;
  color?: string;
}

const FuneralLayout = ({
  children,
  headerShown = false,
  headerTitle = '',
  homeButton = false,
  logoutButton = false,
  homeRouteName,
  onLogoutPress,
  color,
}: IFuneralLayoutProps) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      {headerShown && (
        <FuneralHeader
          title={headerTitle}
          homeButton={homeButton}
          logoutButton={logoutButton}
          homeRouteName={homeRouteName}
          onLogoutPress={onLogoutPress}
          color={color}
        />
      )}
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
};

export default FuneralLayout;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    borderWidth: 1,
  },
});
