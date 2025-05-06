import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import {useInputBase} from '../../hooks/input/useInputBase';

import {Input} from '../../components/common/input/Input';
import {usePasswordInput} from '../../hooks/input/usePasswordInput';
import {useConfirmPasswordInput} from '../../hooks/input/useConfirmPasswordInput';
import Typo from '../../components/common/Typo';

const ModifyUserInfoPage = () => {
  const newPassword = usePasswordInput();
  const confirmPassword = useConfirmPasswordInput(() => newPassword.value);
  const phoneNumber = useInputBase();
  const authCodePhone = useInputBase();
  const accountBank = useInputBase(); // 은행선택은 나중에 바꿀 수도 있음
  const accountNumber = useInputBase();
  const authCodeAccount = useInputBase();
  return (
    <DefaultLayout
      headerShown={true}
      headerTitle="개인정보 수정"
      homeButton={true}
      logoutButton={false}
      homeRouteName="ManagerMain">
      <ScrollView contentContainerStyle={styles.wrapper}>
        {/* 비밀번호 변경 */}
        <Typo style={styles.sectionTitle}>비밀번호 변경</Typo>
        <View style={styles.form}>
          <View style={styles.field}>
            <Typo style={styles.label}>새로운 비밀번호</Typo>
            <Input
              type="password"
              input={newPassword}
              placeholder="비밀번호를 입력하세요"
            />
          </View>

          <View style={styles.field}>
            <Typo style={styles.label}>새로운 비밀번호 확인</Typo>
            <Input
              input={confirmPassword}
              placeholder="비밀번호 확인"
              {...confirmPassword}
              type="password"
            />
          </View>

          <TouchableOpacity style={styles.button}>
            <Typo style={styles.buttonText}>비밀번호 변경</Typo>
          </TouchableOpacity>
        </View>

        {/* 휴대전화번호 변경 */}
        <Typo style={styles.sectionTitle}>휴대전화번호 변경</Typo>
        <View style={styles.form}>
          <View style={styles.fieldRow}>
            <Input input={phoneNumber} placeholder="전화번호" />
            <TouchableOpacity style={styles.subButton}>
              <Typo style={styles.subButtonText}>인증코드받기</Typo>
            </TouchableOpacity>
          </View>

          <View style={styles.fieldRow}>
            <Input input={authCodePhone} placeholder="인증번호" />
            <Typo style={styles.timerText}>02:56</Typo>
          </View>

          <TouchableOpacity style={styles.subConfirmButton}>
            <Typo style={styles.subConfirmButtonText}>인증 코드 확인</Typo>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Typo style={styles.buttonText}>휴대전화번호 변경</Typo>
          </TouchableOpacity>
        </View>

        {/* 계좌정보 변경 */}
        <Typo style={styles.sectionTitle}>계좌정보 변경</Typo>
        <View style={styles.form}>
          <View style={styles.fieldRow}>
            <Input input={accountBank} placeholder="은행선택" />
            <TouchableOpacity style={styles.subButton}>
              <Typo style={styles.subButtonText}>인증코드받기</Typo>
            </TouchableOpacity>
          </View>

          <View style={styles.field}>
            <Input input={accountNumber} placeholder="계좌번호를 입력하세요" />
          </View>

          <View style={styles.fieldRow}>
            <Input input={authCodeAccount} placeholder="인증번호" />
            <Typo style={styles.timerText}>02:56</Typo>
          </View>

          <TouchableOpacity style={styles.subConfirmButton}>
            <Typo style={styles.subConfirmButtonText}>인증 코드 확인</Typo>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Typo style={styles.buttonText}>계좌 정보 변경 신청</Typo>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </DefaultLayout>
  );
};

export default ModifyUserInfoPage;

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 24,
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  field: {
    gap: 8,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#ccc',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  subButton: {
    backgroundColor: '#bbb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subButtonText: {
    fontSize: 14,
    color: '#fff',
  },
  timerText: {
    fontSize: 14,
    color: '#666',
    minWidth: 48,
    textAlign: 'center',
  },
  subConfirmButton: {
    borderWidth: 1,
    borderColor: '#4F7CFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  subConfirmButtonText: {
    color: '#4F7CFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
