// import {useEffect, useRef} from 'react';
// import {Animated, Dimensions, Modal, StyleSheet, View} from 'react-native';
// import Typo from '../../common/Typo';

// interface IStaffBottomSheetProps {
//   visible?: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
//   mode: 'add' | 'edit' | null;
// }

// const {height} = Dimensions.get('window');
// const StaffBottomSheet = ({
//   visible,
//   onClose,
//   onConfirm,
//   mode,
// }: IStaffBottomSheetProps) => {
//   const translateY = useRef(new Animated.Value(height)).current;
//   console.log('mode', mode);
//   useEffect(() => {
//     if (visible) {
//       Animated.timing(translateY, {
//         toValue: 0,
//         duration: 200,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.timing(translateY, {
//         toValue: height,
//         duration: 200,
//         useNativeDriver: true,
//       }).start(() => onClose());
//     }
//   }, [visible]);

//   return (
//     <Modal visible={visible} transparent animationType="slide">
//       <Animated.View style={[styles.overlay, {transform: [{translateY}]}]}>
//         <View style={styles.titleContainer}>
//           <Typo style={styles.titleText}>직원 관리</Typo>
//         </View>
//         <View style={styles.inputContainer}></View>
//         <View style={styles.inputContainer}></View>
//         <View style={styles.inputContainer}></View>
//         <View style={styles.inputContainer}></View>
//         <View style={styles.buttonContainer}></View>
//       </Animated.View>
//     </Modal>
//   );
// };

// export default StaffBottomSheet;

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     // backgroundColor: 'rgba(0,0,0,0.6)',
//     justifyContent: 'flex-end',
//   },
//   titleContainer: {},
//   titleText: {
//     fontSize: 18,
//     marginLeft: 20,
//     fontWeight: '700',
//     color: '#283042',
//     fontFamily: 'Pretendard-Black',
//     marginBottom: 10,
//   },
//   inputContainer: {},
//   buttonContainer: {},
//   button: {},
//   buttonText: {},
// });

import {useEffect, useRef} from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Typo from '../../common/Typo';
import {IStaff} from '../../../page/funeralHall/StaffManagementPage';
import {usePhoneInput} from '../../../hooks/input/usePhoneInput';
import {useInputBase} from '../../../hooks/input/useInputBase';
import {FuneralInput} from '../../common/input/FuneralInput';
import CustomButton from '../../common/CustomButton';
import {check} from 'react-native-permissions';

interface IStaffBottomSheetProps {
  visible?: boolean;
  mode: 'add' | 'edit' | null;
  staff: IStaff | null;
  onClose: () => void;
  onConfirm: () => void;
}

const {height} = Dimensions.get('window');

const StaffBottomSheet = ({
  visible = false,
  onClose,
  onConfirm,
  mode,
  staff,
}: IStaffBottomSheetProps) => {
  const translateY = useRef(new Animated.Value(height)).current;
  console.log('mode', mode);
  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: height,
        duration: 200,
        useNativeDriver: true,
      }).start(() => onClose());
    }
  }, [visible]);

  const phoneNumber = usePhoneInput();
  const authCode = useInputBase();
  const staffGrade = useInputBase();
  const staffName = useInputBase();

  return (
    <Modal visible={visible} transparent animationType="none">
      <Pressable style={styles.backdrop} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{width: '100%'}}>
          <Animated.View
            style={[styles.sheet, {transform: [{translateY}]}]}
            onStartShouldSetResponder={() => true} // 바텀시트 안쪽 터치 방지
          >
            <View style={styles.titleContainer}>
              <Typo style={styles.titleText}>직원 관리</Typo>
            </View>
            <View style={styles.inputContainer}>
              <Typo style={styles.inputTitle}>휴대전화번호</Typo>
              {/* <View style={styles.phoneInputContainer}> */}
              <FuneralInput input={phoneNumber} placeholder="휴대전화번호" />
              <CustomButton
                onPress={() => console.log('인증번호 발송')}
                style={styles.button}>
                <Typo style={styles.buttonText}>인증코드요청</Typo>
              </CustomButton>
              {/* </View> */}
            </View>
            <View style={styles.inputContainer}>
              <Typo style={styles.inputTitle}>인증코드</Typo>
              <FuneralInput
                input={authCode}
                placeholder="인증코드를 입력하세요"
              />
              <CustomButton
                onPress={() => console.log('인증번호 확인')}
                style={styles.checkButton}>
                <Typo style={styles.checkButtonText}>인증번호확인</Typo>
              </CustomButton>
            </View>
            <View style={styles.inputContainer}>
              <Typo style={styles.inputTitle}>직급</Typo>
              <FuneralInput
                input={staffGrade}
                placeholder="직급을 입력하세요"
              />
            </View>
            <View style={styles.inputContainer}>
              <Typo style={styles.inputTitle}>이름</Typo>
              <FuneralInput input={staffName} placeholder="이름을 입력하세요" />
            </View>
            <View style={styles.buttonContainer}>
              <Pressable onPress={onConfirm} style={styles.confirmButton}>
                <Typo style={styles.confirmText}>등록</Typo>
              </Pressable>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

export default StaffBottomSheet;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    height: height * 0.9,
  },
  titleContainer: {
    marginBottom: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },
  inputContainer: {
    // flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 16,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    // flex: 1,
  },
  checkButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#2D81F1',
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Pretendard-Black',
  },
  checkButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D81F1',
    fontFamily: 'Pretendard-Black',
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },

  mockInput: {
    height: 48,
    backgroundColor: '#F5F6F8',
    borderRadius: 8,
    paddingHorizontal: 12,
    textAlignVertical: 'center',
    color: '#999',
  },
  buttonContainer: {
    marginTop: 24,
    flex: 1,
    justifyContent: 'flex-end',
  },
  confirmButton: {
    backgroundColor: '#3287F8',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard-Black',
  },
});
