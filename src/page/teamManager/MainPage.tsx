import {NavigationProp, useFocusEffect} from '@react-navigation/native';
import {
  ImageBackground,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Typo from '../../components/common/Typo';
import CustomButton from '../../components/common/CustomButton';
import {useAtomValue, useSetAtom} from 'jotai';
import {userInfoAtom} from '../../state/local_state/userinfoAtom';
import ManagerLayout from '../../layout/ManagerLayout';
import {useCallback, useMemo} from 'react';
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
import {scaleFontSize, scaleSize} from '../../utils/responsive';

interface IManagerMainPageProps {
  navigation: NavigationProp<any>;
}

const ManagerMainPage = ({navigation}: IManagerMainPageProps) => {
  const setLogin = useSetAtom(userInfoAtom);
  const userInfo = useAtomValue(userInfoAtom);
  const {height} = useWindowDimensions();

  // 반응형 스타일 계산
  const responsiveStyles = useMemo(() => {
    // 화면 높이에 따른 동적 패딩 계산
    const dynamicImagePadding = height < 700 ? scaleSize(200) : scaleSize(290);
    const dynamicButtonPadding = height < 700 ? scaleSize(16) : scaleSize(20);

    return {
      // 폰트 크기
      appNameSize: scaleFontSize(18),
      buttonTextSize: scaleFontSize(14),
      buttonTitleSize: scaleFontSize(20),
      buttonSubSize: scaleFontSize(14),
      footerTextSize: scaleFontSize(16),

      // 패딩과 마진
      headerPadding: scaleSize(20),
      headerTopPadding: Platform.OS === 'ios' ? scaleSize(60) : scaleSize(40),
      buttonPadding: dynamicButtonPadding,
      containerPadding: scaleSize(16),
      buttonSpacing: scaleSize(12),

      // 크기
      borderRadius: scaleSize(20),
      buttonTopMargin: scaleSize(16),
      iconGap: scaleSize(5),
      imageTopPadding: dynamicImagePadding,

      // 버튼 내부 패딩
      buttonVerticalPadding: scaleSize(5),
      buttonHorizontalPadding: scaleSize(10),
    };
  }, [height]);

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
      <View style={styles.mainWrapper}>
        <View
          style={[
            styles.headerContainer,
            {
              paddingHorizontal: responsiveStyles.headerPadding,
              paddingTop: responsiveStyles.headerTopPadding,
              paddingBottom: responsiveStyles.headerPadding,
            },
          ]}>
          <Typo
            style={[styles.appName, {fontSize: responsiveStyles.appNameSize}]}>
            하늘애
          </Typo>
          <View
            style={[
              styles.leftHeaderContainer,
              {gap: responsiveStyles.buttonSpacing},
            ]}>
            <CustomButton
              onPress={logout}
              style={[
                styles.loginButton,
                {
                  gap: responsiveStyles.buttonSpacing,
                  paddingVertical: responsiveStyles.buttonVerticalPadding,
                  paddingHorizontal: responsiveStyles.buttonHorizontalPadding,
                },
              ]}>
              <Typo
                color="white"
                style={[
                  styles.buttonText,
                  {fontSize: responsiveStyles.buttonTextSize},
                ]}>
                로그아웃
              </Typo>
              <LoginIcon />
            </CustomButton>
            <CustomButton
              onPress={goToAlarmPage}
              style={[
                styles.alarmButton,
                {
                  paddingVertical: responsiveStyles.buttonVerticalPadding,
                  paddingHorizontal: responsiveStyles.buttonHorizontalPadding,
                },
              ]}>
              <AlarmIcon />
            </CustomButton>
          </View>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.profileContainer}>
            <ManagerMainProfile managerName={userInfo.userName} />
          </View>
          <View style={styles.contentContainer}>
            <ImageBackground
              style={[
                styles.buttonContainer,
                {
                  paddingHorizontal: responsiveStyles.containerPadding,
                  paddingTop: responsiveStyles.imageTopPadding,
                  gap: responsiveStyles.buttonSpacing,
                  flex: 1,
                },
              ]}
              source={require('../../assets/mainImage.png')}
              resizeMode="contain">
              <CustomButton
                onPress={goToSearchPage}
                style={[
                  styles.SearchButton,
                  {
                    borderRadius: responsiveStyles.borderRadius,
                    paddingVertical: responsiveStyles.buttonPadding,
                    paddingHorizontal: responsiveStyles.buttonPadding,
                    minHeight: scaleSize(120), // 최소 높이 설정
                  },
                ]}>
                <MainSearchIcon />
                <View
                  style={[
                    styles.buttonTextContainer,
                    {
                      marginTop: responsiveStyles.buttonTopMargin,
                      gap: responsiveStyles.buttonSpacing,
                    },
                  ]}>
                  <Typo
                    style={[
                      styles.buttonTitle,
                      {fontSize: responsiveStyles.buttonTitleSize},
                    ]}>
                    장례식장
                  </Typo>
                  <View
                    style={[
                      styles.buttonTextSubContainer,
                      {
                        gap: responsiveStyles.iconGap,
                        marginTop: responsiveStyles.iconGap,
                      },
                    ]}>
                    <Typo
                      style={[
                        styles.buttonSub,
                        {fontSize: responsiveStyles.buttonSubSize},
                      ]}>
                      찾아보기
                    </Typo>
                    <MoveIcon stroke="#397CFF" color="#397CFF" />
                  </View>
                </View>
              </CustomButton>
              <CustomButton
                onPress={goToNoticePage}
                style={[
                  styles.NoticeButton,
                  {
                    borderRadius: responsiveStyles.borderRadius,
                    paddingVertical: responsiveStyles.buttonPadding,
                    paddingHorizontal: responsiveStyles.buttonPadding,
                    minHeight: scaleSize(120), // 최소 높이 설정
                  },
                ]}>
                <MainAlarmIcon />
                <View
                  style={[
                    styles.buttonTextContainer,
                    {
                      marginTop: responsiveStyles.buttonTopMargin,
                      gap: responsiveStyles.buttonSpacing,
                    },
                  ]}>
                  <Typo
                    style={[
                      styles.buttonTitle2,
                      {fontSize: responsiveStyles.buttonTitleSize},
                    ]}>
                    견적내역
                  </Typo>
                  <View
                    style={[
                      styles.buttonTextSubContainer,
                      {
                        gap: responsiveStyles.iconGap,
                        marginTop: responsiveStyles.iconGap,
                      },
                    ]}>
                    <Typo
                      style={[
                        styles.buttonSub2,
                        {fontSize: responsiveStyles.buttonSubSize},
                      ]}>
                      확인하기
                    </Typo>
                    <MoveIcon stroke="#FFFFFF" color="#FFFFFF" />
                  </View>
                </View>
              </CustomButton>
            </ImageBackground>
            <TouchableOpacity
              style={[
                styles.footerContainer,
                {
                  gap: responsiveStyles.buttonSpacing,
                  paddingVertical: responsiveStyles.headerPadding,
                  borderTopLeftRadius: responsiveStyles.borderRadius,
                  borderTopRightRadius: responsiveStyles.borderRadius,
                  marginTop: 'auto', // 하단에 고정
                },
              ]}
              onPress={() => Linking.openURL('tel:1661-1897')}>
              <InfoCenterIcon width={21.5} height={22} />
              <Typo
                style={[
                  styles.footerText,
                  {fontSize: responsiveStyles.footerTextSize},
                ]}>
                고객센터
              </Typo>
              <Typo
                style={[
                  styles.footerNumber,
                  {fontSize: responsiveStyles.footerTextSize},
                ]}>
                02-123-4567
              </Typo>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ManagerLayout>
  );
};

