import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StyleSheet, TextInput, View} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import Typo from '../../components/common/Typo';
import {useState} from 'react';
import CustomButton from '../../components/common/CustomButton';

const DispatchRequestDetailPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [clientInfo, setClientInfo] = useState({
    name: '',
    address: '',
    familyContact: '',
    familyContact2: '',
    teamLeaderContact: '',
    emergencyContact: '',
  });

  // 고객 출동 상세 내역 조회 API
  // 추후 작성.

  // handle Dispatch Confirm
  const handleDispatchConfirm = () => {
    // 출동 승인 요청 서버 전송.
    console.log('Dispatch Confirm');
    // 출동 승인 요청 성공 시 확정 페이지로 이동.
  };

  return (
    <FuneralLayout
      top={true}
      headerShown={true}
      headerTitle="출동 요청 상세"
      backButtonVisible={true}
      homeButton={true}
      homeRouteName="FuneralMain"
      color="white">
      <View style={styles.wrapper}>
        {/* <View style={styles.detailContainer}>
          <Typo style={styles.titleText}>상주이름</Typo>
          <TextInput
            value={clientInfo.name}
            editable={false}
            style={styles.input}
          />
        </View> */}
        <View style={styles.detailContainer}>
          <Typo style={styles.titleText}>주소</Typo>
          <TextInput
            value={clientInfo.address}
            editable={false}
            style={styles.input}
          />
          <TextInput
            value={clientInfo.familyContact2}
            editable={false}
            style={styles.input2}
          />
        </View>
        <View style={styles.detailContainer}>
          <Typo style={styles.titleText}>가족연락처</Typo>
          <TextInput
            value={clientInfo.familyContact}
            editable={false}
            style={styles.input}
          />
        </View>
        <View style={styles.detailContainer}>
          <Typo style={styles.titleText}>팀장연락처</Typo>
          <TextInput
            value={clientInfo.teamLeaderContact}
            editable={false}
            style={styles.input}
          />
        </View>
        <View style={styles.detailContainer}>
          <Typo style={styles.titleText}>비상연락처</Typo>
          <TextInput
            value={clientInfo.emergencyContact}
            editable={false}
            style={styles.input}
          />
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton style={styles.button} onPress={handleDispatchConfirm}>
            <Typo style={styles.buttonText}>출동 승인</Typo>
          </CustomButton>
        </View>
      </View>
    </FuneralLayout>
  );
};

export default DispatchRequestDetailPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    // padding: 16,
  },
  detailContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  titleText: {
    fontSize: 18,
    marginLeft: 20,
    fontWeight: '700',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
    marginBottom: 10,
  },
  input: {
    alignSelf: 'stretch',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F5F6F8',
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: 'Pretendard-Black',
    marginHorizontal: 10,
  },
  input2: {
    alignSelf: 'stretch',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F5F6F8',
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: 'Pretendard-Black',
    marginTop: 10,
    marginHorizontal: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  button: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#2D81F1',
    paddingVertical: 18,
    // paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '700',
    fontFamily: 'Pretendard-Black',
  },
});
