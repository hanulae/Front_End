import {NavigationProp} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import Typo from '../../components/common/Typo';

const LoginPage = () => {
  return (
    <DefaultLayout
      headerShown={true}
      headerTitle="로그인"
      homeButton={true}
      logoutButton={false}
      homeRouteName="Main">
      <Typo>로그인</Typo>
    </DefaultLayout>
  );
};

export default LoginPage;

const styles = StyleSheet.create({});
