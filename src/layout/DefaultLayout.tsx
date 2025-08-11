import React, {JSX} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../components/common/Header';

/**
 * DefaultLayout Props 인터페이스
 * @param children - 레이아웃 내부에 렌더링될 자식 컴포넌트들
 * @param headerShown - 헤더 표시 여부 (boolean, optional, default: false)
 * @param headerTitle - 헤더에 표시될 제목 (string, optional, default: '')
 * @param homeButton - 홈 버튼 표시 여부 (boolean, optional, default: false)
 * @param logoutButton - 로그아웃 버튼 표시 여부 (boolean, optional, default: false)
 * @param homeRouteName - 홈 버튼 클릭 시 이동할 라우트명 (string, optional)
 * @param onLogoutPress - 로그아웃 버튼 클릭 시 실행될 콜백 함수 (optional)
 * @param backButton - 뒤로가기 버튼 표시 여부 (boolean, optional, default: true)
 * @param close - 닫기 버튼 표시 여부 (boolean, optional, default: false)
 * @param color - 배경색 설정 (string, optional)
 * @param top - 상단 안전영역 적용 여부 (boolean, optional)
 */
interface IDefaultLayoutProps {
  children: React.ReactNode;
  headerShown?: boolean;
  headerTitle?: string;
  homeButton?: boolean;
  logoutButton?: boolean;
  homeRouteName?: string;
  onLogoutPress?: () => void;
  backButton?: boolean;
  close?: boolean;
  color?: string;
  top?: boolean;
}

/**
 * 기본 페이지 레이아웃 컴포넌트
 *
 * 기능:
 * - SafeAreaView를 통한 안전영역 처리
 * - 선택적 헤더 표시 (Header 컴포넌트 사용)
 * - 배경색 및 상단 안전영역 제어
 * - 하단 안전영역 자동 적용
 */
const DefaultLayout = ({
  children,
  headerShown = false,
  headerTitle = '',
  homeButton = false,
  logoutButton = false,
  backButton = true,
  close = false,
  homeRouteName,
  onLogoutPress,
  color,
  top,
}: IDefaultLayoutProps): JSX.Element => {
  // 디바이스의 안전영역 정보를 가져옴 (노치, 홈 인디케이터 등)
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {backgroundColor: color, paddingBottom: insets.bottom},
      ]}
      edges={[
        ...(top === false ? [] : ['top' as const]),
        'left' as const,
        'right' as const,
      ]}>
      {headerShown && (
        <Header
          backButton={backButton}
          close={close}
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
