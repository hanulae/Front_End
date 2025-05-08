import {Platform, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import ProfileStat from '../../components/funeralHall/ProfileStat';
import {useEffect} from 'react';
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

const FuneralProfilePage = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#3287F8');
      StatusBar.setBarStyle('light-content');
    } else {
      StatusBar.setTranslucent(false);
      StatusBar.setBarStyle('light-content');
    }
  }, []);

  const goToModifyFuneralInfo = () => {
    console.log('Modify Funeral Info');
  };

  const goToManageRomms = () => {
    console.log('Manage Rooms');
  };

  const goToManageMembers = () => {
    console.log('Manage Members');
  };

  const goToDispatchHistory = () => {
    console.log('Dispatch History');
  };

  const goToDispatchRequest = () => {
    console.log('Dispatch Request');
  };

  const goToQuoteList = () => {
    console.log('Quote List');
  };

  const goToAppSetting = () => {
    console.log('App Setting');
  };

  return (
    <FuneralLayout headerShown={false}>
      <View style={styles.topSection}>
        <FuneralHeader backButtonVisible={false} logoutButton={true} />
        <View style={styles.container}>
          <ProfileStat point={100000} hallName="김상조" />
        </View>
      </View>

      <CustomButton
        onPress={goToModifyFuneralInfo}
        style={styles.floatingButton}>
        <View style={styles.buttonNameContainer}>
          <ModifyInfoIcon width={24} height={24} />
          <Typo style={styles.topButtonText}>정보 수정</Typo>
        </View>
        <MoveWhiteIcon width={24} height={24} />
      </CustomButton>

      <View style={styles.whiteSection}>
        {/* <CustomButton onPress={goToModifyFuneralInfo} style={styles.topButton}>
          <View style={styles.buttonNameContainer}>
            <ModifyInfoIcon width={24} height={24} />
            <Typo style={styles.topButtonText}>정보 수정</Typo>
          </View>
          <MoveGrayIcon width={24} height={24} />
        </CustomButton> */}
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
      </View>
    </FuneralLayout>
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
    top: Platform.OS === 'ios' ? 360 : 200, // ProfileStat 아래 적당한 위치로 조정
    left: 20,
    right: 20,
    zIndex: 5,
    backgroundColor: '#58A1FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 4},
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
    paddingTop: 430, // ProfileStat 높이 만큼 여백 확보
    paddingHorizontal: 20,
    gap: 5,
    zIndex: 1,
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
    lineHeight: 20,
  },
});
