import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import React, {JSX} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomButton from './CustomButton';
import Typo from './Typo';
import BackIcon from '../../assets/Header/Header_Back.svg';
import HomeIcon from '../../assets/Header/Header_Home.svg';
import CloseIcon from '../../assets/Icon/Icon_BtnClose01.svg';

/**
 * Header Props 인터페이스
 * @param title - 헤더 제목 (필수)
 * @param homeButton - 홈 버튼 표시 여부
 * @param logoutButton - 로그아웃 버튼 표시 여부
 * @param homeRouteName - 홈 이동 시 사용할 라우트 이름
 * @param onLogoutPress - 로그아웃 버튼 클릭 콜백
 * @param backButton - 뒤로가기 버튼 표시 여부 (기본값: true)
 * @param color - 헤더 배경색
 * @param close - 닫기 버튼 표시 여부
 */
interface IHeaderProps {
  title: string;
  homeButton?: boolean;
  logoutButton?: boolean;
  homeRouteName?: string;
  onLogoutPress?: () => void;
  backButton?: boolean;
  color?: string;
  close?: boolean;
}

/**
 * 일반 공통 헤더
 *
 * 주요 기능:
 * - 뒤로가기/홈/로그아웃/닫기 버튼 옵션 제공
 * - 홈 이동 시 네비게이션 스택 초기화
 * - 간단한 레이아웃과 기본 흰색 배경
 */
const Header = ({
  title,
  color,
  backButton = true,
  homeButton = false,
  logoutButton = false,
  homeRouteName,
  onLogoutPress,
  close = false,
}: IHeaderProps): JSX.Element => {
  const navigation = useNavigation<NavigationProp<any>>();
  const goBack = navigation.goBack;

  /**
   * 홈으로 이동
   * - `homeRouteName`이 있으면 해당 스택으로 초기화
   * - 없으면 'Main'으로 초기화
   */
  const goHome = () => {
    if (homeRouteName) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: homeRouteName}],
        }),
      );
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Main'}],
        }),
      );
    }
  };

  return (
    <View style={[styles.header, {backgroundColor: color}]}>
      {/* 뒤로가기 버튼 (기본 표시) */}
      {backButton && (
        <CustomButton onPress={goBack}>
          <BackIcon width={24} height={24} />
        </CustomButton>
      )}

      {/* 제목 */}
      <Typo style={styles.title}>{title}</Typo>

      {/* 홈 버튼 */}
      {homeButton && (
        <CustomButton onPress={goHome}>
          <HomeIcon width={24} height={24} />
        </CustomButton>
      )}

      {/* 로그아웃 버튼 */}
      {logoutButton && (
        <CustomButton onPress={() => onLogoutPress}>
          <Typo>로그아웃</Typo>
        </CustomButton>
      )}

      {/* 닫기 버튼 */}
      {close && (
        <CustomButton onPress={goBack}>
          <CloseIcon width={24} height={24} />
        </CustomButton>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Pretendard-Bold',
  },
});
