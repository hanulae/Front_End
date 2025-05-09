import React, {JSX} from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import CustomButton from '../../components/common/CustomButton';
import {NavigationProp} from '@react-navigation/native';
import Typo from '../../components/common/Typo';
import {StyleSheet, View} from 'react-native';
import AlarmOff from '../../assets/Contents/Contents_AlarmOff.svg';

interface IMainPageProps {
  navigation: NavigationProp<any>;
}

const MainPage = ({navigation}: IMainPageProps): JSX.Element => {
  const goToLoginPage = () => {
    navigation.navigate('Login');
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
    <DefaultLayout>
      <View style={styles.headerContainer}>
        <Typo>하늘애</Typo>
        <View style={styles.leftHeaderContainer}>
          <CustomButton onPress={goToLoginPage} style={styles.loginButton}>
            <Typo>로그인</Typo>
          </CustomButton>
          <CustomButton onPress={goToAlarmPage} style={styles.alarmButton}>
            <AlarmOff />
          </CustomButton>
        </View>
      </View>
      <View style={styles.mainContainer}>
        <Typo fontSize={30}>
          하늘애와 함께 차분하게
          {'\n'}
          준비하세요.
        </Typo>
        <Typo>
          검증된 장례 업체를 통해
          {'\n'}
          고품격 서비스를 제공합니다.
        </Typo>
        <View style={styles.buttonContainer}>
          <CustomButton onPress={goToSearchPage} style={styles.SearchButton}>
            <Typo>장례식장{'\n'}찾아보기</Typo>
          </CustomButton>
          <CustomButton onPress={goToNoticePage} style={styles.NoticeButton}>
            <Typo>공지사항{'\n'}바로가기</Typo>
          </CustomButton>
        </View>
      </View>
    </DefaultLayout>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  leftHeaderContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  loginButton: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    // borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  alarmButton: {
    backgroundColor: '#fff',
    // borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  mainContainer: {
    flexDirection: 'column',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  SearchButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  NoticeButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

export default MainPage;
