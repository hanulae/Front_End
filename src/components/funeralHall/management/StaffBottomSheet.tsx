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
import {useInputBase} from '../../../hooks/input/useInputBase';
import {FuneralInput} from '../../common/input/FuneralInput';
import CustomButton from '../../common/CustomButton';
import CheckCircleOffIcon from '../../../assets/Check/Check01=Check01_default.svg';
import CheckCircleOnIcon from '../../../assets/Check/Check01=Check01_Active.svg';
import CloseIcon from '../../../assets/Icon/Icon_BtnClose01.svg';
import Toast from 'react-native-toast-message'; // 상단 import 필요
import api from '../../../api/config';

//Bsk add imports
import {getUserInfo} from '../../../utils/tokenStorage';

interface IPermissions {
  room_management: boolean;
  info_edit: boolean;
  dispatch_history: boolean;
  dispatch_pending: boolean;
  estimate_history: boolean;
  app_settings: boolean;
  point_history: boolean;
}

interface IStaff {
  staffId: string;
  staffName: string;
  staffGrade: string;
  staffPhoneNumber: string;
  staffPassword: string;
  permissions: IPermissions[];
}

const PERMISSION_LABELS: {
  label: string;
  key: keyof IPermissions;
}[] = [
  {label: '호실 관리', key: 'room_management'},
  {label: '장례식장 정보 수정', key: 'info_edit'},
  {label: '지난 출동 내역', key: 'dispatch_history'},
  {label: '출동 대기 내역', key: 'dispatch_pending'},
  {label: '견적 내역', key: 'estimate_history'},
  {label: '앱 설정', key: 'app_settings'},
  {label: '포인트 내역', key: 'point_history'},
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
    point_history: false,
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

  const [signupInfo, setSignupInfo] = useState({
    phoneNumber: '',
    isPhoneVerified: false,
  });

  const phoneNumberInput = useInputBase();
  const authCode = useInputBase();
  const staffGrade = useInputBase();
  const staffName = useInputBase();
  const staffPhoneNumber = useInputBase();
  const staffPassword = useInputBase();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const info = await getUserInfo();
      console.log('🚀 ~ fetchUserInfo ~ info:', info);
      if (info && info.data && info.data.funeralPhoneNumber) {
        phoneNumberInput.onChangeText(info.data.funeralPhoneNumber);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (mode === 'edit' && _staff) {
      console.log('Editing staff:', _staff);
      console.log('Current permissions:', _staff.permissions);
      // 직원 데이터를 폼 필드에 채우기
      staffName.onChangeText(_staff.staffName);
      staffGrade.onChangeText(_staff.staffGrade);
      staffPhoneNumber.onChangeText(_staff.staffPhoneNumber);
      staffPassword.onChangeText(_staff.staffPassword);

      // 권한 데이터 설정
      setPermissions(_staff.permissions[0]);
      console.log('Permissions set:', _staff.permissions);
    } else if (mode === 'add') {
      staffPassword.onChangeText('funeral1234');
    }
  }, [mode, _staff]);

  // 인증 요청 함수
  const handleRequestCode = async () => {
    const phone = phoneNumberInput.value.replace(/-/g, '').trim();

    if (!phone || phone.length < 10) {
      Toast.show({
        type: 'error',
        text1: '입력 오류',
        text2: '유효한 전화번호를 입력해주세요.',
        position: 'top',
      });
      return;
    }

    try {
      const res = await api.post('/funeral/sms/send/staff', {
        funeralPhone: phone,
      });
      console.log('📨 인증번호 전송 성공:', res.data);

      Toast.show({
        type: 'success',
        text1: '인증번호가 발송되었습니다.',
        position: 'top',
      });
    } catch (error: any) {
      console.log(
        '❌ 인증번호 전송 실패:',
        error.response?.data || error.message,
      );
      Toast.show({
        type: 'error',
        text1: '인증번호 전송 실패',
        text2: error.response?.data?.message || '오류가 발생했습니다.',
        position: 'top',
      });
    }
  };

  const handleCheckPhoneNumber = async () => {
    const phone = staffPhoneNumber.value.replace(/-/g, '').trim();

    try {
      const res = await api.post('/funeral/staff/phoneVerify', {
        staffPhoneNumber: phone,
      });

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: '사용 가능한 전화번호입니다.',
          position: 'top',
        });
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        Toast.show({
          type: 'error',
          text1: '이미 사용 중인 전화번호입니다.',
          position: 'top',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: '오류가 발생했습니다.',
          text2: error.response?.data?.message || '잠시 후 다시 시도해주세요.',
          position: 'top',
        });
      }
    }
  };

  // 인증 확인 함수
  const handleVerifyCode = async () => {
    const phone = phoneNumberInput.value.replace(/-/g, '').trim();
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
      const res = await api.post('/funeral/sms/verify/staff', {
        funeralPhone: phone,
        code,
      });
      console.log('🚀 ~ handleVerifyCode ~ res:', res);

      if (res.data.verified) {
        Toast.show({
          type: 'success',
          text1: '인증 성공',
          position: 'top',
        });

        // 인증 완료 처리 필요 시 여기에서 상태 반영
        setSignupInfo(prev => ({
          ...prev,
          phoneNumber: phone,
          isPhoneVerified: true,
        }));
      } else {
        Toast.show({
          type: 'error',
          text1: '인증 실패',
          text2: '인증코드가 틀렸거나 만료되었습니다.',
          position: 'top',
        });
      }
    } catch (error: any) {
      console.log('❌ 인증 실패:', error.response?.data || error.message);
      Toast.show({
        type: 'error',
        text1: '서버 오류',
        text2: error.response?.data?.message || '잠시 후 다시 시도해주세요.',
        position: 'top',
      });
    }
  };

  const handleCreateStaff = async () => {
    console.log('handleCreateStaff called');
    if (!signupInfo.isPhoneVerified) {
      Toast.show({
        type: 'error',
        text1: '휴대전화 인증을 완료해주세요.',
        position: 'top',
      });
      return;
    }

    if (!staffName.value || !staffGrade.value) {
      Toast.show({
        type: 'error',
        text1: '이름과 직급을 입력해주세요.',
        position: 'top',
      });
      return;
    }

    try {
      let response;
      if (mode === 'edit') {
        response = await api.patch(`/funeral/staff/update/${_staff?.staffId}`, {
          funeralStaffPassword: staffPassword.value,
          funeralStaffPhoneNumber: staffPhoneNumber.value,
          funeralStaffName: staffName.value,
          funeralStaffRole: staffGrade.value,
          permissions,
          funeralPhoneNumber: phoneNumberInput.value,
        });
        console.log('🚀 ~ handleCreateStaff ~ update response:', response);
        Toast.show({
          type: 'success',
          text1: '직원이 수정되었습니다.',
          position: 'top',
        });
      } else {
        response = await api.post('/funeral/staff/create', {
          funeralStaffPassword: staffPassword.value,
          funeralStaffPhoneNumber: staffPhoneNumber.value,
          funeralStaffName: staffName.value,
          funeralStaffRole: staffGrade.value,
          permissions,
          funeralPhoneNumber: phoneNumberInput.value,
        });
        console.log('🚀 ~ handleCreateStaff ~ create response:', response);
        Toast.show({
          type: 'success',
          text1: '직원이 등록되었습니다.',
          position: 'top',
        });
      }

      onConfirm(); // 모달 닫기
    } catch (error: any) {
      console.log(
        '직원 생성/수정 실패:',
        error.response?.data || error.message,
      );
      Toast.show({
        type: 'error',
        text1: '직원 등록/수정 실패',
        text2: error.response?.data?.message || '오류가 발생했습니다.',
        position: 'top',
      });
      // ❌ 모달 닫지 않음
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <Pressable style={styles.backdropTouchable} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingContainer}>
        <Animated.View style={[styles.sheet, {transform: [{translateY}]}]}>
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled>
            <View style={styles.titleContainer}>
              <Typo style={styles.titleText}>
                {mode === 'edit' ? '장례식장 직원 수정' : '장례식장 직원 등록'}
              </Typo>
              <Pressable onPress={onClose}>
                <CloseIcon />
              </Pressable>
            </View>
            <View style={styles.phoneBoxContainer}>
              <Typo style={styles.phoneBoxText}>{phoneNumberInput.value}</Typo>
            </View>
            <CustomButton onPress={handleRequestCode} style={styles.button}>
              <Typo style={styles.buttonText}>인증코드요청</Typo>
            </CustomButton>
            <View style={styles.inputContainer}>
              <Typo style={styles.inputTitle}>인증코드</Typo>
              <FuneralInput
                input={authCode}
                placeholder="인증코드를 입력하세요"
              />
              <CustomButton
                onPress={handleVerifyCode}
                style={styles.checkButton}>
                <Typo style={styles.checkButtonText}>인증번호확인</Typo>
              </CustomButton>
            </View>
            <View style={styles.inputContainer}>
              <Typo style={styles.inputTitle}>직원 휴대전화번호</Typo>
              <FuneralInput
                input={staffPhoneNumber}
                placeholder="휴대전화번호을 입력하세요"
              />
              <CustomButton
                onPress={handleCheckPhoneNumber}
                style={styles.checkButton}>
                <Typo style={styles.checkButtonText}>
                  직원 휴대전화 중복 체크
                </Typo>
              </CustomButton>
            </View>
            <View style={styles.inputContainer}>
              <Typo style={styles.inputTitle}>직원 비밀번호</Typo>
              <FuneralInput
                input={staffPassword}
                placeholder="비밀번호을 입력하세요"
              />
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
            <View style={styles.inputContainer}>
              <Typo style={styles.inputTitle}>접근 권한</Typo>
              <View style={styles.permissionContainer}>
                {Array.from({length: 4}).map((_, rowIndex) => {
                  const permissionsInRow = PERMISSION_LABELS.slice(
                    rowIndex * 2,
                    rowIndex * 2 + 2,
                  );
                  const isLastRow = rowIndex === 3;
                  const hasSingleButton = permissionsInRow.length === 1;

                  return (
                    <View key={rowIndex} style={styles.permissionRow}>
                      {permissionsInRow.map(({label, key}) => (
                        <TouchableOpacity
                          key={key}
                          style={[
                            styles.permissionButton,
                            isLastRow &&
                              hasSingleButton &&
                              styles.singlePermissionButton,
                          ]}
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
                  );
                })}
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <Pressable
                onPress={handleCreateStaff}
                style={styles.confirmButton}>
                <Typo style={styles.confirmText}>
                  {mode === 'edit' ? '수정' : '등록'}
                </Typo>
              </Pressable>
            </View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
      <Toast />
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
  backdropTouchable: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  keyboardAvoidingContainer: {
    width: '100%',
    flex: 1,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    // flex: 1,
    flexGrow: 0,
  },
  scrollContent: {
    paddingBottom: 40,
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
  singlePermissionButton: {
    flex: 0.45, // 전체 너비의 절반만 차지
    alignSelf: 'flex-start', // 왼쪽 정렬
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
  phoneBoxContainer: {
    width: '100%',
    backgroundColor: '#F5F6F8',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  phoneBoxText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    fontFamily: 'Pretendard-Medium',
  },
});
