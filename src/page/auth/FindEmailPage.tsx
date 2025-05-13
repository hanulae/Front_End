import {StyleSheet, View} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import {usePhoneInput} from '../../hooks/input/usePhoneInput';
import {Input} from '../../components/common/input/Input';
import CustomButton from '../../components/common/CustomButton';
import Typo from '../../components/common/Typo';
import {useInputBase} from '../../hooks/input/useInputBase';
import BaseInput from '../../components/common/input/BaseInput';
import {NavigationProp} from '@react-navigation/native';
import {request} from 'react-native-permissions';

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
      headerTitle="이메일 찾기"
      color="white"
      homeButton={true}
      logoutButton={false}
      homeRouteName="Main">
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <Typo fontSize={16} style={styles.containerTitle}>
            휴대전화번호 인증
          </Typo>
          <View style={styles.authSection}>
            <Input
              input={phoneNumber}
              placeholder="전화번호를 입력하세요."
              type="phone"
            />
            <CustomButton
              onPress={handleRequestCode}
              style={styles.requestButton}>
              <Typo color="white" fontSize={14} style={{fontWeight: '700'}}>
                인증코드받기
              </Typo>
            </CustomButton>
          </View>
        </View>
        <View style={styles.container}>
          <Typo fontSize={16} style={styles.containerTitle}>
            인증코드 확인
          </Typo>
          <View style={styles.verifySection}>
            <Input
              input={authCode}
              placeholder="인증코드를 입력하세요."
              type="number"
            />
            <CustomButton
              onPress={handleVerifyCode}
              style={styles.verifyButton}>
              <Typo color="white" style={styles.verifyButtonText}>
                인증코드확인
              </Typo>
            </CustomButton>
          </View>
        </View>
        <View style={styles.container}>
          <Typo fontSize={16} style={styles.containerTitle}>
            나의 이메일
          </Typo>
          <View style={styles.checkSection}>
            <BaseInput
              value={dummyEmail}
              editable={false}
              style={{flex: 1}}
              placeholder="인증코드 확인 후 이메일을 확인하세요."
              clearable={false}
            />
          </View>
        </View>
        <View style={styles.buttonConatiner}>
          <CustomButton onPress={handleCheckEmail} style={styles.confirmButton}>
            <Typo style={styles.confimButtonText}>확인</Typo>
          </CustomButton>
        </View>
      </View>
    </DefaultLayout>
  );
};

export default FindEmailPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 16,
  },
  container: {
    // borderWidth: 1,
  },
  containerTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard-Light',
    // marginBottom: 5,
    marginLeft: 10,
  },
  authSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  requestButton: {
    backgroundColor: '#8990A0',
    padding: 10,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  requestButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Light',
  },
  verifySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  verifyButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(137, 175, 248, 0.75)',
    paddingHorizontal: 9,
    paddingVertical: 17,
    borderRadius: 10,
    alignItems: 'center',
  },
  verifyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A83E3',
    fontFamily: 'Pretendard-Light',
  },
  checkSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  buttonConatiner: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: '#2D81F1',
    padding: 10,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  confimButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Light',
  },
});
