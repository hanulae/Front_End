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
import {useSetAtom} from 'jotai';
import {userInfoAtom} from '../../state/local_state/userinfoAtom';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import PhoneAuthSheet from '../../components/funeralHall/PhoneAuthSheet';

// ===== 접근 권한 관련 타입 및 로직 (주석 처리) =====
/*
interface IUserPermissions {
  room_management: boolean; // 호실 관리
  info_edit: boolean; // 정보 수정
  dispatch_history: boolean; // 지난 출동 내역
  dispatch_pending: boolean; // 출동 대기 내역
  estimate_history: boolean; // 견적 내역
  app_settings: boolean; // 앱 설정
}

// 임시 사용자 권한 정보 (추후 전역 상태에서 가져올 예정)
const mockUserPermissions: IUserPermissions = {
  room_management: true,
  info_edit: true,
  dispatch_history: false, // 테스트용으로 false 설정
  dispatch_pending: true,
  estimate_history: false, // 테스트용으로 false 설정
  app_settings: true,
};

// 권한 체크 함수
const checkPermission = (permission: keyof IUserPermissions, actionName: string): boolean => {
  if (!mockUserPermissions[permission]) {
    Toast.show({
      type: 'error',
      text1: '접근 권한 없음',
      text2: `${actionName}에 대한 접근 권한이 없습니다.`,
      position: 'top',
      visibilityTime: 3000,
    });
    return false;
  }
  return true;
};
*/

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

  const setLogin = useSetAtom(userInfoAtom);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#3287F8');
      StatusBar.setBarStyle('light-content');
    } else {
      // StatusBar.setTranslucent(false);
      StatusBar.setBarStyle('light-content');
    }
  }, []);

  const goToModifyFuneralInfo = () => {
    // 권한 체크 (주석 처리)
    // if (!checkPermission('info_edit', '정보 수정')) return;

    // console.log('Modify Funeral Info');
    navigation.navigate('FuneralModify');
  };

  const goToManageRomms = () => {
    // 권한 체크 (주석 처리)
    // if (!checkPermission('room_management', '호실 관리')) return;

    // console.log('Manage Rooms');
    navigation.navigate('RoomManagement');
  };

  const goToManageMembers = () => {
    // 직원 관리는 항상 접근 가능 (관리자 기능)
    // console.log('Manage Members');
    navigation.navigate('StaffManagement');
  };

  const goToDispatchHistory = () => {
    // 권한 체크 (주석 처리)
    // if (!checkPermission('dispatch_history', '지난 출동 내역')) return;

    // console.log('Dispatch History');
    navigation.navigate('DispatchHistory');
  };

  const goToDispatchRequest = () => {
    // 권한 체크 (주석 처리)
    // if (!checkPermission('dispatch_pending', '출동 대기 내역')) return;

    console.log('Dispatch Request');
    navigation.navigate('PendingDispatch');
  };

  const goToQuoteList = () => {
    // 권한 체크 (주석 처리)
    // if (!checkPermission('estimate_history', '견적 내역')) return;

    console.log('Quote List');
    navigation.navigate('EstimateHistory');
  };

  const goToAppSetting = () => {
    // 권한 체크 (주석 처리)
    // if (!checkPermission('app_settings', '앱 설정')) return;

    console.log('App Setting');
    navigation.navigate('AppSetting', {userType: 'funeral'});
  };

  const goToPointHistory = () => {
    navigation.navigate('PointHistory', {variant: 'funeral'});
  };

  const logout = () => {
    // 로그아웃 로직
    setLogin({
      userType: null,
      isLogin: false,
      userName: '',
      accessToken: '',
      refreshToken: '',
    });
    console.log('Logout');
    // navigation.navigate('ManagerMain');
  };

  return (
    <>
      <FuneralLayout headerShown={false}>
        <View style={styles.topSection}>
          <FuneralHeader
            backButtonVisible={false}
            logoutButton={true}
            onLogoutPress={logout}
          />
          <View style={styles.container}>
            <Pressable onPress={goToPointHistory}>
              <ProfileStat point={100000} cash={50000} hallName="김상조" />
            </Pressable>
          </View>
        </View>

        <CustomButton
          onPress={() => setShowPhoneAuthSheet(true)}
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
          <CustomButton onPress={goToManageRomms} style={styles.button}>
            <View style={styles.buttonNameContainer}>
              <ManageRoomIcon width={24} height={24} />
              <Typo style={styles.buttonText}>호실 관리</Typo>
            </View>
            <MoveGrayIcon width={24} height={24} />
          </CustomButton>
          <CustomButton onPress={goToManageMembers} style={styles.button}>
            <View style={styles.buttonNameContainer}>
              <ManageMemeberIcon width={24} height={24} />
              <Typo style={styles.buttonText}>직원 관리</Typo>
            </View>
            <MoveGrayIcon width={24} height={24} />
          </CustomButton>
          <CustomButton onPress={goToDispatchHistory} style={styles.button}>
            <View style={styles.buttonNameContainer}>
              <DispatchHistoryIcon width={24} height={24} />
              <Typo style={styles.buttonText}>지난 출동 내역</Typo>
            </View>
            <MoveGrayIcon width={24} height={24} />
          </CustomButton>
          <CustomButton onPress={goToDispatchRequest} style={styles.button}>
            <View style={styles.buttonNameContainer}>
              <DispatchRequestIcon width={24} height={24} />
              <Typo style={styles.buttonText}>출동 대기 내역</Typo>
            </View>
            <MoveGrayIcon width={24} height={24} />
          </CustomButton>
          <CustomButton onPress={goToQuoteList} style={styles.button}>
            <View style={styles.buttonNameContainer}>
              <QuoteListIcon width={24} height={24} />
              <Typo style={styles.buttonText}>견적 내역</Typo>
            </View>
            <MoveGrayIcon width={24} height={24} />
          </CustomButton>
          <CustomButton onPress={goToAppSetting} style={styles.button}>
            <View style={styles.buttonNameContainer}>
              <AppSettingIcon width={24} height={24} />
              <Typo style={styles.buttonText}>앱 설정</Typo>
            </View>
            <MoveGrayIcon width={24} height={24} />
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
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  floatingButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 420 : 420, // ProfileStat 아래 적당한 위치로 조정
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
    marginTop: 470, // ProfileStat 높이 만큼 여백 확보
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
