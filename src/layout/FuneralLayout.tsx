import {StyleSheet, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import FuneralHeader from '../components/common/FuneralHeader';
// import {Header} from 'react-native/Libraries/NewAppScreen';

/**
 * FuneralLayout Props 인터페이스
 * @param children - 레이아웃 내부에 렌더링될 자식 컴포넌트들
 * @param headerShown - 헤더 표시 여부 (boolean, optional, default: false)
 * @param headerTitle - 헤더에 표시될 제목 (string, optional, default: '')
 * @param homeButton - 홈 버튼 표시 여부 (boolean, optional, default: false)
 * @param logoutButton - 로그아웃 버튼 표시 여부 (boolean, optional, default: false)
 * @param homeRouteName - 홈 버튼 클릭 시 이동할 라우트명 (string, optional)
 * @param onLogoutPress - 로그아웃 버튼 클릭 시 실행될 콜백 함수 (optional)
 * @param color - 배경색 설정 (string, optional)
 * @param headerColor - 헤더 배경색 설정 (string, optional)
 * @param backButtonVisible - 뒤로가기 버튼 표시 여부 (boolean, optional, default: false)
 * @param top - 상단 안전영역 적용 여부 (boolean, optional, default: false)
 * @param closeButton - 닫기 버튼 표시 여부 (boolean, optional, default: false)
 */
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

/**
 * 장례식장 전용 레이아웃 컴포넌트
 *
 * 기능:
 * - FuneralHeader를 사용한 장례식장 전용 헤더
 * - 상단 안전영역 선택적 적용 (top 프롭스로 제어)
 * - 헤더 및 배경 색상 개별 설정 가능
 * - 하단 안전영역 자동 적용
 */
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
  // 디바이스의 안전영역 정보를 가져옴 (노치, 홈 인디케이터 등)
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
