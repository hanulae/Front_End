import {useRoute} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import DefaultLayout from '../../../layout/DefaultLayout';
import Typo from '../../../components/common/Typo';

const AgreementDetailPage = () => {
  const route = useRoute();
  const {type} = route.params as {
    type: 'service' | 'privacy' | 'location' | 'age' | 'marketing';
  };

  const getTitle = () => {
    switch (type) {
      case 'service':
        return '서비스 이용약관';
      case 'privacy':
        return '개인정보 처리방침';
      case 'location':
        return '위치기반 서비스 이용약관';
      case 'age':
        return '연령 확인 약관';
      case 'marketing':
        return '마케팅 수신 동의 약관';
      default:
        return '서비스 이용약관';
    }
  };

  const getContent = () => {
    switch (type) {
      case 'service':
        return '서비스 이용약관 내용';
      case 'privacy':
        return '개인정보 처리방침 내용';
      case 'location':
        return '위치기반 서비스 이용약관 내용';
      case 'age':
        return '연령 확인 약관 내용';
      case 'marketing':
        return '마케팅 수신 동의 약관 내용';
      default:
        return '서비스 이용약관 내용';
    }
  };

  return (
    <DefaultLayout
      headerShown={true}
      homeButton={false}
      color="white"
      backButton={false}
      close={true}
      logoutButton={false}
      homeRouteName="Main"
      headerTitle={getTitle()}>
      <View style={{padding: 20}}>
        <Typo fontSize={16} style={{fontWeight: '700', marginBottom: 10}}>
          {getTitle()}
        </Typo>
        <Typo fontSize={14} style={{lineHeight: 20}}>
          {getContent()}
        </Typo>
      </View>
    </DefaultLayout>
  );
};

export default AgreementDetailPage;

const styles = StyleSheet.create({});
