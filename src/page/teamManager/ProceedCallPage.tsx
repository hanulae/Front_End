import {
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import Typo from '../../components/common/Typo';
import ManagerLayout from '../../layout/ManagerLayout';
import SMSIcon from '../../assets/Attachment/Attach_SMSActive.svg';
import PhoneIcon from '../../assets/Attachment/Attach_PhoneDisable.svg';
import {isValidPhoneNumber} from '../../util/validation';

const ProceedCallPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  // const {callId} = route.params as {callId: number};
  // console.log('callId:', callId);
  const {callId, status} = route.params as {callId: number; status: string};
  const handleMessage = () => {
    console.log('문자 보내기');
  };

  const handleCall = () => {
    console.log('전화 걸기');
  };

  const handleConfirm = () => {
    navigation.goBack();
  };

  const handleCancel = () => {
    console.log('취소');
  };
  return (
    <ManagerLayout
      headerShown={true}
      headerTitle="출동 진행 내역"
      color="white"
      homeButton={true}
      homeRouteName="ManagerMain"
      logoutButton={false}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        {/* 주소 */}
        <View style={styles.section}>
          <Typo style={styles.label}>주소</Typo>
          <View style={styles.inputBox}>
            <Typo style={styles.text}>하늘시 하늘구 하늘동</Typo>
          </View>

          <Typo style={styles.label}>상세주소</Typo>
          <View style={styles.inputBox}>
            <Typo style={styles.text}>하늘 빌딩 하늘동</Typo>
          </View>

          <Typo style={styles.label}>가족 연락처</Typo>
          <View style={styles.inputBox}>
            <Typo style={styles.text}>01066668888</Typo>
          </View>

          <Typo style={styles.label}>팀장 연락처</Typo>
          <View style={styles.inputBox}>
            <Typo style={styles.text}>01066668888</Typo>
          </View>

          <Typo style={styles.label}>비상 연락처</Typo>
          <View style={styles.inputBox}>
            <Typo style={styles.text}>01029292999</Typo>
          </View>
        </View>

        {/* 문자/전화 버튼 */}
        {status !== '완료' && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.messageButton}
              onPress={handleMessage}>
              <SMSIcon width={18} height={18} />
              <Typo style={styles.messageIconButtonText}>문자</Typo>
            </TouchableOpacity>
            <TouchableOpacity style={styles.phoneButton} onPress={handleCall}>
              <PhoneIcon width={18} height={18} />
              <Typo style={styles.phoneIconButtonText}>전화</Typo>
            </TouchableOpacity>
          </View>
        )}

        {/* 거래확정/취소 버튼 */}
        {status === '완료' ? (
          <View style={styles.bottomButtons}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}>
              <Typo style={styles.confirmButtonText}>확인</Typo>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.bottomButtons}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}>
              <Typo style={styles.confirmButtonText}>거래확정</Typo>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}>
              <Typo style={styles.cancelButtonText}>취소</Typo>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ManagerLayout>
  );
};

export default ProceedCallPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard-Light',
    marginLeft: 10,
    marginBottom: 16,
    marginTop: 16,
  },
  inputBox: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 8,
    // marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    gap: 10,
  },
  messageButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    flex: 1,
    backgroundColor: 'rgba(226, 242, 255, 0.5)',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  phoneButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    flex: 1,
    backgroundColor: 'rgba(250, 250, 251, 0.75)',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  // iconButtonText: {
  //   fontWeight: 'bold',
  //   fontSize: 16,
  //   color: '#666',
  // },
  messageIconButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D81F1',
    fontFamily: 'Pretendard-Bold',
  },
  phoneIconButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8990A0',
    fontFamily: 'Pretendard-Bold',
  },
  bottomButtons: {
    marginTop: 'auto',
  },
  confirmButton: {
    backgroundColor: '#2D81F1',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2D81F1',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#2D81F1',
    fontWeight: 'bold',
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(175, 179, 187, 0.5)',
    fontFamily: 'Pretendard-Black',
  },
});
