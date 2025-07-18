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
import {useAtomValue} from 'jotai';
import ManagerHeader from '../../components/common/ManagerHeader';
import {scaleFontSize, scaleSize, isSmallDevice} from '../../utils/responsive';
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

  // SVG 아이콘 크기 조정
  const iconSize = scaleSize(24);

  return (
    <>
      <ManagerLayout
        color="#3287F8"
        headerShown={false}
        logoutButton={false}
        top={true}
        backIconColor="white">
        <View style={styles.topSection}>
          <ManagerHeader
            title=""
            backIconColor="white"
            alarmButton={true}
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
            <ModifyUserInfoIcon width={iconSize} height={iconSize} />
            <Typo style={styles.topButtonText}>정보 수정</Typo>
          </View>
          <MoveWhiteIcon width={iconSize} height={iconSize} />
        </CustomButton>
        <ScrollView
          style={styles.whiteSection}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.customButtonContainer}>
            <CustomButton onPress={goToEstimateList} style={styles.button}>
              <View style={styles.buttonNameContainer}>
                <QuoteIcon width={iconSize} height={iconSize} />
                <Typo style={styles.buttonText}>견적 내역</Typo>
              </View>
              <MoveGrayIcon width={iconSize} height={iconSize} />
            </CustomButton>
            <CustomButton onPress={goToPointHistory} style={styles.button}>
              <View style={styles.buttonNameContainer}>
                <PointRecordIcon width={iconSize} height={iconSize} />
                <Typo style={styles.buttonText}>캐시 내역</Typo>
              </View>
              <MoveGrayIcon width={iconSize} height={iconSize} />
            </CustomButton>
            <CustomButton onPress={goToPointRefund} style={styles.button}>
              <View style={styles.buttonNameContainer}>
                <PointRefundIcon width={iconSize} height={iconSize} />
                <Typo style={styles.buttonText}>환급</Typo>
              </View>
              <MoveGrayIcon width={iconSize} height={iconSize} />
            </CustomButton>
            <CustomButton onPress={goToAppSetting} style={styles.button}>
              <View style={styles.buttonNameContainer}>
                <AppSettingIcon width={iconSize} height={iconSize} />
                <Typo style={styles.buttonText}>앱 설정</Typo>
              </View>
              <MoveGrayIcon width={iconSize} height={iconSize} />
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

const styles = StyleSheet.create({
  topSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: scaleSize(390),
    backgroundColor: '#3287F8',
    borderBottomLeftRadius: scaleSize(28),
    borderBottomRightRadius: scaleSize(28),
    paddingTop: Platform.OS === 'ios' ? scaleSize(15) : scaleSize(60),
    paddingBottom: scaleSize(40),
    paddingHorizontal: scaleSize(20),
    zIndex: 2,
  },
  floatingButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? scaleSize(320) : scaleSize(390),
    left: scaleSize(20),
    right: scaleSize(20),
    zIndex: 6,
    backgroundColor: '#58A1FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(30),
    paddingVertical: scaleSize(20),
    borderRadius: scaleSize(15),
  },
  container: {
    backgroundColor: '#3287F8',
  },
  whiteSection: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    marginTop: Platform.OS === 'ios' ? scaleSize(330) : scaleSize(400),
    paddingTop: scaleSize(30),
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: scaleSize(20),
    paddingVertical: scaleSize(20),
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  customButtonContainer: {
    gap: scaleSize(5),
    marginTop: Platform.OS === 'ios' ? scaleSize(10) : scaleSize(20),
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
    fontSize: scaleFontSize(isSmallDevice ? 16 : 18),
    fontWeight: '600',
    color: '#000',
    lineHeight: scaleFontSize(20),
  },
  topButtonText: {
    fontSize: scaleFontSize(isSmallDevice ? 16 : 18),
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: scaleFontSize(20),
  },
  dispatchButton: {
    backgroundColor: '#2D81F1',
    borderRadius: scaleSize(10),
    paddingVertical: scaleSize(18),
    alignItems: 'center',
  },
  dispatchButtonText: {
    fontSize: scaleFontSize(isSmallDevice ? 14 : 16),
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Black',
  },
});

export default ManagerProfilePage;
