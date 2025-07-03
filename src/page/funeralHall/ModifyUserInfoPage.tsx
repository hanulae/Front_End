import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
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

//BSK ADD IMPORTS
import api from '../../api/config';
import Toast from 'react-native-toast-message';
import {useAtomValue} from 'jotai';
import {loginAtom} from '../../state/local_state/loginAtom';

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

  // BSK ADD LOGIN INFO
  const loginInfo = useAtomValue(loginAtom);
  const [name, setName] = useState('');
  const [bankCode, setBankCode] = useState('');

  const BANK_LIST = [
    {name: 'KB국민은행', code: '004'},
    {name: 'SC제일은행', code: '023'},
    {name: '경남은행', code: '039'},
    {name: '광주은행', code: '034'},
    {name: '기업은행', code: '003'},
    {name: '농협', code: '011'},
    {name: '대구은행', code: '031'},
    {name: '부산은행', code: '032'},
    {name: '산업은행', code: '002'},
    {name: '수협', code: '007'},
    {name: '신한은행', code: '088'},
    {name: '신협', code: '048'},
    {name: '외환은행', code: '005'},
    {name: '우리은행', code: '020'},
    {name: '우체국', code: '071'},
    {name: '전북은행', code: '037'},
    {name: '제주은행', code: '035'},
    {name: '축협', code: '012'},
    {name: '하나은행(서울은행)', code: '081'},
    {name: '한국씨티은행(한미은행)', code: '027'},
    {name: 'K뱅크', code: '089'},
    {name: '카카오뱅크', code: '090'},
  ];

  const openBankSelectSheet = () => {
    setShowBankSelectSheet(true);
  };

  const closeBankSelectSheet = () => {
    setShowBankSelectSheet(false);
  };

  const handleChangePassword = async () => {
    console.log('비밀번호 변경 시도:');
    if (!newPassword.value || !confirmPassword.value) {
      Toast.show({
        type: 'error',
        text1: '비밀번호 입력 오류',
        text2: '새 비밀번호와 확인 비밀번호를 모두 입력해주세요.',
        position: 'top',
      });
      return;
    }
    console.log('새 비밀번호:', newPassword.value);
    if (newPassword.value !== confirmPassword.value) {
      Toast.show({
        type: 'error',
        text1: '비밀번호 불일치',
        text2: '입력한 비밀번호가 일치하지 않습니다.',
        position: 'top',
      });
      return;
    }
    console.log('비밀번호 변경 요청:', newPassword.value);
    try {
      // TODO: funeral용 API 엔드포인트로 변경 필요
      const res = await api.patch(
        '/funeral/auth/update/password',
        {
          newPassword: newPassword.value,
        },
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        },
      );

      Toast.show({
        type: 'success',
        text1: '비밀번호 변경 완료',
        position: 'top',
      });
    } catch (error: any) {
      console.error(
        '비밀번호 변경 실패:',
        error.response?.data || error.message,
      );
      Toast.show({
        type: 'error',
        text1: '비밀번호 변경 실패',
        text2: error.response?.data?.message || '다시 시도해주세요.',
        position: 'top',
      });
    }
  };

  const handleRequestPhoneCode = async () => {
    const phone = phoneNumber.value.replace(/[^0-9]/g, '').trim();

    if (!phone || phone.length < 10) {
      Toast.show({
        type: 'error',
        text1: '입력 오류',
        text2: '유효한 휴대전화 번호를 입력해주세요.',
        position: 'top',
      });
      return;
    }

    try {
      // TODO: funeral용 API 엔드포인트로 변경 필요
      const res = await api.post(
        '/funeral/sms/send',
        {funeralPhone: phone},
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        },
      );

      Toast.show({
        type: 'success',
        text1: '인증번호 전송 완료',
        text2: 'SMS를 확인해주세요.',
        position: 'top',
      });
    } catch (error: any) {
      console.error(
        '인증번호 요청 실패:',
        error.response?.data || error.message,
      );
      Toast.show({
        type: 'error',
        text1: '전송 실패',
        text2: error.response?.data?.message || '서버 오류가 발생했습니다.',
        position: 'top',
      });
    }
  };

  const handleVerifyPhoneCode = async () => {
    const phone = phoneNumber.value.replace(/[^0-9]/g, '').trim();
    const code = authCodePhone.value.trim();

    if (!phone || !code) {
      Toast.show({
        type: 'error',
        text1: '입력 오류',
        text2: '전화번호와 인증코드를 모두 입력해주세요.',
        position: 'top',
      });
      return;
    }

    try {
      // TODO: funeral용 API 엔드포인트로 변경 필요
      const res = await api.post(
        '/funeral/sms/verify',
        {
          funeralPhone: phone,
          code: code,
        },
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        },
      );

      if (res.data.verified) {
        Toast.show({
          type: 'success',
          text1: '인증 성공',
          position: 'top',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: '인증 실패',
          text2: '인증코드가 틀렸거나 만료되었습니다.',
          position: 'top',
        });
      }
    } catch (error: any) {
      console.error('인증 실패:', error.response?.data || error.message);
      Toast.show({
        type: 'error',
        text1: '인증 실패',
        text2: error.response?.data?.message || '서버 오류가 발생했습니다.',
        position: 'top',
      });
    }
  };

  const handleChangePhoneNumber = async () => {
    const currentPhone = loginInfo.phoneNumber?.replace(/[^0-9]/g, '');
    console.log('🚀 ~ handleChangePhoneNumber ~ currentPhone:', currentPhone);
    const newPhone = phoneNumber.value.replace(/[^0-9]/g, '');
    console.log('🚀 ~ handleChangePhoneNumber ~ newPhone:', newPhone);

    if (!newPhone || !authCodePhone.value) {
      Toast.show({
        type: 'error',
        text1: '입력 오류',
        text2: '새 전화번호와 인증코드를 입력해주세요.',
        position: 'top',
      });
      return;
    }

    try {
      // TODO: funeral용 API 엔드포인트로 변경 필요
      const res = await api.patch(
        '/funeral/auth/update/phone',
        {
          currentPhone,
          newPhone,
        },
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        },
      );

      Toast.show({
        type: 'success',
        text1: '휴대전화번호 변경 완료',
        position: 'top',
      });

      // 필요시 phoneNumber 초기화
      // phoneNumber.setValue('');
      // authCodePhone.setValue('');
    } catch (error: any) {
      console.error(
        '휴대전화번호 변경 실패:',
        error.response?.data || error.message,
      );
      Toast.show({
        type: 'error',
        text1: '변경 실패',
        text2: error.response?.data?.message || '다시 시도해주세요.',
        position: 'top',
      });
    }
  };

  const handleAccountVerify = async () => {
    console.log('bankName:', bankName);
    console.log('bankCode:', bankCode);
    console.log('accountNumber:', accountNumber);
    console.log('name:', name);
    if (!bankCode || !accountNumber || !bankName) {
      Alert.alert('입력 오류', '은행, 계좌번호, 이름을 모두 입력해주세요.');
      return;
    }

    try {
      // TODO: funeral용 API 엔드포인트로 변경 필요
      const res = await api.post('/funeral/bank/verify', {
        bankCode,
        bankNumber: accountNumber,
        name,
      });

      Alert.alert('인증 성공', '계좌 인증이 완료되었습니다.');
    } catch (err: any) {
      console.log('계좌 인증 실패:', err.response?.data || err.message);
      Alert.alert(
        '인증 실패',
        err.response?.data?.message || '계좌 인증에 실패했습니다.',
      );
    }
  };

  const handleChangeBankInfo = async () => {
    console.log('bankName:', bankName);
    console.log('bankCode:', bankCode);
    console.log('accountNumber:', accountNumber);
    if (!bankName || !bankCode || !accountNumber || !bankName.trim()) {
      Toast.show({
        type: 'error',
        text1: '입력 오류',
        text2: '은행명과 계좌번호, 예금주를 모두 입력해주세요.',
        position: 'top',
      });
      return;
    }

    try {
      // TODO: funeral용 API 엔드포인트로 변경 필요
      const res = await api.patch(
        '/funeral/auth/update/bank-number',
        {
          funeralBankName: bankName.trim(),
          funeralBankNumber: accountNumber.trim(),
          funeralBankHolder: bankName.trim(), // 예금주 이름도 bankName에 들어 있다고 가정
        },
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        },
      );

      Toast.show({
        type: 'success',
        text1: '계좌 정보 변경 완료',
        position: 'top',
      });

      // 이후 계좌 인증 결과 등 필요시 처리 추가
    } catch (error: any) {
      console.error(
        '계좌 정보 변경 실패:',
        error.response?.data || error.message,
      );
      Toast.show({
        type: 'error',
        text1: '변경 실패',
        text2: error.response?.data?.message || '서버 오류가 발생했습니다.',
        position: 'top',
      });
    }
  };

  return (
    <DefaultLayout
      headerShown={true}
      headerTitle="개인정보 수정"
      homeButton={true}
      color="white"
      logoutButton={false}
      homeRouteName="FuneralMain">
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

          <TouchableOpacity
            style={styles.button}
            onPress={handleChangePassword}>
            <Typo style={styles.buttonText}>비밀번호 변경</Typo>
          </TouchableOpacity>
        </View>

        {/* 휴대전화번호 변경 */}
        <Typo style={styles.sectionTitle}>휴대전화번호 변경</Typo>
        <View style={styles.form}>
          <Typo style={styles.label}>휴대전화번호</Typo>
          <View style={styles.fieldRow}>
            <Input input={phoneNumber} placeholder="전화번호" />
            <TouchableOpacity
              style={styles.subButton}
              onPress={handleRequestPhoneCode}>
              <Typo style={styles.subButtonText}>인증코드받기</Typo>
            </TouchableOpacity>
          </View>
          <Typo style={styles.label}>인증코드</Typo>
          <View style={styles.fieldRow}>
            <Input input={authCodePhone} placeholder="인증번호" />
            <Typo style={styles.timerText}>02:56</Typo>
          </View>

          <TouchableOpacity
            style={styles.subConfirmButton}
            onPress={handleVerifyPhoneCode}>
            <Typo style={styles.subConfirmButtonText}>인증 코드 확인</Typo>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleChangePhoneNumber}>
            <Typo style={styles.buttonText}>휴대전화번호 변경</Typo>
          </TouchableOpacity>
        </View>

        {/* 계좌정보 변경 */}
        <Typo style={styles.sectionTitle}>계좌정보 변경</Typo>
        <View style={styles.form}>
          <Typo style={styles.label}>계좌인증</Typo>
          {/* 은행 선택 바텀시트 */}
          <BankSelectBottomSheet
            visible={showBankSelectSheet}
            onClose={() => setShowBankSelectSheet(false)}
            onSelect={selectedBankName => {
              setBankName(selectedBankName);

              console.log(
                '📌 선택된 은행명:',
                JSON.stringify(selectedBankName),
              );

              const matched = BANK_LIST.find(b => {
                console.log(
                  '🔍 비교:',
                  JSON.stringify(b.name),
                  'vs',
                  JSON.stringify(selectedBankName),
                );
                return b.name.trim() === selectedBankName.trim();
              });

              if (matched) {
                console.log('✅ 매칭된 코드:', matched.code);
                setBankCode(matched.code);
              } else {
                console.warn('⚠️ 은행 코드 매칭 실패:', selectedBankName);
                setBankCode('');
              }

              setShowBankSelectSheet(false);
            }}
          />
          <View style={styles.field1}>
            <TextInput
              style={styles.input}
              placeholder="예금주 이름을 입력하세요."
              placeholderTextColor={'#283042'}
              value={name}
              onChangeText={setName}
            />
          </View>

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

          {/* <View style={styles.field1}>
            <TextInput
              style={styles.input}
              placeholder="인증코드"
              value={authCode}
              onChangeText={setAuthCode}
            />
          </View> */}
          {/* <Typo style={styles.label}>인증코드</Typo> */}
          {/* <View style={styles.fieldRow}>
            <Input input={authCodeAccount} placeholder="인증번호" />
            <Typo style={styles.timerText}>02:56</Typo>
          </View> */}

          <TouchableOpacity
            style={styles.subConfirmButton}
            onPress={handleAccountVerify}>
            <Typo style={styles.subConfirmButtonText}>계좌 인증</Typo>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleChangeBankInfo}>
            <Typo style={styles.buttonText}>계좌 정보 변경 신청</Typo>
          </TouchableOpacity>
        </View>
        {/* <BankSelectBottomSheet
          visible={showBankSelectSheet}
          onClose={closeBankSelectSheet}
          onSelect={bank => {
            setBankName(bank);
            closeBankSelectSheet();
          }}
        /> */}
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
