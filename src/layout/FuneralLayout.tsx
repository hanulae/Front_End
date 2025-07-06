import {StyleSheet, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
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
  headerColor?: string;
  backButtonVisible?: boolean;
  top?: boolean;
  closeButton?: boolean;
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
  headerColor,
  backButtonVisible = false,
  top = false,
  closeButton = false,
}: IFuneralLayoutProps) => {
  // top이 true일 때 SafeAreaView의 edges에 'top' 추가
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {backgroundColor: color, paddingBottom: insets.bottom},
      ]}
      edges={top ? ['top', 'left', 'right'] : []}>
      {headerShown && (
        <FuneralHeader
          color={headerColor}
          title={headerTitle}
          backButtonVisible={backButtonVisible}
          homeButton={homeButton}
          logoutButton={logoutButton}
          homeRouteName={homeRouteName}
          onLogoutPress={onLogoutPress as () => void}
          closeButton={closeButton}
          // color={color}
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
