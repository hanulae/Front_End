import {Dimensions, Platform, StatusBar, StyleSheet, View} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import Typo from '../../components/common/Typo';
import {Input} from '../../components/common/input/Input';
import CustomButton from '../../components/common/CustomButton';
import {
  NavigationProp,
  useFocusEffect,
  useRoute,
} from '@react-navigation/native';
import {usePasswordInput} from '../../hooks/input/usePasswordInput';
import {useSetAtom} from 'jotai';
import {userInfoAtom} from '../../state/local_state/userinfoAtom';
import {useCallback, useState} from 'react';
import EmailInput from '../../components/common/input/EmailInput';
import useEmailPartsInput from '../../hooks/input/useEmailPartsInput';
import UserSelectSheet from '../../components/common/UserSelectSheet';

interface IMainPageProps {
  navigation: NavigationProp<any>;
}
const {height} = Dimensions.get('window');
const LoginPage = ({navigation}: IMainPageProps) => {
  const [showSelectSheet, setShowSelectSheet] = useState(false);
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#3287F8');
        StatusBar.setBarStyle('dark-content');
      } else {
        StatusBar.setBarStyle('dark-content');
      }
    }, []),
  );
  const route = useRoute();
  const {userType} = route.params as {userType: 'manager' | 'funeral'};
  console.log('userType', userType);
  // const email = useEmailInput();
  const email = useEmailPartsInput();
  const password = usePasswordInput();
  const setLogin = useSetAtom(userInfoAtom);

  const goToFindEmail = () => {
    navigation.navigate('FindEmail');
  };
  const goToFindPassword = () => {
    navigation.navigate('FindPW');
  };
  const goToSignup = () => {
    setShowSelectSheet(true);
  };
  const handleLogin = () => {
    setLogin({
      userType: 'funeral',
      isLogin: true,
    });
  };
  return (
    <DefaultLayout
      headerShown={true}
      // headerTitle="로그인"
      homeButton={true}
      logoutButton={false}
      homeRouteName="Main">
      <View style={styles.logoSection}>
        <Typo style={styles.logoText}>하늘애</Typo>
      </View>
      <View style={styles.formSection}>
        <EmailInput input={email} userType={userType} />
        <Input
          input={password}
          type="password"
          placeholder="비밀번호를 입력하세요."
        />
      </View>

      <View style={styles.buttonSection}>
        <CustomButton onPress={handleLogin} style={styles.button}>
          <Typo>로그인</Typo>
        </CustomButton>
      </View>
      <View style={styles.formToolSection}>
        <CustomButton onPress={goToFindEmail}>
          <Typo style={styles.toolText}>이메일 찾기</Typo>
        </CustomButton>
        <Typo style={styles.divider}> | </Typo>
        <CustomButton onPress={goToFindPassword}>
          <Typo style={styles.toolText}>비밀번호 찾기</Typo>
        </CustomButton>
        <Typo style={styles.divider}> | </Typo>
        <CustomButton onPress={goToSignup}>
          <Typo style={[styles.toolText, {color: '#2D81F1'}]}>회원가입</Typo>
        </CustomButton>
      </View>
      {showSelectSheet && (
        <UserSelectSheet
          onClose={() => setShowSelectSheet(false)}
          targetScreen="Signup"
        />
      )}
    </DefaultLayout>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  logoSection: {
    // flex: 3,
    height: height * 0.3,
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: '400',
    textAlign: 'center',
    color: '#2F86F8',
    fontFamily: 'GmarketSansTTFMedium',
  },
  formSection: {
    // flex: 3,
    // borderWidth: 3,
    height: height * 0.175,
    flexDirection: 'column',
    // justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    // gap: 20,
    // alignItems: 'center',
  },
  formToolSection: {
    // flex: 1,
    // borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  buttonSection: {
    // flex: 3,
    // borderWidth: 1,
    flexDirection: 'column',
    gap: 16,
    marginBottom: 32,
  },
  button: {
    // flex: 1,
    // borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(137, 144, 160, 0.5)',
    paddingVertical: 18,
    marginHorizontal: 18,
    marginTop: 60,
    // marginVertical: 16,
    borderRadius: 8,
  },
  toolText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6F717D',
    fontFamily: 'Pretendard-Medium',
  },
  divider: {
    fontSize: 10,
    color: '#AFB3BB',
  },
});
