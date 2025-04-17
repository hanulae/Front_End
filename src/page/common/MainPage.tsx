import React, {JSX} from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import CustomButton from '../../components/common/CustomButton';
import {NavigationProp} from '@react-navigation/native';
import Typo from '../../components/common/Typo';

interface IMainPageProps {
  navigation: NavigationProp<any>;
}

const MainPage = ({navigation}: IMainPageProps): JSX.Element => {
  const goToLoginPage = () => {
    navigation.navigate('Login');
  };

  return (
    <DefaultLayout>
      <CustomButton onPress={goToLoginPage}>
        <Typo>로그인</Typo>
      </CustomButton>
    </DefaultLayout>
  );
};

export default MainPage;
