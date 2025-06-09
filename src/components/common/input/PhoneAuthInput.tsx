import React, {useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Typo from '../Typo';
import usePhoneAuthInput from '../../../hooks/input/usePhoneAuthInput';

interface PhoneAuthInputProps {
  input: ReturnType<typeof usePhoneAuthInput>;
  onSendCode?: (phoneNumber: string) => Promise<void>;
  onVerifyCode?: (phoneNumber: string, authCode: string) => Promise<boolean>;
}

const PhoneAuthInput = ({
  input,
  onSendCode,
  onVerifyCode,
}: PhoneAuthInputProps) => {
  // 타이머 카운트다운
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (input.isCodeSent && input.timer > 0) {
      interval = setInterval(() => {
        input.setTimer(prev => prev - 1);
      }, 1000);
    } else if (input.timer === 0 && input.isCodeSent) {
      input.setIsCodeSent(false);
    }
    return () => clearInterval(interval);
  }, [input.isCodeSent, input.timer, input.setTimer, input.setIsCodeSent]);

  // 인증코드 발송
  const handleSendCode = async () => {
    if (!input.isValidPhoneNumber) {
      Alert.alert('알림', '올바른 휴대전화 번호를 입력해주세요.');
      return;
    }

    try {
      await onSendCode?.(input.phoneNumber.replace(/[^0-9]/g, ''));
      input.setIsCodeSent(true);
      input.setTimer(300); // 5분 = 300초
      input.setAuthCode('');
      input.setIsVerified(false);
      Alert.alert('알림', '인증코드가 발송되었습니다.');
    } catch (error) {
      Alert.alert('오류', '인증코드 발송에 실패했습니다.');
    }
  };

  // 인증코드 확인
  const handleVerifyCode = async () => {
    if (!input.isValidAuthCode) {
      Alert.alert('알림', '6자리 인증코드를 입력해주세요.');
      return;
    }

    try {
      const result = await onVerifyCode?.(
        input.phoneNumber.replace(/[^0-9]/g, ''),
        input.authCode,
      );

      if (result) {
        input.setIsVerified(true);
        Alert.alert('알림', '인증이 완료되었습니다.');
      } else {
        Alert.alert('오류', '인증코드가 올바르지 않습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '인증에 실패했습니다.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* 휴대전화 번호 입력 */}
      <View style={styles.phoneInputContainer}>
        <TextInput
          style={[styles.phoneInput, input.isVerified && styles.verifiedInput]}
          placeholder="휴대전화 번호 (010-1234-5678)"
          placeholderTextColor="#283042"
          value={input.phoneNumber}
          onChangeText={input.setPhoneNumber}
          keyboardType="phone-pad"
          maxLength={13}
          editable={!input.isVerified}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !input.isValidPhoneNumber && styles.disabledButton,
            input.isVerified && styles.verifiedButton,
          ]}
          onPress={handleSendCode}
          disabled={!input.isValidPhoneNumber || input.isVerified}>
          <Typo
            style={[
              styles.sendButtonText,
              input.isVerified && styles.verifiedButtonText,
            ]}>
            {input.isVerified
              ? '인증완료'
              : input.isCodeSent
              ? '재발송'
              : '인증코드 받기'}
          </Typo>
        </TouchableOpacity>
      </View>

      {/* 인증코드 입력 */}
      {input.isCodeSent && !input.isVerified && (
        <View style={styles.codeInputContainer}>
          <TextInput
            style={styles.codeInput}
            placeholder="인증코드 6자리"
            placeholderTextColor="#283042"
            value={input.authCode}
            onChangeText={input.setAuthCode}
            keyboardType="number-pad"
            maxLength={6}
          />
          <TouchableOpacity
            style={[
              styles.verifyButton,
              !input.isValidAuthCode && styles.disabledButton,
            ]}
            onPress={handleVerifyCode}
            disabled={!input.isValidAuthCode}>
            <Typo style={styles.verifyButtonText}>확인</Typo>
          </TouchableOpacity>
          <View style={styles.timerContainer}>
            <Typo style={styles.timerText}>{formatTime(input.timer)}</Typo>
          </View>
        </View>
      )}
    </View>
  );
};

export default PhoneAuthInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#F5F6F8',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000',
    height: 52,
  },
  verifiedInput: {
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  sendButton: {
    backgroundColor: '#2D81F1',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    height: 52,
    justifyContent: 'center',
    minWidth: 120,
  },
  disabledButton: {
    backgroundColor: '#D0D0D0',
  },
  verifiedButton: {
    backgroundColor: '#4CAF50',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  verifiedButtonText: {
    color: 'white',
  },
  codeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeInput: {
    flex: 1,
    backgroundColor: '#F5F6F8',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000',
    height: 52,
    textAlign: 'center',
    letterSpacing: 2,
  },
  verifyButton: {
    backgroundColor: '#2D81F1',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    height: 52,
    justifyContent: 'center',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  timerContainer: {
    justifyContent: 'center',
    minWidth: 50,
  },
  timerText: {
    fontSize: 16,
    color: '#FF5722',
    fontWeight: '600',
    textAlign: 'center',
  },
});
