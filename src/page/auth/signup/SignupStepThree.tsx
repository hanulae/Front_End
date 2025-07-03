import {useAtom, useSetAtom} from 'jotai';
import axios from 'axios';
import {useState} from 'react';
import {signupAtom, initialSignupState} from '../../../state/local_state/signupAtom';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Typo from '../../../components/common/Typo';
import CustomButton from '../../../components/common/CustomButton';
import BankSelectBottomSheet from '../../../components/common/BankSelecSheet';
import CheckCircleOffIcon from '../../../assets/Check/Check01=Check01_default.svg';
import CheckCircleOnIcon from '../../../assets/Check/Check01=Check01_Active.svg';
import SmallCheckIconOff from '../../../assets/Check/Check_03=Check_03_Default.svg';
import SmallCheckIconOn from '../../../assets/Check/Check_03=Check_03_Active.svg';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import api from '../../../api/config';
interface Props {
  onSubmit: () => void;
  onPrev: () => void;
  userType?: 'manager' | 'funeral';
}

const SignupStepThree = ({onSubmit, onPrev, userType}: Props) => {
  console.log('SignupStepThree');
  // const setSignupInfo = useSetAtom(signupAtom);
  const [signupInfo, setSignupInfo] = useAtom(signupAtom);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
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
  const [name, setName] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [verified, setVerified] = useState(false);

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

  const navigateMoreInfo = (type: string) => {
    navigation.navigate('AgreementDetail', {
      type: type,
    });
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

  const allRequiredAgreements =
    agrees.service && agrees.privacy && agrees.location && agrees.age;

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      if (userType === 'manager') {
        formData.append('managerUsername', signupInfo.userName);
        formData.append('managerPassword', signupInfo.password);
        formData.append('managerName', name);
        formData.append(
          'managerPhone',
          signupInfo.phoneNumber.replace(/-/g, ''),
        );
        formData.append('managerBankName', bankName);
        formData.append('managerBankNumber', accountNumber);
        formData.append('agreements', JSON.stringify(agrees));
      } else if (userType === 'funeral') {
        formData.append('funeralUsername', signupInfo.userName);
        formData.append('funeralPassword', signupInfo.password);
        formData.append('funeralName', name);
        formData.append(
          'funeralPhoneNumber',
          signupInfo.phoneNumber.replace(/-/g, ''),
        );
        formData.append('funeralBankName', bankName);
        formData.append('funeralBankNumber', accountNumber);
        formData.append('funeralBankHolder', name);
        formData.append('agreements', JSON.stringify(agrees));
        
        // Add funeral home information
        formData.append('funeralHome', signupInfo.selectedFuneral?.funeralId); // Assuming funeralHome is a field in signupInfo
      }

      // 🔹 중복된 managerAddFile 필드가 생기지 않도록 유일하게 append
      const fileKey =
        userType === 'funeral' ? 'funeralAddFile' : 'managerAddFile';

      signupInfo.attachedFiles?.forEach((file, index) => {
        formData.append(fileKey, {
          uri: file.uri,
          type: file.type,
          name: file.name || `upload_${index}.jpg`,
        });
      });

      console.log('userType:', userType);
      console.log('🚀 ~ handleSubmit ~ formData:', formData);

      // ✅ userType에 따라 API 분기
      const endpoint =
        userType === 'manager'
          ? '/manager/user/signup'
          : '/funeral/user/signup';

      const res = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('가입 완료', res.data.message);

      // Reset signupInfo to initial state
      setSignupInfo(initialSignupState);

      navigation.navigate('SignupComplete', {
        userType,
      });
    } catch (error: any) {
      let alertMessage = '알 수 없는 오류가 발생했습니다.';

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          alertMessage = error.response.data.message;
        } else if (error.message) {
          alertMessage = error.message;
        }
      } else if (error instanceof Error) {
        alertMessage = error.message;
      }

      console.error('회원가입 에러 로그:', error);
      Alert.alert('회원가입 실패', alertMessage);
    }

    /*
  //회원가입 기존
  const handleSubmit = () => {
    setSignupInfo(prev => ({
      ...prev,
      accountInfo: {bankName, accountNumber},
      agreedTerms: agrees,
    }));
    onSubmit();
    navigation.navigate('SignupComplete', {
      userType: userType,
    });
    */
  };

  // const handleSubmit = () => {
  //   setSignupInfo(prev => ({
  //     ...prev,
  //     accountInfo: {bankName, accountNumber},
  //     agreedTerms: agrees,
  //   }));

  // };

  const handleAccountVerify = async () => {
    console.log('bankName:', bankName);
    console.log('bankCode:', bankCode);
    console.log('accountNumber:', accountNumber);
    console.log('name:', name);
    if (!bankCode || !accountNumber || !name) {
      Alert.alert('입력 오류', '은행, 계좌번호, 이름을 모두 입력해주세요.');
      return;
    }

    try {
      const res = await api.post('/manager/bank/verify', {
        bankCode,
        bankNumber: accountNumber,
        name,
      });

      Alert.alert('인증 성공', '계좌 인증이 완료되었습니다.');

      setSignupInfo(prev => ({
        ...prev,
        name,
        accountInfo: {
          bankName,
          accountNumber,
          verified: true,
        },
      }));

      setVerified(true);
    } catch (err: any) {
      console.log('계좌 인증 실패:', err.response?.data || err.message);
      Alert.alert(
        '인증 실패',
        err.response?.data?.message || '계좌 인증에 실패했습니다.',
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      {/* 이름 입력 */}
  <Typo style={styles.label}>예금주 이름</Typo>
  <TextInput
    style={styles.input}
    placeholder="이름을 입력하세요"
    placeholderTextColor="#000"
    value={name}
    onChangeText={setName}
  />
      
      {/* 계좌 인증 */}
      <View style={styles.accountSection}>
        <View style={styles.row}>
        <CustomButton
      onPress={() => setShowBankSelectSheet(true)}
      style={styles.selectBankButton}>
      <Typo style={styles.bankText}>{bankName || '은행 선택'}</Typo>
    </CustomButton>
    <TextInput
      style={[styles.input, { flex: 1, marginLeft: 8 }]}
      placeholder="000-0000-0000"
      placeholderTextColor="#000"
      value={accountNumber}
      onChangeText={setAccountNumber}
    />
        </View>

        {/* 인증 버튼 */}
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleAccountVerify}>
          <Typo color="white" fontSize={14}>
            계좌 인증
          </Typo>
        </TouchableOpacity>

        {/* 은행 선택 바텀시트 */}
        <BankSelectBottomSheet
          visible={showBankSelectSheet}
          onClose={() => setShowBankSelectSheet(false)}
          onSelect={selectedBankName => {
            setBankName(selectedBankName);

            console.log('📌 선택된 은행명:', JSON.stringify(selectedBankName));

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

        <TextInput
          style={styles.input}
          placeholder="인증코드"
          value={authCode}
          onChangeText={setAuthCode}
        />
        {/* 
        <TouchableOpacity style={styles.buttonOutline}>
          <Typo fontSize={14}>인증 코드 확인</Typo>
        </TouchableOpacity> */}
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
          <Typo style={styles.allAgreeText}>전체 약관 동의</Typo>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => handleToggle('service')}>
          <View style={styles.checkTermContainer}>
            {agrees.service ? (
              <SmallCheckIconOn width={18} height={18} />
            ) : (
              <SmallCheckIconOff width={18} height={18} />
            )}
            <Typo style={styles.termsText}>(필수) 서비스 이용약관동의</Typo>
          </View>
          <TouchableOpacity onPress={() => navigateMoreInfo('service')}>
            <Typo style={styles.moreInfoText}>보기</Typo>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => handleToggle('privacy')}>
          <View style={styles.checkTermContainer}>
            {agrees.privacy ? (
              <SmallCheckIconOn width={18} height={18} />
            ) : (
              <SmallCheckIconOff width={18} height={18} />
            )}
            <Typo style={styles.termsText}>
              (필수) 개인정보 수집 및 이용동의
            </Typo>
          </View>
          <TouchableOpacity onPress={() => navigateMoreInfo('privacy')}>
            <Typo style={styles.moreInfoText}>보기</Typo>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => handleToggle('location')}>
          <View style={styles.checkTermContainer}>
            {agrees.location ? (
              <SmallCheckIconOn width={18} height={18} />
            ) : (
              <SmallCheckIconOff width={18} height={18} />
            )}
            <Typo style={styles.termsText}>
              (필수) 위치정보 수집 및 이용동의
            </Typo>
          </View>
          <TouchableOpacity onPress={() => navigateMoreInfo('location')}>
            <Typo style={styles.moreInfoText}>보기</Typo>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => handleToggle('age')}>
          <View style={styles.checkTermContainer}>
            {agrees.age ? (
              <SmallCheckIconOn width={18} height={18} />
            ) : (
              <SmallCheckIconOff width={18} height={18} />
            )}
            <Typo style={styles.termsText}>(필수) 만 14세 이상 동의</Typo>
          </View>
          <TouchableOpacity onPress={() => navigateMoreInfo('age')}>
            <Typo style={styles.moreInfoText}>보기</Typo>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => handleToggle('marketing')}>
          <View style={styles.checkTermContainer}>
            {agrees.marketing ? (
              <SmallCheckIconOn width={18} height={18} />
            ) : (
              <SmallCheckIconOff width={18} height={18} />
            )}
            <Typo style={styles.termsText}>(선택) 마케팅 정보 수신 동의</Typo>
          </View>
          <TouchableOpacity onPress={() => navigateMoreInfo('marketing')}>
            <Typo style={styles.moreInfoText}>보기</Typo>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      {/* 회원가입 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={onPrev}>
          <Typo style={styles.buttonText}>이전</Typo>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!verified || !allRequiredAgreements) && {
              backgroundColor: '#D3D3D3',
            },
          ]}
          onPress={handleSubmit}
          disabled={!verified || !allRequiredAgreements}>
          <Typo style={styles.buttonText}>회원가입</Typo>
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
    color: '#000',
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
  checkTermContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  moreInfoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6F717D',
    fontFamily: 'Pretendard-Light',
    textDecorationLine: 'underline',
  },
  allAgreeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C212A',
    fontFamily: 'Pretendard-Light',
  },
  termsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#283042',
    fontFamily: 'Pretendard-Light',
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
    justifyContent: 'space-between',
    paddingRight: 16,
  },
  checkbox: {
    marginRight: 8,
    fontSize: 18,
  },
  submitButton: {
    backgroundColor: '#2D81F1',
    // padding: 10,
    paddingVertical: 18,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Pretendard-Light',
  },
  buttonContainer: {
    gap: 16,
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginLeft: 4,
    fontFamily: 'Pretendard-Light',
    color: '#000',
  },
  verifyButton: {
    backgroundColor: '#2D81F1',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 16,
  },
});
