import {StyleSheet, View} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import {usePhoneInput} from '../../hooks/input/usePhoneInput';
import {Input} from '../../components/common/input/Input';
import CustomButton from '../../components/common/CustomButton';
import Typo from '../../components/common/Typo';
import {useInputBase} from '../../hooks/input/useInputBase';
import BaseInput from '../../components/common/input/BaseInput';
import {NavigationProp} from '@react-navigation/native';

interface IFindEmailPageProps {
  navigation: NavigationProp<any>;
}

const FindEmailPage = ({navigation}: IFindEmailPageProps) => {
  const phoneNumber = usePhoneInput();
  const authCode = useInputBase();
  const dummyEmail = 'example@example.com';
  const handleRequestCode = () => {
    // 휴대전화 인증 코드 요청 로직
  };

  const handleVerifyCode = () => {
    // 인증 코드 확인 로직
  };

  const handleCheckEmail = () => {
    navigation.goBack();
  };
  return (
    <DefaultLayout
      headerShown={true}
      headerTitle="로그인"
      homeButton={true}
      logoutButton={false}
      homeRouteName="Main">
      <View style={styles.formSection}>
        <View style={styles.authSection}>
          <Input input={phoneNumber} placeholder="전화번호를 입력하세요." />
          <CustomButton
            onPress={handleRequestCode}
            style={styles.requestButton}>
            <Typo color="white" fontSize={14} style={{fontWeight: '700'}}>
              인증코드요청
            </Typo>
          </CustomButton>
        </View>
        <View style={styles.verifySection}>
          <Input input={authCode} placeholder="인증코드를 입력하세요." />
          <CustomButton onPress={handleVerifyCode} style={styles.requestButton}>
            <Typo color="white" fontSize={14} style={{fontWeight: '700'}}>
              인증코드확인
            </Typo>
          </CustomButton>
        </View>
        <View style={styles.checkSection}>
          <BaseInput
            value={dummyEmail}
            editable={false}
            style={{flex: 1}}
            placeholder="인증코드 확인 후 이메일을 확인하세요."
            clearable={false}
          />
        </View>
        <CustomButton onPress={handleCheckEmail} style={styles.confirmButton}>
          <Typo>확인</Typo>
        </CustomButton>
      </View>
    </DefaultLayout>
  );
};

export default FindEmailPage;

const styles = StyleSheet.create({
  formSection: {},
  authSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingHorizontal: 16,
  },
  requestButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    paddingVertical: 18,
    borderRadius: 5,
  },
  verifySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingHorizontal: 16,
  },
  checkSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingHorizontal: 16,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    marginHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 5,
    marginTop: 16,
  },
});
