import {NavigationProp, useFocusEffect} from '@react-navigation/native';
import {
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Typo from '../../components/common/Typo';
import CustomButton from '../../components/common/CustomButton';
import {useAtomValue, useSetAtom} from 'jotai';
import {userInfoAtom} from '../../state/local_state/userinfoAtom';
import ManagerLayout from '../../layout/ManagerLayout';
import {useCallback} from 'react';
import LoginIcon from '../../assets/Header/Header_Login.svg';
import AlarmIcon from '../../assets/Header/Header_Alarm.svg';
import MainSearchIcon from '../../assets/Main_FuneralSearch.svg';
import MainAlarmIcon from '../../assets/Main_Alarm.svg';
import MoveIcon from '../../components/svg/MoveIcon';
import InfoCenterIcon from '../../assets/ServiceCenter.svg';
import ManagerMainProfile from '../../components/manager/ManagerMainProfile';
import {getUserInfo} from '../../utils/tokenStorage';
import DeviceInfo from 'react-native-device-info';
import api from '../../api/config';
import {clearTokens} from '../../utils/tokenStorage';
interface IManagerMainPageProps {
  navigation: NavigationProp<any>;
}

const ManagerMainPage = ({navigation}: IManagerMainPageProps) => {
  const setLogin = useSetAtom(userInfoAtom);
  const userInfo = useAtomValue(userInfoAtom);
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#3287F8');
        StatusBar.setBarStyle('light-content');
      } else {
        StatusBar.setBarStyle('light-content');
      }
    }, []),
  );

  const logout = async () => {
    try {
      const userInfos = await getUserInfo();
      const deviceId = await DeviceInfo.getUniqueId();
      const response = await api.post('/manager/auth/logout', {
        userId: userInfos?.userId,
        userType: userInfos?.userType,
        deviceId: deviceId,
      });
      if (response.status === 200) {
        // AsyncStorage 정리
        await clearTokens();
        // 로그아웃 로직
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

  const goToNoticePage = () => {
    navigation.navigate('EstimateList');
  };

  const goToSearchPage = () => {
    navigation.navigate('FindFuneral', {
      screen: 'FuneralSearchPage', // Tab.Screen 이름
      params: {variant: 'main'},
    });
  };

  const goToAlarmPage = () => {
    navigation.navigate('Notification', {variant: 'manager'});
  };

  return (
    <ManagerLayout headerShown={false} color="#3287F8" top={false}>
      <View style={styles.headerContainer}>
        <Typo style={styles.appName}>하늘애</Typo>
        <View style={styles.leftHeaderContainer}>
          <CustomButton onPress={logout} style={styles.loginButton}>
            <Typo color="white" style={styles.buttonText}>
              로그아웃
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
        <ManagerMainProfile managerName={userInfo.userName} />
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
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
                <Typo style={styles.buttonTitle2}>견적내역</Typo>
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
      </View>
    </ManagerLayout>
  );
};

export default ManagerMainPage;

const styles = StyleSheet.create({
  // Define your styles here
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
    flex: 1,
    flexDirection: 'column',
  },
  container: {
    flex: 1,
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
