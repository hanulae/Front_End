import {useSetAtom} from 'jotai';
import {Button, TextInput, View, Text, StyleSheet} from 'react-native';
import {useState} from 'react';
import {signupAtom} from '../../../state/local_state/signupAtom';
import {usePhoneInput} from '../../../hooks/input/usePhoneInput';
import {useInputBase} from '../../../hooks/input/useInputBase';
import {Input} from '../../../components/common/input/Input';
import CustomButton from '../../../components/common/CustomButton';
import Typo from '../../../components/common/Typo';
import {NavigationProp, useNavigation} from '@react-navigation/native';

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

const FuneralStepTwo = ({onNext, onPrev}: Props) => {
  const setSignupInfo = useSetAtom(signupAtom);
  const navigation = useNavigation<NavigationProp<any>>();
  const phoneNumber = usePhoneInput();
  const authCode = useInputBase();

  const handleNext = () => {
    setSignupInfo(prev => ({...prev, phoneNumber: phoneNumber.value}));
    onNext();
  };

  const handlePrev = () => {
    setSignupInfo(prev => ({...prev, phoneNumber: phoneNumber.value}));
    onPrev();
  };

  const handleRequestCode = () => {
    // 인증 코드 요청 로직
    console.log('인증 코드 요청:', phoneNumber.value);
  };

  const handleVerifyCode = () => {
    // 인증 코드 확인 로직
    console.log('인증 코드 확인:', authCode.value);
  };

  return (
    <View style={{padding: 16}}>
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

      <Text>파일 첨부 (사진/파일)</Text>
      <Button
        title="파일 선택 (TODO)"
        onPress={() => console.log('파일 첨부')}
      />

      <Button
        title="내 장례식장 찾기"
        onPress={() => {
          console.log('장례식장 찾기 페이지 이동');
          navigation.navigate('FindFuneral');
        }}
      />

      <View style={{flexDirection: 'row', gap: 16}}>
        <CustomButton onPress={handlePrev} style={styles.button}>
          <Typo color="white" fontSize={14} style={{fontWeight: '700'}}>
            이전
          </Typo>
        </CustomButton>

        <CustomButton onPress={handleNext} style={styles.button}>
          <Typo color="white" fontSize={14} style={{fontWeight: '700'}}>
            다음
          </Typo>
        </CustomButton>
      </View>
    </View>
  );
};

export default FuneralStepTwo;

const styles = StyleSheet.create({
  authSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    // paddingHorizontal: 16,
  },
  verifySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    // paddingHorizontal: 16,
  },
  requestButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    paddingVertical: 18,
    borderRadius: 5,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    paddingVertical: 18,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
});
