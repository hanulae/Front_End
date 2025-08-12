/**
 * 메인 페이지 컴포넌트
 * - 앱의 첫 화면으로 로그인, 장례식장 검색, 공지사항 접근 기능 제공
 * - props: navigation (NavigationProp)
 * - 주요 라이브러리: @react-navigation/native, react-native (ImageBackground, Linking)
 */
import React, {JSX, useCallback, useState} from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import CustomButton from '../../components/common/CustomButton';
import {NavigationProp, useFocusEffect} from '@react-navigation/native';
import Typo from '../../components/common/Typo';
import {
  ImageBackground,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import LoginIcon from '../../assets/Header/Header_Login.svg';
import MainSearchIcon from '../../assets/Main_FuneralSearch.svg';
import MainAlarmIcon from '../../assets/Main_Alarm.svg';
import MoveIcon from '../../components/svg/MoveIcon';
import InfoCenterIcon from '../../assets/ServiceCenter.svg';
import UserSelectSheet from '../../components/common/UserSelectSheet';

const {width: screenWidth} = Dimensions.get('window');

// 반응형 디자인 유틸리티 함수들 - 화면 크기에 따른 동적 크기 조정
const getResponsiveSize = (size: number) => {
  const baseWidth = 375; // iPhone X 기준 너비
  return (screenWidth / baseWidth) * size;
};

// 폰트 크기 반응형 조정 - 최소/최대 크기 제한
const getResponsiveFontSize = (size: number) => {
  const baseWidth = 375;
  const scale = screenWidth / baseWidth;
  const newSize = size * scale;

  // 최소/최대 크기 제한
  return Math.max(12, Math.min(newSize, size * 1.3));
};

// 버튼 텍스트 폰트 크기 조정 (더 작게)
const getButtonFontSize = (size: number) => {
  if (screenWidth < 350) return size * 0.7; // 작은 화면에서 더 작게
  if (screenWidth < 400) return size * 0.8; // 중간 화면에서 조금 작게
  return size * 0.9; // 큰 화면에서도 조금 작게
};

// 버튼 타이틀 폰트 크기 조정
const getButtonTitleFontSize = (size: number) => {
  if (screenWidth < 350) return size * 0.9; // 작은 화면에서 조금 더 크게
  if (screenWidth < 400) return size * 1; // 중간 화면에서 더 크게
  return size * 1; // 큰 화면에서 거의 원래 크기
};

// 화면별 마진 조정
const getResponsiveMargin = () => {
  if (screenWidth < 350) return 12; // 작은 화면
  if (screenWidth < 400) return 16; // 중간 화면
  return 20; // 큰 화면
};

// 화면별 패딩 조정
const getResponsivePadding = () => {
  if (screenWidth < 350) return 8; // 작은 화면에서 패딩 줄임
  if (screenWidth < 400) return 12; // 중간 화면에서 패딩 줄임
  return 16; // 큰 화면에서도 패딩 줄임
};

// 버튼 간격 조정
const getButtonSpacing = () => {
  if (screenWidth < 350) return 6; // 작은 화면에서 간격 줄임
  if (screenWidth < 400) return 8; // 중간 화면에서 간격 줄임
  return 10; // 큰 화면에서도 간격 줄임
};

interface IMainPageProps {
  navigation: NavigationProp<any>;
}

const MainPage = ({navigation}: IMainPageProps): JSX.Element => {
  const [showSelectSheet, setShowSelectSheet] = useState(false);

  // StatusBar 설정 - 화면 포커스 시 파란색 배경에 밝은 콘텐츠 스타일 적용
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

  // 로그인 페이지 이동 - 사용자 타입 선택 시트 표시
  const goToLoginPage = () => {
    setShowSelectSheet(true);
  };

  // 공지사항 페이지 이동
  const goToNoticePage = () => {
    console.log('Notice Page');
    navigation.navigate('Notice');
  };

  // 장례식장 검색 페이지 이동 - main variant로 설정하여 일반 검색 모드로 진입
  const goToSearchPage = () => {
    navigation.navigate('FindFuneral', {
      variant: 'main',
    });
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

        {/* 메인 버튼 섹션 - 배경 이미지와 함께 장례식장 검색, 공지사항 버튼 배치 */}
        <ImageBackground
          style={styles.buttonContainer}
          source={require('../../assets/mainImage.png')}
          resizeMode="contain">
          <View style={styles.innerButtonContainer}>
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
          </View>
        </ImageBackground>

        {/* 고객센터 연결 - 전화번호 클릭 시 전화 앱으로 연결 */}
        <TouchableOpacity
          style={styles.footerContainer}
          onPress={() => Linking.openURL('tel:1661-1897')}>
          <InfoCenterIcon width={21.5} height={22} />
          <Typo style={styles.footerText}>고객센터</Typo>
          <Typo style={styles.footerNumber}>1661-1897</Typo>
        </TouchableOpacity>
      </View>

      {/* 사용자 타입 선택 시트 - manager 또는 funeral 타입 선택 후 로그인 화면으로 이동 */}
      {showSelectSheet && (
        <UserSelectSheet
          onClose={() => setShowSelectSheet(false)}
          targetScreen="Login"
        />
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
    paddingHorizontal: getResponsiveMargin(),
    paddingTop:
      Platform.OS === 'ios' ? getResponsiveSize(60) : getResponsiveSize(40),
    paddingBottom: getResponsiveMargin(),
  },
  appName: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: '300',
    color: '#FFFFFF',
    fontFamily: 'KIMM_Light',
  },
  leftHeaderContainer: {
    flexDirection: 'row',
    gap: getButtonSpacing(),
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getButtonSpacing(),
    borderColor: '#000',
    paddingVertical: getResponsiveSize(5),
    paddingHorizontal: getResponsiveSize(10),
  },
  buttonText: {
    fontWeight: '500',
    fontSize: getResponsiveFontSize(14),
  },
  alarmButton: {
    borderColor: '#000',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  mainContainer: {
    flexDirection: 'column',
    backgroundColor: '#3287F8',
    flex: 1,
  },
  mainTitleTextContainer: {
    marginTop: getResponsiveSize(55),
    marginHorizontal: getResponsiveSize(31),
    marginBottom: getResponsiveMargin(),
    gap: getButtonSpacing(),
  },
  mainTitleText: {
    fontSize: getResponsiveFontSize(30),
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'GmarketSansTTFMedium',
    textAlign: 'center',
  },
  mainSubTextContainer: {
    marginBottom: getResponsiveSize(60),
    gap: getResponsiveSize(5),
  },
  mainSubText: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium',
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: getResponsiveSize(16),
    paddingTop:
      screenWidth < 350 ? getResponsiveSize(250) : getResponsiveSize(290),
    paddingBottom: getResponsiveSize(10),
    gap: getButtonSpacing(),
  },
  innerButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: getButtonSpacing(),
    width: '100%',
  },
  SearchButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: getResponsiveSize(20),
    paddingVertical: getResponsivePadding(),
    paddingHorizontal: getResponsivePadding(),
    minHeight:
      screenWidth < 350 ? getResponsiveSize(100) : getResponsiveSize(120),
    justifyContent: 'flex-start',
  },
  NoticeButton: {
    flex: 1,
    backgroundColor: '#59A1FF',
    borderRadius: getResponsiveSize(20),
    paddingVertical: getResponsivePadding(),
    paddingHorizontal: getResponsivePadding(),
    minHeight:
      screenWidth < 350 ? getResponsiveSize(100) : getResponsiveSize(120),
    justifyContent: 'flex-start',
  },
  buttonTextContainer: {
    flexDirection: 'column',
    marginTop:
      screenWidth < 350 ? getResponsiveSize(10) : getResponsiveSize(20),
    gap: screenWidth < 350 ? getResponsiveSize(5) : getButtonSpacing(),
  },
  buttonTitle: {
    fontSize: getButtonTitleFontSize(20),
    fontWeight: '700',
    color: '#397CFF',
    fontFamily: 'Pretendard-Medium',
    textAlign: 'left',
  },
  buttonTitle2: {
    fontSize: getButtonTitleFontSize(20),
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium',
    textAlign: 'left',
  },
  buttonTextSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: getResponsiveSize(5),
    marginTop: screenWidth < 350 ? getResponsiveSize(2) : getResponsiveSize(5),
  },
  buttonSub: {
    fontSize: getButtonFontSize(14),
    fontWeight: '500',
    color: '#397CFF',
    fontFamily: 'Pretendard-Medium',
    textAlign: 'left',
  },
  buttonSub2: {
    fontSize: getButtonFontSize(14),
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium',
    textAlign: 'left',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: getButtonSpacing(),
    paddingVertical: getResponsiveSize(10),
    backgroundColor: '#3287F8',
    borderTopLeftRadius: getResponsiveSize(20),
    borderTopRightRadius: getResponsiveSize(20),
  },
  footerText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '500',
    color: '#9FC9FF',
    fontFamily: 'Pretendard-Medium',
  },
  footerNumber: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'GmarketSansTTFMedium',
  },
});

export default MainPage;