export default ManagerMainPage;

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#3287F8',
    alignItems: 'center',
    // 패딩은 동적으로 적용됨
  },
  appName: {
    fontWeight: '300',
    color: '#FFFFFF',
    fontFamily: 'KIMM_Light',
    // fontSize는 동적으로 적용됨
  },
  leftHeaderContainer: {
    flexDirection: 'row',
    // gap은 동적으로 적용됨
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#000',
    // gap, padding은 동적으로 적용됨
  },
  buttonText: {
    fontWeight: '500',
    // fontSize는 동적으로 적용됨
  },
  alarmButton: {
    borderColor: '#000',
    // padding은 동적으로 적용됨
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  profileContainer: {
    zIndex: 1, // 프로필을 이미지 위로 올림
    position: 'relative',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // 상단 정렬로 변경
    position: 'relative',
    zIndex: 0, // 이미지를 프로필 아래로
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
  SearchButton: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    // borderRadius, padding은 동적으로 적용됨
  },
  NoticeButton: {
    flex: 1,
    backgroundColor: '#59A1FF',
    justifyContent: 'center',
    // borderRadius, padding은 동적으로 적용됨
  },
  buttonTextContainer: {
    flexDirection: 'column',
    // marginTop, gap은 동적으로 적용됨
  },
  buttonTitle: {
    fontWeight: '700',
    color: '#397CFF',
    fontFamily: 'Pretendard-Medium',
    textAlign: 'left',
    // fontSize는 동적으로 적용됨
  },
  buttonTitle2: {
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium',
    textAlign: 'left',
    // fontSize는 동적으로 적용됨
  },
  buttonTextSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // gap, marginTop은 동적으로 적용됨
  },
  buttonSub: {
    fontWeight: '500',
    color: '#397CFF',
    fontFamily: 'Pretendard-Medium',
    textAlign: 'left',
    // fontSize는 동적으로 적용됨
  },
  buttonSub2: {
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium',
    textAlign: 'left',
    // fontSize는 동적으로 적용됨
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3287F8',
    // gap, padding, borderRadius는 동적으로 적용됨
  },
  footerText: {
    fontWeight: '500',
    color: '#9FC9FF',
    fontFamily: 'Pretendard-Medium',
    // fontSize는 동적으로 적용됨
  },
  footerNumber: {
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'GmarketSansTTFMedium',
    // fontSize는 동적으로 적용됨
  },
});
