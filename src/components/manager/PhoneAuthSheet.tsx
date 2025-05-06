import {useEffect, useRef} from 'react';
import {Animated, Dimensions, Pressable, StyleSheet, View} from 'react-native';
import {usePhoneInput} from '../../hooks/input/usePhoneInput';
import {useInputBase} from '../../hooks/input/useInputBase';
import {NavigationProp} from '@react-navigation/native';
import {Input} from '../common/input/Input';
import Typo from '../common/Typo';
import CustomButton from '../common/CustomButton';
import CloseIcon from '../../assets/Icon/Icon_BtnClose01.svg';
const screenHeight = Dimensions.get('window').height;

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

  const confirmCode = () => {
    // 인증 코드를 확인하는 로직.
    // 인증 요청에 성공하면 개인정보수정페이지로 이동.
    try {
      // api 호출은 일단 생략
      // 우선은 개인정보 페이지로 이동하는 로직만 작성
      navigation.navigate('ModifyUserInfo');
      onClose();
    } catch (error) {
      console.error('인증 코드 확인 실패:', error);
    }
  };

  const handleRequestCode = () => {
    // 인증 코드 요청 로직
    console.log('인증 코드 요청:', phoneNumber.value);
  };

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) {
    return null;
  }
  return (
    <>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View
        style={[styles.sheetContainer, {transform: [{translateY}]}]}>
        <View style={styles.placeholder}>
          <View style={styles.header}>
            <Typo fontSize={20}>전화번호 인증</Typo>
            <Pressable onPress={onClose}>
              <CloseIcon />
            </Pressable>
          </View>
          <View style={styles.authSection}>
            <Input input={phoneNumber} placeholder="전화번호를 입력하세요." />
            <CustomButton
              onPress={handleRequestCode}
              style={styles.requestButton}>
              <Typo color="white" fontSize={14} style={{fontWeight: '700'}}>
                인증코드요청
              </Typo>
            </CustomButton>
          </View>
          <View style={styles.authSection}>
            <Input input={authCode} placeholder="인증코드를 입력하세요." />
          </View>
          <View style={styles.authSection}>
            <CustomButton onPress={confirmCode} style={styles.confirmButton}>
              <Typo color="white" fontSize={14} style={{fontWeight: '700'}}>
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
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 360, // 바텀시트 높이 (추후 조정 가능)
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
    marginBottom: 20,
  },
  authSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  requestButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    paddingVertical: 18,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    paddingVertical: 18,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
});
