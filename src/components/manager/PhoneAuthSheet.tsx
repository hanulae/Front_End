import {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, Pressable, StyleSheet, View} from 'react-native';
import {usePhoneInput} from '../../hooks/input/usePhoneInput';
import {useInputBase} from '../../hooks/input/useInputBase';
import {NavigationProp} from '@react-navigation/native';
import {Input} from '../common/input/Input';
import Typo from '../common/Typo';
import CustomButton from '../common/CustomButton';
import CloseIcon from '../../assets/Icon/Icon_BtnClose01.svg';
const screenHeight = Dimensions.get('window').height;

// BSK ADD IMPORTS
import api from '../../api/config';
import Toast from 'react-native-toast-message';
import { getUserInfo } from '../../utils/tokenStorage';

interface IPhoneAuthSheetProps {
  visible: boolean;
  onClose: () => void;
  navigation: NavigationProp<any>;
}
const PhoneAuthSheet = ({
  visible,
  onClose,
  navigation,
}: IPhoneAuthSheetProps) => {
  const translateY = useRef(new Animated.Value(screenHeight)).current;

  const phoneNumber = usePhoneInput();
  const authCode = useInputBase();

  const [isPressed, setIsPressed] = useState(false);

  const confirmCode = async () => {
    const phone = phoneNumber.value.replace(/[^0-9]/g, '').trim();
    const code = authCode.value.trim();
  
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
      const res = await api.post('/manager/sms/update/verify', {
        phoneNumber: phone,
        code: code,
      });
  
      if (res.data.verified) {
        Toast.show({
          type: 'success',
          text1: '인증 성공',
          position: 'top',
        });
  
        // 인증 성공 시 페이지 이동
        navigation.navigate('ModifyUserInfo');
        onClose();
      } else {
        Toast.show({
          type: 'error',
          text1: '인증 실패',
          text2: '인증코드가 틀렸거나 만료되었습니다.',
          position: 'top',
        });
      }
    } catch (error: any) {
      console.error('인증 코드 확인 실패:', error.response?.data || error.message);
      Toast.show({
        type: 'error',
        text1: '서버 오류',
        text2: error.response?.data?.message || '잠시 후 다시 시도해주세요.',
        position: 'top',
      });
    }
  };

  const handleRequestCode = async () => {
    const phone = phoneNumber.value.replace(/[^0-9]/g, '').trim();
  
    if (!phone || phone.length < 10) {
      Toast.show({
        type: 'error',
        text1: '입력 오류',
        text2: '유효한 휴대폰 번호를 입력해주세요.',
        position: 'top',
      });
      return;
    }
  
    try {
      const res = await api.post(
        '/manager/sms/update/send',
        { managerPhone: phone,
          userType: 'manager'
        }
      );
  
      console.log('📨 인증번호 전송 성공:', res.data);
      Toast.show({
        type: 'success',
        text1: '인증번호 전송 완료',
        text2: 'SMS를 확인해주세요.',
        position: 'top',
      });
    } catch (error: any) {
      console.error('❌ 인증번호 전송 실패:', error.response?.data || error.message);
      Toast.show({
        type: 'error',
        text1: '전송 실패',
        text2: error.response?.data?.message || '서버 오류가 발생했습니다.',
        position: 'top',
      });
    }
  };

  useEffect(() => {
    const fetchManagerPhoneNumber = async () => {
      try {
        const info = await getUserInfo(); // Assuming getUserInfo fetches the manager's info
        if (info && info.data && info.data.managerPhoneNumber) {
          phoneNumber.onChangeText(info.data.managerPhoneNumber);
        }
      } catch (error) {
        console.error('Failed to fetch manager phone number:', error);
      }
    };

    fetchManagerPhoneNumber();
  }, [phoneNumber]);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  if (!visible) {
    return null;
  }
  return (
    <>
      {visible && <Pressable style={styles.backdrop} onPress={onClose} />}
      <Animated.View
        style={[styles.sheetContainer, {transform: [{translateY}]}]}>
        <View style={styles.placeholder}>
          <View style={styles.header}>
            <Typo style={styles.headerTitle}>전화번호 인증</Typo>
            <Pressable onPress={onClose}>
              <CloseIcon />
            </Pressable>
          </View>
          <View style={styles.label}>
            <Typo fontSize={16} style={styles.containerTitle}>
              휴대전화번호
            </Typo>
          </View>
          <View style={styles.authSection}>
            <Input input={phoneNumber} type="phone" placeholder="전화번호를 입력하세요." />
            <Pressable
              onPressIn={() => setIsPressed(true)}
              onPressOut={() => setIsPressed(false)}
              onPress={handleRequestCode}
              style={[
                styles.requestButton,
                {backgroundColor: isPressed ? '#CCCCCC' : '#2D81F1'}, // 클릭 시 그레이, 기본 파랑
              ]}>
              <Typo color="white" style={styles.verifyButtonText}>
                인증코드요청
              </Typo>
            </Pressable>
          </View>
          <View style={styles.label}>
            <Typo fontSize={16} style={styles.containerTitle}>
              인증코드
            </Typo>
          </View>
          <View style={styles.authSection}>
            <Input input={authCode} type="number" placeholder="인증코드를 입력하세요." />
          </View>
          <View style={styles.authSection}>
            <CustomButton onPress={confirmCode} style={styles.confirmButton}>
              <Typo color="white" style={styles.confirmButtonText}>
                인증코드확인
              </Typo>
            </CustomButton>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

export default PhoneAuthSheet;

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    // zIndex: 10,
  },
  label: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    width: '100%',
    // marginBottom: 10,
  },
  containerTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard-Light',
    // marginBottom: 10,
    marginLeft: 10,
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 400, // 바텀시트 높이 (추후 조정 가능)
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C212A',
    fontFamily: 'Pretendard-Black',
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
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Black',
  },
  confirmButton: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    paddingVertical: 18,
    borderWidth: 2,
    borderColor: 'rgba(137, 175, 248, 0.75)',
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(58, 131, 227, 1)',
    fontFamily: 'Pretendard-Black',
  },
});
