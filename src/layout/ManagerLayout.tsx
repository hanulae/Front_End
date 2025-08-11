import React, {JSX} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../components/common/Header';
import ManagerHeader from '../components/common/ManagerHeader';
import {useNavigation, useRoute} from '@react-navigation/native';

/**
 * ManagerLayout Props 인터페이스
 * @param children - 레이아웃 내부에 렌더링될 자식 컴포넌트들
 * @param headerShown - 헤더 표시 여부 (boolean, optional, default: false)
 * @param headerTitle - 헤더에 표시될 제목 (string, optional, default: '')
 * @param homeButton - 홈 버튼 표시 여부 (boolean, optional, default: false)
 * @param logoutButton - 로그아웃 버튼 표시 여부 (boolean, optional, default: false)
 * @param homeRouteName - 홈 버튼 클릭 시 이동할 라우트명 (string, optional)
 * @param onLogoutPress - 로그아웃 버튼 클릭 시 실행될 콜백 함수 (optional)
 * @param backIconColor - 뒤로가기 아이콘 색상 (string, optional)
 * @param color - 배경색 설정 (string, optional)
 * @param top - 상단 안전영역 적용 여부 (boolean, optional)
 */
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

/**
 * 상조팀장 전용 레이아웃 컴포넌트
 *
 * 기능:
 * - ManagerHeader를 사용한 상조팀장 전용 헤더
 * - 탭 스크린 감지 및 하단 안전영역 조건부 적용
 * - 뒤로가기 아이콘 색상 커스터마이징 가능
 * - 상단 안전영역 선택적 적용
 *
 * 관리하는 상태값들:
 * - insets: 디바이스 안전영역 정보
 * - route: 현재 라우트 정보 (탭 스크린 감지용)
 * - isTabScreen: FuneralSearch, Cart, MyPage 탭 스크린 여부 판단
 */
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
  // 디바이스의 안전영역 정보를 가져옴 (노치, 홈 인디케이터 등)
  const insets = useSafeAreaInsets();
  // const navigation = useNavigation();
  // 현재 라우트 정보를 가져옴 (탭 스크린 감지를 위해)
  const route = useRoute();

  // 탭 네비게이션이 있는 스크린인지 판단 (하단 안전영역 제어용)
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
