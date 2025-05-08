import {StyleSheet, View} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import Typo from '../../components/common/Typo';
import {useEmailInput} from '../../hooks/input/useEmailInput';
import BaseInput from '../../components/common/input/BaseInput';
import {Input} from '../../components/common/input/Input';
import CustomButton from '../../components/common/CustomButton';
import {NavigationProp} from '@react-navigation/native';
import {usePasswordInput} from '../../hooks/input/usePasswordInput';
import {useSetAtom} from 'jotai';
import {userInfoAtom} from '../../state/local_state/userinfoAtom';

interface IMainPageProps {
  navigation: NavigationProp<any>;
}

const LoginPage = ({navigation}: IMainPageProps) => {
  const email = useEmailInput();
  const password = usePasswordInput();
  const setLogin = useSetAtom(userInfoAtom);

  const goToFindEmail = () => {
    navigation.navigate('FindEmail');
  };
  const goToFindPassword = () => {
    navigation.navigate('FindPW');
  };
  const goToSignup = () => {
    navigation.navigate('Signup');
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
      headerTitle="로그인"
      homeButton={true}
      logoutButton={false}
      homeRouteName="Main">
      <View style={styles.logoSection}>
        <Typo>로고</Typo>
      </View>
      <View style={styles.formSection}>
        <Input input={email} placeholder="이메일을 입력하세요." />
        <Input
          input={password}
          type="password"
          placeholder="비밀번호를 입력하세요."
        />
      </View>
      <View style={styles.formToolSection}>
        <CustomButton onPress={goToFindEmail}>
          <Typo>이메일 찾기</Typo>
        </CustomButton>
        <CustomButton onPress={goToFindPassword}>
          <Typo>비밀번호 찾기</Typo>
        </CustomButton>
      </View>
      <View style={styles.buttonSection}>
        <CustomButton onPress={handleLogin} style={styles.button}>
          <Typo>로그인</Typo>
        </CustomButton>
        <CustomButton onPress={goToSignup} style={styles.button}>
          <Typo>회원가입</Typo>
        </CustomButton>
      </View>
    </DefaultLayout>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  logoSection: {
    flex: 3,
    // borderWidth: 1,
  },
  formSection: {
    flex: 3,
    // borderWidth: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 24,
    alignItems: 'center',
  },
  formToolSection: {
    flex: 1,
    // borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    gap: 8,
  },
  buttonSection: {
    flex: 3,
    // borderWidth: 1,
    flexDirection: 'column',
    gap: 16,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    // borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 8,
  },
});
