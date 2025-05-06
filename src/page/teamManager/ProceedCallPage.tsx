import {
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import Typo from '../../components/common/Typo';

const ProceedCallPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  // const {callId} = route.params as {callId: number};
  // console.log('callId:', callId);
  const handleMessage = () => {
    console.log('문자 보내기');
  };

  const handleCall = () => {
    console.log('전화 걸기');
  };

  const handleConfirm = () => {
    console.log('거래확정');
  };

  const handleCancel = () => {
    console.log('취소');
  };
  return (
    <DefaultLayout
      headerShown={true}
      headerTitle="출동 진행 내역"
      homeButton={true}
      homeRouteName="ManagerMain"
      logoutButton={false}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        {/* 주소 */}
        <View style={styles.section}>
          <Typo style={styles.label}>주소</Typo>
          <View style={styles.inputBox}>
            <Typo>하늘시 하늘구 하늘동</Typo>
          </View>

          <Typo style={styles.label}>상세주소</Typo>
          <View style={styles.inputBox}>
            <Typo>하늘 빌딩 하늘동</Typo>
          </View>

          <Typo style={styles.label}>가족 연락처</Typo>
          <View style={styles.inputBox}>
            <Typo>01066668888</Typo>
          </View>

          <Typo style={styles.label}>팀장 연락처</Typo>
          <View style={styles.inputBox}>
            <Typo>01066668888</Typo>
          </View>

          <Typo style={styles.label}>비상 연락처</Typo>
          <View style={styles.inputBox}>
            <Typo>01029292999</Typo>
          </View>
        </View>

        {/* 문자/전화 버튼 */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.iconButton} onPress={handleMessage}>
            <Typo style={styles.iconButtonText}>문자</Typo>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleCall}>
            <Typo style={styles.iconButtonText}>전화</Typo>
          </TouchableOpacity>
        </View>

        {/* 거래확정/취소 버튼 */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}>
            <Typo style={styles.confirmButtonText}>거래확정</Typo>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Typo style={styles.cancelButtonText}>취소</Typo>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </DefaultLayout>
  );
};

export default ProceedCallPage;

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputBox: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  iconButton: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  iconButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#666',
  },
  bottomButtons: {
    marginTop: 'auto',
  },
  confirmButton: {
    backgroundColor: '#4F7CFF',
    paddingVertical: 14,
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
    borderColor: '#4F7CFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4F7CFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
