import React, {JSX, useEffect, useState} from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import CustomButton from '../../components/common/CustomButton';
import {NavigationProp} from '@react-navigation/native';
import Typo from '../../components/common/Typo';
import {
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import LoginIcon from '../../assets/Header/Header_Login.svg';
import AlarmIcon from '../../assets/Header/Header_Alarm.svg';
import MainSearchIcon from '../../assets/Main_FuneralSearch.svg';
import MainAlarmIcon from '../../assets/Main_Alarm.svg';
import MoveIcon from '../../components/svg/MoveIcon';
import InfoCenterIcon from '../../assets/ServiceCenter.svg';
import ManagerLayout from '../../layout/ManagerLayout';
import UserSelectSheet from '../../components/common/UserSelectSheet';
interface IMainPageProps {
  navigation: NavigationProp<any>;
}

const MainPage = ({navigation}: IMainPageProps): JSX.Element => {
  const [showSelectSheet, setShowSelectSheet] = useState(false);
  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#3287F8');
      StatusBar.setBarStyle('light-content');
    } else {
      // StatusBar.setTranslucent(false);
      StatusBar.setBarStyle('light-content');
    }
  }, []);
  const goToLoginPage = () => {
    setShowSelectSheet(true);
  };

  const goToAlarmPage = () => {
    console.log('Alarm Page');
  };

  const goToNoticePage = () => {
    console.log('Notice Page');
  };

  const goToSearchPage = () => {
    navigation.navigate('FindFuneral');
  };

  return (
    <DefaultLayout headerShown={false} color="#3287F8" top={false}>
      <View style={styles.headerContainer}>
        <Typo style={styles.appName}>하늘애</Typo>
        <View style={styles.leftHeaderContainer}>
          <CustomButton onPress={goToLoginPage} style={styles.loginButton}>
            <Typo color="white" style={styles.buttonText}>
              로그인
            </Typo>
            <LoginIcon />
          </CustomButton>
          <CustomButton onPress={goToAlarmPage} style={styles.alarmButton}>
            <AlarmIcon />
            {/* <AlarmOff /> */}
          </CustomButton>
        </View>
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.mainTitleTextContainer}>
          <Typo style={styles.mainTitleText}>하늘애와 함께 차분하게</Typo>
          <Typo style={styles.mainTitleText}>준비하세요.</Typo>
        </View>
        <View style={styles.mainSubTextContainer}>
          <Typo style={styles.mainSubText}>검증된 장례 업체를 통해</Typo>
          <Typo style={styles.mainSubText}>고품격 서비스를 제공합니다.</Typo>
        </View>

        <ImageBackground
          style={styles.buttonContainer}
          source={require('../../assets/mainImage.png')}
          resizeMode="contain">
          <CustomButton onPress={goToSearchPage} style={styles.SearchButton}>
            <MainSearchIcon />
            <View style={styles.buttonTextContainer}>
              <Typo style={styles.buttonTitle}>장례식장</Typo>
              <View style={styles.buttonTextSubContainer}>
                <Typo style={styles.buttonSub}>찾아보기</Typo>
                <MoveIcon stroke="#397CFF" color="#397CFF" />
              </View>
            </View>
          </CustomButton>
          <CustomButton onPress={goToNoticePage} style={styles.NoticeButton}>
            <MainAlarmIcon />
            <View style={styles.buttonTextContainer}>
              <Typo style={styles.buttonTitle2}>공지사항</Typo>
              <View style={styles.buttonTextSubContainer}>
                <Typo style={styles.buttonSub2}>확인하기</Typo>
                <MoveIcon stroke="#FFFFFF" color="#FFFFFF" />
              </View>
            </View>
          </CustomButton>
        </ImageBackground>
        <View style={styles.footerContainer}>
          <InfoCenterIcon width={21.5} height={22} />
          <Typo style={styles.footerText}>고객센터</Typo>
          <Typo style={styles.footerNumber}>02-123-4567</Typo>
        </View>
      </View>
      {showSelectSheet && (
        <UserSelectSheet onClose={() => setShowSelectSheet(false)} />
      )}
    </DefaultLayout>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#3287F8',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  appName: {
    fontSize: 18,
    fontWeight: '300',
    color: '#FFFFFF',
    fontFamily: 'KIMM_Light',
  },
  leftHeaderContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  loginButton: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    gap: 10,
    borderColor: '#000',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontWeight: '500',
    fontSize: 14,
  },
  alarmButton: {
    // backgroundColor: '#fff',
    // borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  mainContainer: {
    flexDirection: 'column',
    backgroundColor: '#3287F8',
  },
  mainTitleTextContainer: {
    marginTop: 55,
    marginHorizontal: 31,
    marginBottom: 20,
    gap: 10,
  },
  mainTitleText: {
    fontSize: 30,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'GmarketSansTTFMedium',
    textAlign: 'center',
  },
  mainSubTextContainer: {
    // marginHorizontal: 31,
    marginBottom: 60,
    gap: 5,
  },
  mainSubText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 290,
    paddingBottom: 60,
    gap: 12,
  },
  SearchButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  NoticeButton: {
    flex: 1,
    backgroundColor: '#59A1FF',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  buttonTextContainer: {
    flexDirection: 'column',
    marginTop: 30,
    // alignItems: 'center',
    gap: 10,
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#397CFF',
    fontFamily: 'Pretendard-Medium',
    textAlign: 'left',
  },
  buttonTitle2: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium',
    textAlign: 'left',
  },
  buttonTextSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
    marginTop: 5,
  },
  buttonSub: {
    fontSize: 14,
    fontWeight: '500',
    color: '#397CFF',
    fontFamily: 'Pretendard-Medium',
    textAlign: 'left',
  },
  buttonSub2: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium',
    textAlign: 'left',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 20,
    backgroundColor: '#3287F8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // marginTop: 30,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9FC9FF',
    fontFamily: 'Pretendard-Medium',
  },
  footerNumber: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'GmarketSansTTFMedium',
  },
});

export default MainPage;
