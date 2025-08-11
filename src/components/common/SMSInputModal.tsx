import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

/**
 * SMS 인증번호 입력 모달
 *
 * 목적:
 * - 6자리 인증번호를 입력 받아 확인 콜백으로 전달
 * - 취소/확인 버튼 제공
 *
 * 관리하는 상태값들:
 * - smsCode: 입력 중인 인증번호
 *
 * UX:
 * - 열릴 때 자동 포커스
 * - 기본 유효성 검사 (빈 값, 6자리)
 */
interface SMSInputModalProps {
  /** 표시 여부 */
  visible: boolean;
  /** 닫기 콜백 */
  onClose: () => void;
  /** 확인 콜백 (입력된 인증코드 전달) */
  onConfirm: (code: string) => void;
  /** 인증번호 전송 받는 전화번호 (옵션, 안내 문구 표시) */
  phoneNumber?: string;
}

const SMSInputModal: React.FC<SMSInputModalProps> = ({
  visible,
  onClose,
  onConfirm,
  phoneNumber,
}) => {
  /** 입력 중인 인증번호 */
  const [smsCode, setSmsCode] = useState('');

  /** 확인 처리 (기본 유효성 검사) */
  const handleConfirm = () => {
    if (!smsCode.trim()) {
      Alert.alert('알림', '인증번호를 입력해주세요.');
      return;
    }

    if (smsCode.length !== 6) {
      Alert.alert('알림', '인증번호는 6자리입니다.');
      return;
    }

    onConfirm(smsCode);
    setSmsCode('');
  };

  /** 닫기 처리 (입력값 초기화 포함) */
  const handleClose = () => {
    setSmsCode('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>SMS 인증</Text>
          <Text style={styles.description}>
            인증번호가 발송되었습니다.
            {phoneNumber && `\n(${phoneNumber})`}
          </Text>

          <TextInput
            style={styles.input}
            value={smsCode}
            onChangeText={setSmsCode}
            placeholder="인증번호 6자리 입력"
            keyboardType="numeric"
            maxLength={6}
            autoFocus
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    marginLeft: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  confirmButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SMSInputModal;
