import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
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
  backButtonVisible?: boolean;
  top?: boolean;
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
  backButtonVisible = false,
  top = false,
}: IFuneralLayoutProps) => {
  // top이 true일 때 SafeAreaView의 edges에 'top' 추가
  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={top ? ['top', 'left', 'right'] : []}>
      {headerShown && (
        <FuneralHeader
          title={headerTitle}
          backButtonVisible={backButtonVisible}
          homeButton={homeButton}
          logoutButton={logoutButton}
          homeRouteName={homeRouteName}
          onLogoutPress={onLogoutPress as () => void}
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
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});
