// import {useSetAtom} from 'jotai';

// import {Button, TextInput, View, Text} from 'react-native';
// import {useState} from 'react';
// import {signupAtom} from '../../../state/local_state/signupAtom';

// interface Props {
//   onSubmit: () => void;
//   onPrev: () => void;
// }

// const SignupStepThree = ({onSubmit, onPrev}: Props) => {
//   const setSignupInfo = useSetAtom(signupAtom);
//   const [bankName, setBankName] = useState('');
//   const [accountNumber, setAccountNumber] = useState('');
//   const [agreed, setAgreed] = useState(false);

//   const handleSubmit = () => {
//     setSignupInfo(prev => ({
//       ...prev,
//       accountInfo: {bankName, accountNumber},
//       agreedTerms: agreed,
//     }));
//     onSubmit();
//   };

//   return (
//     <View style={{padding: 16}}>
//       <Text>계좌 정보 입력</Text>
//       <TextInput
//         placeholder="은행명"
//         value={bankName}
//         onChangeText={setBankName}
//         style={{borderWidth: 1, marginVertical: 8}}
//       />
//       <TextInput
//         placeholder="계좌번호"
//         value={accountNumber}
//         onChangeText={setAccountNumber}
//         style={{borderWidth: 1, marginVertical: 8}}
//       />

//       <Button
//         title={agreed ? '약관 동의 완료' : '약관 동의하기'}
//         onPress={() => setAgreed(!agreed)}
//       />

//       <Button title="회원가입 완료" onPress={handleSubmit} />
//     </View>
//   );
// };

// export default SignupStepThree;

import {useSetAtom} from 'jotai';
import {useState} from 'react';
import {signupAtom} from '../../../state/local_state/signupAtom';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Typo from '../../../components/common/Typo';

interface Props {
  onSubmit: () => void;
  onPrev: () => void;
}

const SignupStepThree = ({onSubmit, onPrev}: Props) => {
  const setSignupInfo = useSetAtom(signupAtom);

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
          <TextInput
            style={[styles.input, {flex: 1}]}
            placeholder="은행선택"
            value={bankName}
            onChangeText={setBankName}
          />
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
          style={styles.checkboxRow}
          onPress={() => handleToggle('all')}>
          <Text style={styles.checkbox}>{agrees.all ? '☑️' : '⬜️'}</Text>
          <Typo>전체 약관 동의</Typo>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => handleToggle('service')}>
          <Text style={styles.checkbox}>{agrees.service ? '☑️' : '⬜️'}</Text>
          <Typo>(필수) 서비스 이용약관동의</Typo>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => handleToggle('privacy')}>
          <Text style={styles.checkbox}>{agrees.privacy ? '☑️' : '⬜️'}</Text>
          <Typo>(필수) 개인정보 수집 및 이용동의</Typo>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => handleToggle('location')}>
          <Text style={styles.checkbox}>{agrees.location ? '☑️' : '⬜️'}</Text>
          <Typo>(필수) 위치정보 수집 및 이용동의</Typo>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => handleToggle('age')}>
          <Text style={styles.checkbox}>{agrees.age ? '☑️' : '⬜️'}</Text>
          <Typo>(필수) 만 14세 이상 동의</Typo>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => handleToggle('marketing')}>
          <Text style={styles.checkbox}>{agrees.marketing ? '☑️' : '⬜️'}</Text>
          <Typo>(선택) 마케팅 정보 수신 동의</Typo>
        </TouchableOpacity>
      </View>

      {/* 회원가입 버튼 */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Typo color="white" fontSize={16} fontWeight="bold">
          회원가입
        </Typo>
      </TouchableOpacity>
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
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonGray: {
    backgroundColor: '#888',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 12,
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 12,
  },
  termsSection: {
    marginBottom: 32,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    marginRight: 8,
    fontSize: 18,
  },
  submitButton: {
    backgroundColor: '#4F7CFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
});
