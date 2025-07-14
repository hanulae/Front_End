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
import {useCallback, useMemo, useState} from 'react';
import LoginIcon from '../../assets/Header/Header_Login.svg';
import AlarmIcon from '../../assets/Header/Header_Alarm.svg';
import AlarmUnreadIcon from '../../assets/Header/Header_AlarmNew.svg';
import MainSearchIcon from '../../assets/Main_FuneralSearch.svg';
import MainAlarmIcon from '../../assets/Main_Alarm.svg';
import MoveIcon from '../../components/svg/MoveIcon';
import InfoCenterIcon from '../../assets/ServiceCenter.svg';
import ManagerMainProfile from '../../components/manager/ManagerMainProfile';
import {getUserInfo} from '../../utils/tokenStorage';
import DeviceInfo from 'react-native-device-info';
import api from '../../api/config';
import {clearTokens} from '../../utils/tokenStorage';
import {notificationApiService} from '../../services/api/notificationService';

interface IManagerMainPageProps {
  navigation: NavigationProp<any>;
}

const ManagerMainPage = ({navigation}: IManagerMainPageProps) => {
  const setLogin = useSetAtom(userInfoAtom);
  const userInfo = useAtomValue(userInfoAtom);

  // 화면 크기 감지
  const {width} = useWindowDimensions();

  // 브레이크포인트 정의 (갤럭시 S9 호환)
  const deviceType = useMemo(() => {
    if (width >= 768) return 'tablet';
    if (width >= 411) return 'large'; // medium phone 기준
    if (width >= 361) return 'medium';
    return 'small';
  }, [width]);

  // 반응형 스타일 계산
  const responsiveStyles = useMemo(() => {
    const scale =
      deviceType === 'small'
        ? 0.85
        : deviceType === 'medium'
        ? 0.95
        : deviceType === 'large'
        ? 1.0
        : 1.2; // tablet

    return {
      // 폰트 크기
      appNameSize: Math.round(18 * scale),
      buttonTextSize: Math.round(14 * scale),
      buttonTitleSize: Math.round(20 * scale),
      buttonSubSize: Math.round(14 * scale),
      footerTextSize: Math.round(16 * scale),

      // 패딩과 마진
      headerPadding: Math.round(20 * scale),
      headerTopPadding:
        Platform.OS === 'ios' ? Math.round(60 * scale) : Math.round(40 * scale),
      buttonPadding: Math.round(20 * scale),
      containerPadding: Math.round(16 * scale),
      buttonSpacing: Math.round(12 * scale),

      // 크기
      borderRadius: Math.round(20 * scale),
      buttonTopMargin: Math.round(20 * scale),
      iconGap: Math.round(5 * scale),
      imageTopPadding: Math.round(290 * scale),

      // 버튼 내부 패딩
      buttonVerticalPadding: Math.round(5 * scale),
      buttonHorizontalPadding: Math.round(10 * scale),
    };
  }, [deviceType]);

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
          {/* <CustomButton
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
          </CustomButton> */}
          <CustomButton
            onPress={goToAlarmPage}
            style={[
              styles.alarmButton,
              {
                paddingVertical: responsiveStyles.buttonVerticalPadding,
                paddingHorizontal: responsiveStyles.buttonHorizontalPadding,
              },
            ]}>
            {isUnread ? <AlarmUnreadIcon /> : <AlarmIcon />}
          </CustomButton>
        </View>
      </View>
      <View style={styles.mainContainer}>
        <ManagerMainProfile managerName={userInfo.userName} />
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <ImageBackground
            style={[
              styles.buttonContainer,
              {
                paddingHorizontal: responsiveStyles.containerPadding,
                paddingTop: responsiveStyles.imageTopPadding,
                gap: responsiveStyles.buttonSpacing,
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
    </ManagerLayout>
  );
};

export default ManagerMainPage;

const styles = StyleSheet.create({
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // 패딩과 gap은 동적으로 적용됨
  },
  SearchButton: {
    flex: 1,
    backgroundColor: '#fff',
    // borderRadius, padding은 동적으로 적용됨
  },
  NoticeButton: {
    flex: 1,
    backgroundColor: '#59A1FF',
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
