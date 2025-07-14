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

interface IManagerHeaderProps {
  title: string;
  homeButton?: boolean;
  logoutButton?: boolean;
  backIconColor?: string;
  homeRouteName?: string;
  onLogoutPress?: () => void;
  color?: string;
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
  // 읽지 않은 알림 여부 조회
  const [isUnread, setIsUnread] = useState(false);

  useFocusEffect(
    useCallback(() => {
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

  const goAlarmPage = () => {
    navigation.navigate('Notification', {variant: 'manager'});
  };

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
