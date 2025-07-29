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
import {useAtom} from 'jotai';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import PhoneAuthSheet from '../../components/funeralHall/PhoneAuthSheet';
import {getUserInfo} from '../../utils/tokenStorage';
import {isStaffAtom} from '../../state/local_state/loginAtom';
import {isSmallDevice, scaleFontSize, scaleSize} from '../../utils/responsive';

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
  }, [setIsStaff]);

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
    // 앱 설정 페이지의 경우에는 누구나 권한 상관없이 접근 가능하도록 수정
    // 단, 장례식장 직원의 경우에는 회원탈퇴 기능이 제한되도록 설정
    // if (!hasPermission('appSettings')) {
    //   Toast.show({
    //     type: 'error',
    //     text1: '접근 권한 없음',
    //     text2: '앱 설정에 대한 접근 권한이 없습니다.',
    //     position: 'top',
    //     visibilityTime: 3000,
    //   });
    //   return;
    // }
    console.log('App Setting');
    navigation.navigate('AppSetting', {userType: isStaff ? 'staff' : 'funeral'});
  };

  const goToPointHistory = () => {
    navigation.navigate('PointHistory', {variant: 'funeral'});
  };

  // const logout = async () => {
  //   try {
  //     const userInfo = await getUserInfo();
  //     const deviceId = await DeviceInfo.getUniqueId();
  //     const response = await api.post('/funeral/auth/logout', {
  //       userId: userInfo?.userId,
  //       userType: userInfo?.userType,
  //       deviceId: deviceId,
  //     });
  //     if (response.status === 200) {
  //       // 로그아웃 로직
  //       await clearTokens();
  //       setLogin({
  //         userType: null,
  //         isLogin: false,
  //         userName: '',
  //         accessToken: '',
  //         refreshToken: '',
  //       });
  //       console.log('Logout');
  //     }
  //   } catch (error) {
  //     console.error('로그아웃 실패:', error);
  //   }

  //   // navigation.navigate('ManagerMain');
  // };

  // 반응형 아이콘 크기
  const iconSize = scaleSize(24);

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
            <ModifyInfoIcon width={iconSize} height={iconSize} />
            <Typo style={styles.topButtonText}>회원정보 수정</Typo>
          </View>
          <MoveWhiteIcon width={iconSize} height={iconSize} />
        </CustomButton>

        <ScrollView
          style={styles.whiteSection}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {hasPermission('roomManagement') && (
            <CustomButton onPress={goToManageRomms} style={styles.button}>
              <View style={styles.buttonNameContainer}>
                <ManageRoomIcon width={iconSize} height={iconSize} />
                <Typo style={styles.buttonText}>호실 관리</Typo>
              </View>
              <MoveGrayIcon width={iconSize} height={iconSize} />
            </CustomButton>
          )}
          {!isStaff && (
            <CustomButton onPress={goToManageMembers} style={styles.button}>
              <View style={styles.buttonNameContainer}>
                <ManageMemeberIcon width={iconSize} height={iconSize} />
                <Typo style={styles.buttonText}>직원 관리</Typo>
              </View>
              <MoveGrayIcon width={iconSize} height={iconSize} />
            </CustomButton>
          )}
          {hasPermission('dispatchHistory') && (
            <CustomButton onPress={goToDispatchHistory} style={styles.button}>
              <View style={styles.buttonNameContainer}>
                <DispatchHistoryIcon width={iconSize} height={iconSize} />
                <Typo style={styles.buttonText}>거래 완료 내역</Typo>
              </View>
              <MoveGrayIcon width={iconSize} height={iconSize} />
            </CustomButton>
          )}
          {hasPermission('dispatchPending') && (
            <CustomButton onPress={goToDispatchRequest} style={styles.button}>
              <View style={styles.buttonNameContainer}>
                <DispatchRequestIcon width={iconSize} height={iconSize} />
                <Typo style={styles.buttonText}>거래 대기 내역</Typo>
              </View>
              <MoveGrayIcon width={iconSize} height={iconSize} />
            </CustomButton>
          )}
          {hasPermission('estimateHistory') && (
            <CustomButton onPress={goToQuoteList} style={styles.button}>
              <View style={styles.buttonNameContainer}>
                <QuoteListIcon width={iconSize} height={iconSize} />
                <Typo style={styles.buttonText}>견적 내역</Typo>
              </View>
              <MoveGrayIcon width={iconSize} height={iconSize} />
            </CustomButton>
          )}
            <CustomButton onPress={goToAppSetting} style={styles.button}>
              <View style={styles.buttonNameContainer}>
                <AppSettingIcon width={iconSize} height={iconSize} />
                <Typo style={styles.buttonText}>앱 설정</Typo>
              </View>
              <MoveGrayIcon width={iconSize} height={iconSize} />
            </CustomButton>
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
    borderBottomLeftRadius: scaleSize(28),
    borderBottomRightRadius: scaleSize(28),
    paddingTop: Platform.OS === 'ios'
    ? (isSmallDevice ? scaleSize(80) : scaleSize(60))
    : (isSmallDevice ? scaleSize(80) : scaleSize(40)),
    paddingBottom: scaleSize(40),
    paddingHorizontal: scaleSize(20),
    zIndex: 2,
  },
  floatingButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? scaleSize(420) : scaleSize(400),
    left: scaleSize(20),
    right: scaleSize(20),
    zIndex: 5,
    backgroundColor: '#58A1FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(30),
    paddingVertical: scaleSize(20),
    borderRadius: scaleSize(15),
  },
  container: {
    flex: 1,
    backgroundColor: '#3287F8',
  },
  blueBackground: {
    paddingHorizontal: scaleSize(20),
    paddingTop: scaleSize(40),
    paddingBottom: scaleSize(30),
  },
  whiteSection: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    marginTop: Platform.OS === 'ios' ? scaleSize(480) : scaleSize(450),
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: scaleSize(20),
    paddingTop: scaleSize(20),
    paddingBottom: scaleSize(40),
    gap: scaleSize(5),
  },
  topButton: {
    backgroundColor: '#58A1FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(30),
    paddingVertical: scaleSize(20),
    borderRadius: scaleSize(15),
  },
  topButtonText: {
    fontSize: scaleFontSize(18),
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: scaleFontSize(20),
  },
  button: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(30),
    paddingVertical: scaleSize(20),
    borderRadius: scaleSize(15),
  },
  buttonNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleSize(13),
  },
  buttonText: {
    fontSize: scaleFontSize(18),
    fontWeight: '600',
    color: '#000',
    lineHeight: scaleFontSize(20),
  },
});
