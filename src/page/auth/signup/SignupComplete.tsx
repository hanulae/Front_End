import {ImageBackground, StyleSheet, View} from 'react-native';
import DefaultLayout from '../../../layout/DefaultLayout';
import Typo from '../../../components/common/Typo';
import CustomButton from '../../../components/common/CustomButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const SignupComplete = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const goToLoginPage = () => {
    navigation.navigate('Login', {
      userType: userType,
    });
  };

  const route = useRoute();
  const {userType} = route.params as {userType: 'manager' | 'funeral'};

  return (
    <DefaultLayout headerShown={false} color="white">
      <View style={styles.wrapper}>
        <ImageBackground
          source={require('../../../assets/signupFinish.png')}
          style={styles.imageBackground}
          resizeMode="contain"
        />
        <View style={styles.contentsContainer}>
          <Typo style={styles.subTitleText}>가입완료!</Typo>
          <Typo style={styles.titleText}>회원가입을 축하드립니다.</Typo>
          <Typo style={styles.subText}>하늘애의 소중한 회원이 되신 것을</Typo>
          <Typo style={styles.subText}>진심으로 환영합니다.</Typo>
          <Typo style={styles.sub2Text}>승인까지 1~2일 소요됩니다.</Typo>
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton onPress={goToLoginPage} style={styles.loginButton}>
            <Typo style={styles.buttonText}>로그인</Typo>
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
    paddingTop: 120,
  },
  contentsContainer: {
    flex: 4,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#283042',
    marginBottom: 10,
    ...fontBase,
  },
  subTitleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D81F1',
    marginBottom: 20,
    ...fontBase,
  },
  subText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6F717D',
    marginBottom: 5,
    ...fontBase,
  },
  sub2Text: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6F717D',
    marginTop: 25,
    ...fontBase,
  },
  buttonContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loginButton: {
    paddingVertical: 18,
    backgroundColor: '#2D81F1',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    ...fontBase,
  },
});
