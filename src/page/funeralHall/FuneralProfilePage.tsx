import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  Pressable,
} from 'react-native';
import ProfileStat from '../../components/funeralHall/ProfileStat';
import {useCallback, useEffect, useState} from 'react';
import FuneralLayout from '../../layout/FuneralLayout';
import CustomButton from '../../components/common/CustomButton';
import MoveWhiteIcon from '../../assets/Button/Button_MoveTransparent.svg';
import MoveGrayIcon from '../../assets/Button/Button_MoveOff.svg';
import ManageRoomIcon from '../../assets/Button/Button_ManageRoomBlack.svg';
import ModifyInfoIcon from '../../assets/Button/Button_ModifyInfoOn.svg';
import ManageMemeberIcon from '../../assets/Button/Button_StaffOff.svg';
import DispatchHistoryIcon from '../../assets/Button/Button_DispatchRecordOff.svg';
import DispatchRequestIcon from '../../assets/Button/Button_QueueOff.svg';
import QuoteListIcon from '../../assets/Button/Button_QuoteRecordOff.svg';
import AppSettingIcon from '../../assets/Button/Button_AppSettingoff.svg';
import Typo from '../../components/common/Typo';
import FuneralHeader from '../../components/common/FuneralHeader';
import {useAtom, useSetAtom} from 'jotai';
import {userInfoAtom} from '../../state/local_state/userinfoAtom';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import PhoneAuthSheet from '../../components/funeralHall/PhoneAuthSheet';
import {clearTokens, getUserInfo} from '../../utils/tokenStorage';
import api from '../../api/config';
import DeviceInfo from 'react-native-device-info';
import {isStaffAtom} from '../../state/local_state/loginAtom';

// 권한 타입 정의
interface IPermissions {
  roomManagement: boolean;
  infoEdit: boolean;
  dispatchHistory: boolean;
  dispatchPending: boolean;
  estimateHistory: boolean;
  appSettings: boolean;
}

