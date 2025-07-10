import {ImageBackground, StyleSheet, View, useWindowDimensions} from 'react-native';
import DefaultLayout from '../../../layout/DefaultLayout';
import Typo from '../../../components/common/Typo';
import CustomButton from '../../../components/common/CustomButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useMemo} from 'react';

const SignupComplete = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute();
  const {userType} = route.params as {userType: 'manager' | 'funeral'};
  
  // 화면 크기 감지
  const {width} = useWindowDimensions();
  
  // 브레이크포인트 정의 (갤럭시 S9 호환)
  // 갤럭시 S9: 360px, medium phone: 411px
  const deviceType = useMemo(() => {
    if (width >= 768) return 'tablet';
    if (width >= 411) return 'large'; // medium phone 기준
    if (width >= 361) return 'medium';
    return 'small';
  }, [width]);

  // 반응형 스타일 계산
  const responsiveStyles = useMemo(() => {
    const scale = deviceType === 'small' ? 0.85 : 
                  deviceType === 'medium' ? 0.95 :
                  deviceType === 'large' ? 1.0 : 1.2; // tablet

    return {
      titleFontSize: Math.round(24 * scale),
      subTitleFontSize: Math.round(14 * scale),
      subTextFontSize: Math.round(14 * scale),
      buttonTextSize: Math.round(16 * scale),
      imageTopPadding: Math.round(120 * scale),
      buttonPadding: Math.round(18 * scale),
      horizontalPadding: Math.round(16 * scale),
      titleMarginBottom: Math.round(10 * scale),
      subTitleMarginBottom: Math.round(20 * scale),
      subTextMarginBottom: Math.round(5 * scale),
      sub2TextMarginTop: Math.round(25 * scale),
      telTextMarginTop: Math.round(20 * scale),
    };
  }, [deviceType]);

  const goToLoginPage = () => {
    navigation.navigate('Login', {
      userType: userType,
    });
  };

  return (
    <DefaultLayout headerShown={false} color="white">
      <View style={styles.wrapper}>
        <ImageBackground
          source={require('../../../assets/signupFinish.png')}
          style={[styles.imageBackground, { paddingTop: responsiveStyles.imageTopPadding }]}
          resizeMode="contain"
        />
        <View style={styles.contentsContainer}>
          <Typo style={[styles.subTitleText, { 
            fontSize: responsiveStyles.subTitleFontSize,
            marginBottom: responsiveStyles.subTitleMarginBottom
          }]}>가입완료!</Typo>
          <Typo style={[styles.titleText, { 
            fontSize: responsiveStyles.titleFontSize,
            marginBottom: responsiveStyles.titleMarginBottom
          }]}>회원가입을 축하드립니다.</Typo>
          <Typo style={[styles.subText, { 
            fontSize: responsiveStyles.subTextFontSize,
            marginBottom: responsiveStyles.subTextMarginBottom
          }]}>하늘애의 소중한 회원이 되신 것을</Typo>
          <Typo style={[styles.subText, { 
            fontSize: responsiveStyles.subTextFontSize,
            marginBottom: responsiveStyles.subTextMarginBottom
          }]}>진심으로 환영합니다.</Typo>
          <Typo style={[styles.sub2Text, { 
            fontSize: responsiveStyles.subTextFontSize,
            marginTop: responsiveStyles.sub2TextMarginTop
          }]}>승인까지 1~2일 소요될 수 있습니다.</Typo>
          <Typo style={[styles.telText, { 
            fontSize: responsiveStyles.subTextFontSize,
            marginTop: responsiveStyles.telTextMarginTop
          }]}>고객센터 1661-1897</Typo>
        </View>
        <View style={[styles.buttonContainer, { paddingHorizontal: responsiveStyles.horizontalPadding }]}>
          <CustomButton onPress={goToLoginPage} style={[styles.loginButton, { 
            paddingVertical: responsiveStyles.buttonPadding
          }]}>
            <Typo style={[styles.buttonText, { fontSize: responsiveStyles.buttonTextSize }]}>로그인</Typo>
          </CustomButton>
        </View>
      </View>
    </DefaultLayout>
  );
};

export default SignupComplete;

const fontBase = {
  fontFamily: 'Pretnedard-Black',
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  imageBackground: {
    flex: 5,
    // paddingTop은 동적으로 적용됨
  },
  contentsContainer: {
    flex: 4,
    alignItems: 'center',
  },
  titleText: {
    fontWeight: '600',
    color: '#283042',
    ...fontBase,
    // fontSize, marginBottom은 동적으로 적용됨
  },
  subTitleText: {
    fontWeight: '500',
    color: '#2D81F1',
    ...fontBase,
    // fontSize, marginBottom은 동적으로 적용됨
  },
  subText: {
    fontWeight: '400',
    color: '#6F717D',
    ...fontBase,
    // fontSize, marginBottom은 동적으로 적용됨
  },
  sub2Text: {
    fontWeight: '400',
    color: '#6F717D',
    ...fontBase,
    // fontSize, marginTop은 동적으로 적용됨
  },
  buttonContainer: {
    flex: 1,
    // paddingHorizontal은 동적으로 적용됨
  },
  loginButton: {
    backgroundColor: '#2D81F1',
    alignItems: 'center',
    borderRadius: 10,
    // paddingVertical은 동적으로 적용됨
  },
  buttonText: {
    fontWeight: '700',
    color: '#FFFFFF',
    ...fontBase,
    // fontSize는 동적으로 적용됨
  },
  telText: {
    ...fontBase,
    fontWeight: '400',
    // fontSize, marginTop은 동적으로 적용됨
  },
});
