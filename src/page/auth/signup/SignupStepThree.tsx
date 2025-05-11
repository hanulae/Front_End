import {useSetAtom} from 'jotai';
import {useState} from 'react';
import {signupAtom} from '../../../state/local_state/signupAtom';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Typo from '../../../components/common/Typo';
import CustomButton from '../../../components/common/CustomButton';
import BankSelectBottomSheet from '../../../components/common/BankSelecSheet';
import CheckCircleOffIcon from '../../../assets/Check/Check01=Check01_default.svg';
import CheckCircleOnIcon from '../../../assets/Check/Check01=Check01_Active.svg';
import SmallCheckIconOff from '../../../assets/Check/Check_03=Check_03_Default.svg';
import SmallCheckIconOn from '../../../assets/Check/Check_03=Check_03_Active.svg';
interface Props {
  onSubmit: () => void;
  onPrev: () => void;
}

const SignupStepThree = ({onSubmit, onPrev}: Props) => {
  const setSignupInfo = useSetAtom(signupAtom);

  const [showBankSelectSheet, setShowBankSelectSheet] = useState(false);

  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [agrees, setAgrees] = useState({
    all: false,
    service: false,
    privacy: false,
    location: false,
    age: false,
    marketing: false,
  });

  const openBankSelectSheet = () => {
    setShowBankSelectSheet(true);
  };

  const closeBankSelectSheet = () => {
    setShowBankSelectSheet(false);
  };

  const handleToggle = (key: keyof typeof agrees) => {
    if (key === 'all') {
      const newState = !agrees.all;
      setAgrees({
        all: newState,
        service: newState,
        privacy: newState,
        location: newState,
        age: newState,
        marketing: newState,
      });
    } else {
      const newState = {...agrees, [key]: !agrees[key]};
      newState.all =
        newState.service &&
        newState.privacy &&
        newState.location &&
        newState.age &&
        newState.marketing;
      setAgrees(newState);
    }
  };

  const handleSubmit = () => {
    setSignupInfo(prev => ({
      ...prev,
      accountInfo: {bankName, accountNumber},
      agreedTerms: agrees,
    }));
    onSubmit();
  };

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      {/* 계좌 인증 */}
      <View style={styles.accountSection}>
        <View style={styles.row}>
          <CustomButton
            onPress={openBankSelectSheet}
            style={styles.selectBankButton}>
            <Typo style={styles.bankText}>{bankName || '은행 선택'}</Typo>
          </CustomButton>
          <TextInput
            style={[styles.input, {flex: 1, marginLeft: 8}]}
            placeholder="000-0000-0000"
            value={accountNumber}
            onChangeText={setAccountNumber}
          />
        </View>

        <TouchableOpacity style={styles.buttonGray}>
          <Typo color="white" fontSize={14}>
            인증 코드 받기
          </Typo>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="인증코드"
          value={authCode}
          onChangeText={setAuthCode}
        />

        <TouchableOpacity style={styles.buttonOutline}>
          <Typo fontSize={14}>인증 코드 확인</Typo>
        </TouchableOpacity>
      </View>

      {/* 약관 동의 */}
      <View style={styles.termsSection}>
        <TouchableOpacity
          style={styles.allCheckboxRow}
          onPress={() => handleToggle('all')}>
          {agrees.all ? (
            <CheckCircleOnIcon width={24} height={24} />
          ) : (
            <CheckCircleOffIcon width={24} height={24} />
          )}
          <Typo>전체 약관 동의</Typo>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => handleToggle('service')}>
          {agrees.service ? (
            <SmallCheckIconOn width={18} height={18} />
          ) : (
            <SmallCheckIconOff width={18} height={18} />
          )}
          <Typo>(필수) 서비스 이용약관동의</Typo>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => handleToggle('privacy')}>
          {agrees.privacy ? (
            <SmallCheckIconOn width={18} height={18} />
          ) : (
            <SmallCheckIconOff width={18} height={18} />
          )}
          <Typo>(필수) 개인정보 수집 및 이용동의</Typo>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => handleToggle('location')}>
          {agrees.location ? (
            <SmallCheckIconOn width={18} height={18} />
          ) : (
            <SmallCheckIconOff width={18} height={18} />
          )}
          <Typo>(필수) 위치정보 수집 및 이용동의</Typo>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => handleToggle('age')}>
          {agrees.age ? (
            <SmallCheckIconOn width={18} height={18} />
          ) : (
            <SmallCheckIconOff width={18} height={18} />
          )}
          <Typo>(필수) 만 14세 이상 동의</Typo>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => handleToggle('marketing')}>
          {agrees.marketing ? (
            <SmallCheckIconOn width={18} height={18} />
          ) : (
            <SmallCheckIconOff width={18} height={18} />
          )}
          <Typo>(선택) 마케팅 정보 수신 동의</Typo>
        </TouchableOpacity>
      </View>

      {/* 회원가입 버튼 */}
      <View style={{flexDirection: 'column', gap: 16}}>
        <TouchableOpacity style={styles.submitButton} onPress={onPrev}>
          <Typo color="white" fontSize={16} style={{fontWeight: '700'}}>
            이전
          </Typo>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Typo color="white" fontSize={16} style={{fontWeight: '700'}}>
            회원가입
          </Typo>
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
  );
};

export default SignupStepThree;

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    padding: 16,
  },
  accountSection: {
    marginBottom: 32,
  },
  selectBankButton: {
    backgroundColor: '#dadada',
    borderRadius: 10,
    // paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    height: 46,
  },
  bankText: {
    color: '#000000',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'Pretendard-Light',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    fontSize: 16,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  buttonGray: {
    backgroundColor: '#888',
    borderColor: '#888',
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 12,
  },
  buttonOutline: {
    borderWidth: 2,
    borderColor: 'rgba(137, 175, 248, 0.75)',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 12,
  },
  termsSection: {
    marginBottom: 32,
  },
  allCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  allCheckboxText: {
    fontSize: 24,
    marginRight: 8,
    fontWeight: '600',
    fontFamily: 'Pretendard-Light',
  },
  checkboxRow: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',

    gap: 16,
  },
  checkbox: {
    marginRight: 8,
    fontSize: 18,
  },
  submitButton: {
    backgroundColor: '#2D81F1',
    padding: 10,
    paddingVertical: 18,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
});
