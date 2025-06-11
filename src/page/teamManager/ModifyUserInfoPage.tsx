import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import {useInputBase} from '../../hooks/input/useInputBase';

import {Input} from '../../components/common/input/Input';
import {usePasswordInput} from '../../hooks/input/usePasswordInput';
import {useConfirmPasswordInput} from '../../hooks/input/useConfirmPasswordInput';
import Typo from '../../components/common/Typo';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import CustomButton from '../../components/common/CustomButton';
import BankSelectBottomSheet from '../../components/common/BankSelecSheet';

const ModifyUserInfoPage = () => {
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#3287F8');
        StatusBar.setBarStyle('dark-content');
      } else {
        StatusBar.setBarStyle('dark-content');
      }

      return () => {
        // 화면 포커스 해제 시 필요하다면 초기화 작업
        // 예: StatusBar.setStyle('default')
      };
    }, []),
  );
  const newPassword = usePasswordInput();
  const confirmPassword = useConfirmPasswordInput(() => newPassword.value);
  const phoneNumber = useInputBase();
  const authCodePhone = useInputBase();
  const [authCode, setAuthCode] = useState('');
  // const accountBank = useInputBase(); // 은행선택은 나중에 바꿀 수도 있음
  const [showBankSelectSheet, setShowBankSelectSheet] = useState(false);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  // const accountNumber = useInputBase();
  const authCodeAccount = useInputBase();

  const openBankSelectSheet = () => {
    setShowBankSelectSheet(true);
  };

  const closeBankSelectSheet = () => {
    setShowBankSelectSheet(false);
  };

  return (
    <DefaultLayout
      headerShown={true}
      headerTitle="개인정보 수정"
      homeButton={true}
      color="white"
      logoutButton={false}
      homeRouteName="ManagerMain">
      <ScrollView contentContainerStyle={styles.wrapper}>
        {/* 비밀번호 변경 */}
        <Typo style={styles.sectionTitle}>비밀번호 변경</Typo>
        <View style={styles.form}>
          <Typo style={styles.label}>새로운 비밀번호</Typo>
          <View style={styles.field}>
            <Input
              type="password"
              input={newPassword}
              placeholder="비밀번호를 입력하세요"
            />
          </View>
          <Typo style={styles.label}>새로운 비밀번호 확인</Typo>
          <View style={styles.field}>
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
          <Typo style={styles.label}>휴대전화번호</Typo>
          <View style={styles.fieldRow}>
            <Input input={phoneNumber} placeholder="전화번호" />
            <TouchableOpacity style={styles.subButton}>
              <Typo style={styles.subButtonText}>인증코드받기</Typo>
            </TouchableOpacity>
          </View>
          <Typo style={styles.label}>인증코드</Typo>
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
          <Typo style={styles.label}>계좌인증</Typo>
          <View style={styles.fieldRow1}>
            {/* <Input input={accountBank} placeholder="은행선택" />
            <TouchableOpacity style={styles.subButton}>
              <Typo style={styles.subButtonText}>인증코드받기</Typo>
            </TouchableOpacity> */}
            <CustomButton
              onPress={openBankSelectSheet}
              style={styles.selectBankButton}>
              <Typo style={styles.bankText}>{bankName || '은행 선택'}</Typo>
            </CustomButton>
            <TextInput
              style={styles.input}
              placeholder="계좌번호를 입력하세요."
              placeholderTextColor={'#283042'}
              value={accountNumber}
              onChangeText={setAccountNumber}
            />
          </View>

          <View style={styles.field1}>
            <TextInput
              style={styles.input}
              placeholder="인증코드"
              value={authCode}
              onChangeText={setAuthCode}
            />
          </View>
          <Typo style={styles.label}>인증코드</Typo>
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
        <BankSelectBottomSheet
          visible={showBankSelectSheet}
          onClose={closeBankSelectSheet}
          onSelect={bank => {
            setBankName(bank);
            closeBankSelectSheet();
          }}
        />
      </ScrollView>
    </DefaultLayout>
  );
};

export default ModifyUserInfoPage;

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    // padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2D81F1',
    marginTop: 8,
    paddingHorizontal: 24,
  },
  form: {
    // gap: 16,
    marginBottom: 24,
    // paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 5,
    borderBottomColor: '#F5F6F8',
  },
  field: {
    paddingHorizontal: 16,
  },
  field1: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  fieldRow1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    paddingLeft: 24,
  },
  input: {
    flex: 1,
    height: 56,
    backgroundColor: '#F5F6F8',
    borderRadius: 8,
    paddingHorizontal: 16,
    // paddingVertical: ,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#ccc',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  subButton: {
    backgroundColor: '#bbb',
    paddingVertical: 16,
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
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  subConfirmButtonText: {
    color: '#4F7CFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectBankButton: {
    backgroundColor: 'black',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    justifyContent: 'center',
    // height: 46,
  },
  bankText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'Pretendard-Light',
  },
});
