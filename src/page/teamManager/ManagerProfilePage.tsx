import React from 'react';
import {NavigationProp, useFocusEffect} from '@react-navigation/native';
import {Platform, StatusBar, StyleSheet, View, ScrollView} from 'react-native';
import Typo from '../../components/common/Typo';
import CustomButton from '../../components/common/CustomButton';
import {useCallback, useState} from 'react';
import PhoneAuthSheet from '../../components/manager/PhoneAuthSheet';
import ManagerLayout from '../../layout/ManagerLayout';
import ManagerProfileStat from '../../components/manager/ManagerProfileStat';
import MoveWhiteIcon from '../../assets/Button/Button_MoveTransparent.svg';
import MoveGrayIcon from '../../assets/Button/Button_MoveOff.svg';
import ModifyUserInfoIcon from '../../assets/Button/Button_ModifyUserinfoOn.svg';
import QuoteIcon from '../../assets/Button/Button_QuoteRecordOff.svg';
import PointRecordIcon from '../../assets/Button/Button_PointsOff.svg';
import PointRefundIcon from '../../assets/Button/Button_Refund.svg';
import AppSettingIcon from '../../assets/Button/Button_AppSettingoff.svg';
import Toast from 'react-native-toast-message';
import {userInfoAtom} from '../../state/local_state/userinfoAtom';
import {useAtomValue, useSetAtom} from 'jotai';
import ManagerHeader from '../../components/common/ManagerHeader';
// import Toast from 'react-native-toast-message';

interface IManagerProfilePageProps {
  navigation: NavigationProp<any>;
}

const ManagerProfilePage = ({navigation}: IManagerProfilePageProps) => {
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
  const setLogin = useSetAtom(userInfoAtom);
  const userInfo = useAtomValue(userInfoAtom);
  console.log('StatusBar.currentHeight', StatusBar.currentHeight);
  const [showPhoneAuthSheet, setShowPhoneAuthSheet] = useState(false);
  const goToModifyUserInfo = () => {
    console.log('Modify User Info');
    setShowPhoneAuthSheet(true);
  };
  const goToEstimateList = () => {
    navigation.navigate('EstimateList');
  };
  const goToPointHistory = () => {
    navigation.navigate('PointHistory', {variant: 'manager'});
    // Toast.show({
    //   type: 'success',
    //   text1: '포인트 내역',
    //   text2: '포인트 내역 페이지로 이동합니다.',
    //   position: 'top',
    //   visibilityTime: 2000,
    // });
  };
  const goToPointRefund = () => {
    navigation.navigate('PointRefund', {variant: 'manager'});
  };
  const goToAppSetting = () => {
    console.log('App Setting');
    navigation.navigate('AppSetting', {userType: 'manager'});
  };
  const goToCallHistory = () => {
    navigation.navigate('CallHistory');
  };

  const logout = () => {
    // 로그아웃 로직
    setLogin({
      userType: 'manager',
      isLogin: false,
      userName: '',
      accessToken: '',
      refreshToken: '',
    });
    navigation.navigate('ManagerMain');
  };

  return (
    <>
      <ManagerLayout
        color="#3287F8"
        headerShown={false}
        logoutButton={false}
        top={false}
        backIconColor="white">
        <View style={styles.topSection}>
          <ManagerHeader
            title=""
            logoutButton={true}
            backIconColor="white"
            onLogoutPress={logout}
            color="transparent"
          />
          <View style={styles.container}>
            <ManagerProfileStat managerName={userInfo.userName} />
          </View>
        </View>
        <CustomButton
          onPress={goToModifyUserInfo}
          style={styles.floatingButton}>
          <View style={styles.buttonNameContainer}>
            <ModifyUserInfoIcon width={24} height={24} />
            <Typo style={styles.topButtonText}>정보 수정</Typo>
          </View>
          <MoveWhiteIcon width={24} height={24} />
        </CustomButton>
        <ScrollView
          style={styles.whiteSection}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.customButtonContainer}>
            <CustomButton onPress={goToEstimateList} style={styles.button}>
              <View style={styles.buttonNameContainer}>
                <QuoteIcon width={24} height={24} />
                <Typo style={styles.buttonText}>견적 내역</Typo>
              </View>
              <MoveGrayIcon width={24} height={24} />
            </CustomButton>
            <CustomButton onPress={goToPointHistory} style={styles.button}>
              <View style={styles.buttonNameContainer}>
                <PointRecordIcon width={24} height={24} />
                <Typo style={styles.buttonText}>포인트 내역</Typo>
              </View>
              <MoveGrayIcon width={24} height={24} />
            </CustomButton>
            <CustomButton onPress={goToPointRefund} style={styles.button}>
              <View style={styles.buttonNameContainer}>
                <PointRefundIcon width={24} height={24} />
                <Typo style={styles.buttonText}>환급</Typo>
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
          </View>
          <CustomButton onPress={goToCallHistory} style={styles.dispatchButton}>
            <Typo style={styles.dispatchButtonText}>출동 내역</Typo>
          </CustomButton>
        </ScrollView>
      </ManagerLayout>
      <PhoneAuthSheet
        visible={showPhoneAuthSheet}
        onClose={() => setShowPhoneAuthSheet(false)}
        navigation={navigation}
      />
      <Toast />
    </>
  );
};

export default ManagerProfilePage;

const styles = StyleSheet.create({
  topSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#3287F8',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  floatingButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 340 : 390,
    left: 20,
    right: 20,
    zIndex: 6,
    backgroundColor: '#58A1FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 15,
  },
  container: {
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
    marginTop: Platform.OS === 'ios' ? 360 : 400,
    paddingTop: 20,
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  customButtonContainer: {
    gap: 5,
    marginTop: Platform.OS === 'ios' ? 10 : 20,
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
  wrapper: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  infoContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  greetingText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  pointText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F7CFF',
  },
  buttonContainer: {
    gap: 12,
  },
  dispatchButton: {
    backgroundColor: '#2D81F1',
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: 'center',
    // marginBottom: 10,
  },
  dispatchButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Black',
  },
});
