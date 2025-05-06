import {NavigationProp} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import {usePasswordInput} from '../../hooks/input/usePasswordInput';
import {useConfirmPasswordInput} from '../../hooks/input/useConfirmPasswordInput';
import DefaultLayout from '../../layout/DefaultLayout';
import {Input} from '../../components/common/input/Input';
import CustomButton from '../../components/common/CustomButton';
import {useInputBase} from '../../hooks/input/useInputBase';
import {usePhoneInput} from '../../hooks/input/usePhoneInput';
import Typo from '../../components/common/Typo';

interface IFindPWPageProps {
  navigation: NavigationProp<any>;
}

const FindPWpage = ({navigation}: IFindPWPageProps) => {
  const phoneNumber = usePhoneInput();
  const password = usePasswordInput();
  const authCode = useInputBase();
  const confirmPassword = useConfirmPasswordInput(() => password.value);

  const handleRequestCode = () => {
    // 휴대전화 인증 코드 요청 로직
  };

  const handleVerifyCode = () => {
    // 인증 코드 확인 로직
  };

  const handleChangePassword = () => {
    // 비밀번호 변경 로직
    navigation.goBack();
  };

  return (
    <DefaultLayout
      headerShown={true}
      headerTitle="로그인"
      homeButton={true}
      logoutButton={false}
      homeRouteName="Main">
      <View style={styles.authSection}>
        <Input input={phoneNumber} placeholder="전화번호를 입력하세요." />
        <CustomButton onPress={handleRequestCode} style={styles.requestButton}>
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
      <View style={styles.passwordSection}>
        <Input
          input={password}
          placeholder="비밀번호를 입력하세요"
          type="password"
        />
        <Input
          input={confirmPassword}
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력하세요"
          type="password"
        />
      </View>
      <CustomButton onPress={handleChangePassword} style={styles.changeButton}>
        <Typo color="white" fontSize={14} style={{fontWeight: '700'}}>
          비밀번호변경
        </Typo>
      </CustomButton>
    </DefaultLayout>
  );
};

export default FindPWpage;

const styles = StyleSheet.create({
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
  passwordSection: {
    height: 200,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingHorizontal: 16,
    // borderWidth: 1,
    paddingVertical: 18,
  },
  changeButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    alignItems: 'center',
    paddingVertical: 18,
    marginHorizontal: 16,
    borderRadius: 5,
  },
});
