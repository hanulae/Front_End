import {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Typo from '../../common/Typo';
import {IStaff} from '../../../page/funeralHall/StaffManagementPage';
import {usePhoneInput} from '../../../hooks/input/usePhoneInput';
import {useInputBase} from '../../../hooks/input/useInputBase';
import {FuneralInput} from '../../common/input/FuneralInput';
import CustomButton from '../../common/CustomButton';
import CheckCircleOffIcon from '../../../assets/Check/Check01=Check01_default.svg';
import CheckCircleOnIcon from '../../../assets/Check/Check01=Check01_Active.svg';

interface IPermissions {
  room_management: boolean;
  info_edit: boolean;
  dispatch_history: boolean;
  dispatch_pending: boolean;
  estimate_history: boolean;
  app_settings: boolean;
}

const PERMISSION_LABELS: {
  label: string;
  key: keyof IPermissions;
}[] = [
  {label: '호실 관리', key: 'room_management'},
  {label: '정보 수정', key: 'info_edit'},
  {label: '지난 출동 내역', key: 'dispatch_history'},
  {label: '출동 대기 내역', key: 'dispatch_pending'},
  {label: '견적 내역', key: 'estimate_history'},
  {label: '앱 설정', key: 'app_settings'},
];

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
  staff: _staff,
}: IStaffBottomSheetProps) => {
  const translateY = useRef(new Animated.Value(height)).current;
  console.log('mode', mode);

  const [permissions, setPermissions] = useState<IPermissions>({
    room_management: false,
    info_edit: false,
    dispatch_history: false,
    dispatch_pending: false,
    estimate_history: false,
    app_settings: false,
  });

  const togglePermission = (key: keyof IPermissions) => {
    setPermissions(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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
  }, [visible, translateY]);

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
            onStartShouldSetResponder={() => true}>
            <View style={styles.titleContainer}>
              <Typo style={styles.titleText}>직원 관리</Typo>
            </View>
            <ScrollView
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <View style={styles.inputContainer}>
                <Typo style={styles.inputTitle}>휴대전화번호</Typo>
                <FuneralInput input={phoneNumber} placeholder="휴대전화번호" />
                <CustomButton
                  onPress={() => console.log('인증번호 발송')}
                  style={styles.button}>
                  <Typo style={styles.buttonText}>인증코드요청</Typo>
                </CustomButton>
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
                <FuneralInput
                  input={staffName}
                  placeholder="이름을 입력하세요"
                />
              </View>
              <View style={styles.inputContainer}>
                <Typo style={styles.inputTitle}>접근 권한</Typo>
                <View style={styles.permissionContainer}>
                  {Array.from({length: 3}).map((_, rowIndex) => (
                    <View key={rowIndex} style={styles.permissionRow}>
                      {PERMISSION_LABELS.slice(
                        rowIndex * 2,
                        rowIndex * 2 + 2,
                      ).map(({label, key}) => (
                        <TouchableOpacity
                          key={key}
                          style={styles.permissionButton}
                          onPress={() => togglePermission(key)}>
                          <View style={styles.permissionContentWrapper}>
                            {permissions[key] ? (
                              <CheckCircleOnIcon
                                width={18}
                                height={18}
                                style={styles.permissionIcon}
                              />
                            ) : (
                              <CheckCircleOffIcon
                                width={18}
                                height={18}
                                style={styles.permissionIcon}
                              />
                            )}
                            <Typo style={styles.permissionLabelText}>
                              {label}
                            </Typo>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <Pressable onPress={onConfirm} style={styles.confirmButton}>
                  <Typo style={styles.confirmText}>등록</Typo>
                </Pressable>
              </View>
            </ScrollView>
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
    marginVertical: 16,
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  permissionContainer: {
    width: '100%',
    gap: 12,
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  permissionButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F5F6F8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E6EAF3',
  },
  permissionContentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  permissionIcon: {
    width: 18,
    height: 18,
  },
  permissionLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#283042',
    fontFamily: 'Pretendard-Medium',
    flexShrink: 1,
  },
});
