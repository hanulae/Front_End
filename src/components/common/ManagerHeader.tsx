import {
  CommonActions,
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import React, {JSX, useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomButton from './CustomButton';
import Typo from './Typo';
// import BackIcon from '../../assets/Header/Header_Back.svg';
import HomeIcon from '../../assets/Header/Header_Home.svg';
import LogoutButtonWhite from '../../assets/Header/Header_DoorWhite.svg';
import {BackIcon} from '../svg/BackIcon';
import AlarmIcon from '../../assets/Header/Header_Alarm.svg';
import AlarmUnreadIcon from '../../assets/Header/Header_AlarmNew.svg';
import {useAtom, useAtomValue} from 'jotai';
import {loginAtom} from '../../state/local_state/loginAtom';
import {userInfoAtom} from '../../state/local_state/userinfoAtom';
import {notificationApiService} from '../../services/api/notificationService';

/**
 * 매니저 헤더 컴포넌트
 *
 * 목적:
 * - 화면 상단 공용 헤더로 뒤로가기/홈/로그아웃/알림 버튼 제공
 * - 알림 버튼 활성화 시 읽지 않은 알림 상태 반영
 *
 * 관리하는 상태값들:
 * - isUnread: 읽지 않은 알림 존재 여부
 *
 * 네비게이션:
 * - 뒤로가기: navigation.goBack
 * - 홈 이동: 로그인/유형에 따라 적절한 홈 스택으로 reset
 * - 알림 페이지: 'Notification'로 이동
 */
interface IManagerHeaderProps {
  /** 헤더 중앙 타이틀 */
  title: string;
  /** 홈 버튼 표시 여부 */
  homeButton?: boolean;
  /** 로그아웃 버튼 표시 여부 */
  logoutButton?: boolean;
  /** 뒤로가기 아이콘 색상 */
  backIconColor?: string;
  /** 홈 버튼 클릭 시 이동할 명시적 라우트 이름 (있으면 우선) */
  homeRouteName?: string;
  /** 로그아웃 버튼 클릭 콜백 */
  onLogoutPress?: () => void;
  /** 배경색 */
  color?: string;
  /** 알림 버튼 표시 여부 */
  alarmButton?: boolean;
}

const ManagerHeader = ({
  title,
  color,
  backIconColor = 'black',
  homeButton = false,
  logoutButton = false,
  homeRouteName,
  alarmButton = false,
  onLogoutPress,
}: IManagerHeaderProps): JSX.Element => {
  const navigation = useNavigation<NavigationProp<any>>();
  const userInfo = useAtomValue(userInfoAtom);
  const goBack = navigation.goBack;

  /** 읽지 않은 알림 여부 */
  const [isUnread, setIsUnread] = useState(false);

  /**
   * 포커스 시 읽지 않은 알림 여부 조회
   * - alarmButton 이 true 일 때만 호출
   */
  useFocusEffect(
    useCallback(() => {
      if (alarmButton === false) {
        return;
      }
      const fetchUnreadNotificationCount = async () => {
        try {
          const response =
            await notificationApiService.getUnreadNotificationCount();
          /**
           * API 응답 예시:
           * { isUnread: boolean }
           */
          setIsUnread(response.isUnread);
        } catch {
          setIsUnread(false);
        }
      };
      fetchUnreadNotificationCount();
    }, []),
  );

  /** 알림 페이지로 이동 */
  const goAlarmPage = () => {
    navigation.navigate('Notification', {variant: 'manager'});
  };

  /**
   * 홈으로 이동
   * - homeRouteName 이 있으면 해당 라우트로 reset
   * - 없으면 로그인/유저타입에 따라 기본 홈으로 reset
   */
  const goHome = () => {
    // homeRouteName이 명시적으로 제공된 경우 우선 사용
    if (homeRouteName) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: homeRouteName}],
        }),
      );
      return;
    }

    // 로그인 상태에 따라 적절한 홈으로 이동
    if (!userInfo.isLogin) {
      // 로그인하지 않은 사용자는 메인 페이지로
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Main'}],
        }),
      );
    } else {
      // 로그인한 사용자는 사용자 타입에 따라 다른 홈으로
      const homeRoute =
        userInfo.userType === 'manager'
          ? 'ManagerMain'
          : userInfo.userType === 'funeral'
          ? 'FuneralMain'
          : 'Main';

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: homeRoute}],
        }),
      );
    }
  };
  return (
    <View style={[styles.header, {backgroundColor: color}]}>
      <CustomButton onPress={goBack}>
        <BackIcon color={backIconColor} fill={'none'} width={24} height={24} />
      </CustomButton>
      <Typo style={styles.title}>{title}</Typo>
      {homeButton && (
        <CustomButton onPress={goHome}>
          <HomeIcon width={24} height={24} />
        </CustomButton>
      )}
      {logoutButton && (
        <CustomButton onPress={onLogoutPress || (() => {})}>
          <LogoutButtonWhite width={24} height={24} />
        </CustomButton>
      )}
      {alarmButton && (
        <CustomButton onPress={goAlarmPage}>
          {isUnread ? (
            <AlarmUnreadIcon width={24} height={24} />
          ) : (
            <AlarmIcon width={24} height={24} />
          )}
        </CustomButton>
      )}
    </View>
  );
};

export default ManagerHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Pretendard-Bold',
  },
});
