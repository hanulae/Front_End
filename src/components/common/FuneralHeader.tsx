import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import React, {JSX, useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomButton from './CustomButton';
import Typo from './Typo';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LogoutButtonBlack from '../../assets/Header/Header_DoorBlack.svg';
import LogoutButtonWhite from '../../assets/Header/Header_DoorWhite.svg';
import BackIcon from '../../assets/Header/Header_Back.svg';
import HomeIcon from '../../assets/Header/Header_Home.svg';
import CloseIcon from '../../assets/Icon/Icon_BtnClose01.svg';
import AlarmIcon from '../../assets/Header/Header_Alarm.svg';
import AlarmUnreadIcon from '../../assets/Header/Header_AlarmNew.svg';
import {notificationApiService} from '../../services/api/notificationService';

/**
 * FuneralHeader Props 인터페이스
 * @param title - 헤더 제목
 * @param homeButton - 홈 버튼 표시 여부
 * @param logoutButton - 로그아웃 버튼 표시 여부
 * @param homeRouteName - 홈으로 이동 시 사용할 라우트 이름
 * @param onLogoutPress - 로그아웃 버튼 클릭 콜백
 * @param color - 헤더 배경색
 * @param backButtonVisible - 뒤로가기 버튼 표시 여부
 * @param logoutColor - 로그아웃 아이콘(검정/흰색) 선택 기준 (truthy면 검정)
 * @param closeButton - 닫기 버튼 표시 여부
 * @param alarmButton - 알림 버튼 표시 여부 (읽지 않은 알림 배지 포함)
 */
interface IFuneralHeaderProps {
  title?: string;
  homeButton?: boolean;
  logoutButton?: boolean;
  homeRouteName?: string;
  onLogoutPress?: () => void;
  color?: string;
  backButtonVisible?: boolean;
  logoutColor?: string;
  closeButton?: boolean;
  alarmButton?: boolean;
}

/**
 * 장례식장 전용 공통 헤더
 *
 * 주요 기능:
 * - 뒤로가기/홈/로그아웃/닫기/알림 버튼 구성
 * - 알림 버튼 표시 시 읽지 않은 알림 여부를 진입 시점마다 조회
 * - 홈 이동 시 네비게이션 스택 초기화
 */
const FuneralHeader = ({
  title,
  color,
  logoutColor,
  homeButton = false,
  logoutButton = false,
  homeRouteName,
  onLogoutPress,
  backButtonVisible = false,
  closeButton = false,
  alarmButton = false,
}: IFuneralHeaderProps): JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
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

  // 읽지 않은 알림 여부 조회 상태
  const [isUnread, setIsUnread] = useState(false);

  /**
   * 화면 포커스 시 읽지 않은 알림 여부 조회
   * - `alarmButton`이 true일 때만 호출
   * - 실패 시 기본값 false
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
          setIsUnread(response.isUnread);
        } catch {
          setIsUnread(false);
        }
      };
      fetchUnreadNotificationCount();
    }, []),
  );

  // 알림 페이지 이동
  const goAlarmPage = () => {
    navigation.navigate('Notification', {variant: 'funeral'});
  };

  return (
    <View style={[styles.header, {backgroundColor: color}]}>
      {backButtonVisible && (
        <CustomButton onPress={goBack}>
          <BackIcon width={24} height={24} />
        </CustomButton>
      )}

      <Typo style={styles.title}>{title}</Typo>

      {/* 우측 액션 영역 */}
      <View style={styles.leftContainer}>
        {homeButton && (
          <CustomButton onPress={goHome}>
            <HomeIcon width={24} height={24} />
          </CustomButton>
        )}

        {logoutButton && (
          <CustomButton onPress={onLogoutPress}>
            {logoutColor ? (
              <LogoutButtonBlack width={24} height={24} />
            ) : (
              <LogoutButtonWhite width={24} height={24} />
            )}
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

        {closeButton && (
          <CustomButton onPress={goBack}>
            <CloseIcon width={24} height={24} />
          </CustomButton>
        )}
      </View>
    </View>
  );
};

export default FuneralHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Pretendard-Bold',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});