const FuneralProfilePage = () => {
  // StatusBar 설정
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#3287F8');
        StatusBar.setBarStyle('light-content');
      } else {
        StatusBar.setBarStyle('light-content');
      }
      return () => {
        // 화면 포커스 해제 시 필요하다면 초기화 작업
        // 예: StatusBar.setStyle('default')
      };
    }, []),
  );

  const [showPhoneAuthSheet, setShowPhoneAuthSheet] = useState(false);
  const [isStaff, setIsStaff] = useAtom(isStaffAtom);
  const [permissions, setPermissions] = useState<IPermissions | null>(null);
  const [funeralName, setFuneralName] = useState('');
  const setLogin = useSetAtom(userInfoAtom);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  // 사용자 정보 및 권한 로드
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        if (userInfo && userInfo.data) {
          setIsStaff(userInfo.data.isStaff || false);
          setPermissions(userInfo.data.permissions || null);
          setFuneralName(userInfo.data.funeralName || '');
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
      }
    };

    loadUserInfo();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#3287F8');
      StatusBar.setBarStyle('light-content');
    } else {
      // StatusBar.setTranslucent(false);
      StatusBar.setBarStyle('light-content');
    }
  }, []);

  // 권한 체크 함수
  const hasPermission = (permission: keyof IPermissions): boolean => {
    if (!isStaff) return true; // 대표는 모든 권한
    return permissions?.[permission] || false;
  };

  const goToModifyFuneralInfo = () => {
    // if (!hasPermission('infoEdit')) {
    //   Toast.show({
    //     type: 'error',
    //     text1: '접근 권한 없음',
    //     text2: '정보 수정에 대한 접근 권한이 없습니다.',
    //     position: 'top',
    //     visibilityTime: 3000,
    //   });
    //   return;
    // }
    // navigation.navigate('ModifyUserInfo');
    setShowPhoneAuthSheet(true);
  };

  const goToManageRomms = () => {
    if (!hasPermission('roomManagement')) {
      Toast.show({
        type: 'error',
        text1: '접근 권한 없음',
        text2: '호실 관리에 대한 접근 권한이 없습니다.',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }
    navigation.navigate('RoomManagement');
  };

  const goToManageMembers = () => {
    // 직원 관리는 대표만 접근 가능
    if (isStaff) {
      Toast.show({
        type: 'error',
        text1: '접근 권한 없음',
        text2: '직원 관리에 대한 접근 권한이 없습니다.',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }
    navigation.navigate('StaffManagement');
  };

  const goToDispatchHistory = () => {
    if (!hasPermission('dispatchHistory')) {
      Toast.show({
        type: 'error',
        text1: '접근 권한 없음',
        text2: '지난 출동 내역에 대한 접근 권한이 없습니다.',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }
    navigation.navigate('DispatchHistory');
  };

  const goToDispatchRequest = () => {
    if (!hasPermission('dispatchPending')) {
      Toast.show({
        type: 'error',
        text1: '접근 권한 없음',
        text2: '출동 대기 내역에 대한 접근 권한이 없습니다.',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }
    console.log('Dispatch Request');
    navigation.navigate('PendingDispatch');
  };

  const goToQuoteList = () => {
    if (!hasPermission('estimateHistory')) {
      Toast.show({
        type: 'error',
        text1: '접근 권한 없음',
        text2: '견적 내역에 대한 접근 권한이 없습니다.',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }
    console.log('Quote List');
    navigation.navigate('EstimateHistory');
  };

  const goToAppSetting = () => {
    if (!hasPermission('appSettings')) {
      Toast.show({
        type: 'error',
        text1: '접근 권한 없음',
        text2: '앱 설정에 대한 접근 권한이 없습니다.',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }
    console.log('App Setting');
    navigation.navigate('AppSetting', {userType: 'funeral'});
  };

  const goToPointHistory = () => {
    navigation.navigate('PointHistory', {variant: 'funeral'});
  };

  const logout = async () => {
    try {
      const userInfo = await getUserInfo();
      const deviceId = await DeviceInfo.getUniqueId();
      const response = await api.post('/funeral/auth/logout', {
        userId: userInfo?.userId,
        userType: userInfo?.userType,
        deviceId: deviceId,
      });
      if (response.status === 200) {
        // 로그아웃 로직
        await clearTokens();
        setLogin({
          userType: null,
          isLogin: false,
          userName: '',
          accessToken: '',
          refreshToken: '',
        });
        console.log('Logout');
      }
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }

    // navigation.navigate('ManagerMain');
  };

  return (
    <>
      <FuneralLayout headerShown={false}>
        <View style={styles.topSection}>
          <FuneralHeader
            backButtonVisible={false}
            // logoutButton={true}
            // onLogoutPress={logout}
            alarmButton={true}
          />
          <View style={styles.container}>
            <Pressable onPress={goToPointHistory}>
              <ProfileStat point={100000} cash={50000} hallName={funeralName} />
            </Pressable>
          </View>
        </View>

        <CustomButton
          onPress={goToModifyFuneralInfo}
          style={styles.floatingButton}>
          <View style={styles.buttonNameContainer}>
            <ModifyInfoIcon width={24} height={24} />
            <Typo style={styles.topButtonText}>회원정보 수정</Typo>
          </View>
          <MoveWhiteIcon width={24} height={24} />
        </CustomButton>

        <ScrollView
          style={styles.whiteSection}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {hasPermission('roomManagement') && (
            <CustomButton onPress={goToManageRomms} style={styles.button}>
              <View style={styles.buttonNameContainer}>
                <ManageRoomIcon width={24} height={24} />
                <Typo style={styles.buttonText}>호실 관리</Typo>
              </View>
              <MoveGrayIcon width={24} height={24} />
            </CustomButton>
          )}
          {!isStaff && (
            <CustomButton onPress={goToManageMembers} style={styles.button}>
              <View style={styles.buttonNameContainer}>
                <ManageMemeberIcon width={24} height={24} />
                <Typo style={styles.buttonText}>직원 관리</Typo>
              </View>
              <MoveGrayIcon width={24} height={24} />
            </CustomButton>
          )}
          {hasPermission('dispatchHistory') && (
            <CustomButton onPress={goToDispatchHistory} style={styles.button}>
              <View style={styles.buttonNameContainer}>
                <DispatchHistoryIcon width={24} height={24} />
                <Typo style={styles.buttonText}>거래 완료 내역</Typo>
              </View>
              <MoveGrayIcon width={24} height={24} />
            </CustomButton>
          )}
          {hasPermission('dispatchPending') && (
            <CustomButton onPress={goToDispatchRequest} style={styles.button}>
              <View style={styles.buttonNameContainer}>
                <DispatchRequestIcon width={24} height={24} />
                <Typo style={styles.buttonText}>거래 대기 내역</Typo>
              </View>
              <MoveGrayIcon width={24} height={24} />
            </CustomButton>
          )}
          {hasPermission('estimateHistory') && (
            <CustomButton onPress={goToQuoteList} style={styles.button}>
              <View style={styles.buttonNameContainer}>
                <QuoteListIcon width={24} height={24} />
                <Typo style={styles.buttonText}>견적 내역</Typo>
              </View>
              <MoveGrayIcon width={24} height={24} />
            </CustomButton>
          )}
          {hasPermission('appSettings') && (
            <CustomButton onPress={goToAppSetting} style={styles.button}>
              <View style={styles.buttonNameContainer}>
                <AppSettingIcon width={24} height={24} />
                <Typo style={styles.buttonText}>앱 설정</Typo>
              </View>
              <MoveGrayIcon width={24} height={24} />
            </CustomButton>
          )}
        </ScrollView>
        <PhoneAuthSheet
          visible={showPhoneAuthSheet}
          onClose={() => setShowPhoneAuthSheet(false)}
          navigation={navigation}
        />
      </FuneralLayout>
      <Toast />
    </>
  );
};

export default FuneralProfilePage;

const styles = StyleSheet.create({
  topSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#3287F8',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  floatingButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 420 : 360, // ProfileStat 아래 적당한 위치로 조정
    left: 20,
    right: 20,
    zIndex: 5,
    backgroundColor: '#58A1FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 15,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 6,
    // shadowOffset: {width: 0, height: 4},
  },
  container: {
    flex: 1,
    backgroundColor: '#3287F8',
  },
  blueBackground: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  whiteSection: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    marginTop: 410, // ProfileStat 높이 만큼 여백 확보
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 5,
  },
  topButton: {
    backgroundColor: '#58A1FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 15,
  },
  topButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    // color: '#000',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 15,
  },
  buttonNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    lineHeight: 20,
  },
});
