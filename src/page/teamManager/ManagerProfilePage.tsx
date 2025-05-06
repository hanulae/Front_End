import {NavigationProp} from '@react-navigation/native';
import DefaultLayout from '../../layout/DefaultLayout';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Typo from '../../components/common/Typo';
import CustomButton from '../../components/common/CustomButton';
import {useState} from 'react';
import PhoneAuthSheet from '../../components/manager/PhoneAuthSheet';

interface IManagerProfilePageProps {
  navigation: NavigationProp<any>;
}

const ManagerProfilePage = ({navigation}: IManagerProfilePageProps) => {
  const [showPhoneAuthSheet, setShowPhoneAuthSheet] = useState(false);
  const goToModifyUserInfo = () => {
    setShowPhoneAuthSheet(true);
  };
  const goToEstimateList = () => {
    navigation.navigate('EstimateList');
  };
  const goToPointHistory = () => {
    console.log('Point History');
  };
  const goToPointRefund = () => {
    console.log('Point Refund');
  };
  const goToAppSetting = () => {
    console.log('App Setting');
  };
  const goToCallHistory = () => {
    navigation.navigate('CallHistory');
  };

  return (
    <DefaultLayout headerShown={false}>
      <View style={styles.wrapper}>
        <View style={styles.infoContainer}>
          <Typo style={styles.greetingText}>반갑습니다!</Typo>
          <Typo style={styles.nameText}>홍길동 팀장님</Typo>
          <Typo style={styles.pointText}>100,000 Point</Typo>
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton onPress={goToModifyUserInfo} style={styles.button}>
            <Typo style={styles.buttonText}>개인정보 수정</Typo>
          </CustomButton>
          <CustomButton onPress={goToEstimateList} style={styles.button}>
            <Typo style={styles.buttonText}>견적 리스트</Typo>
          </CustomButton>
          <CustomButton onPress={goToCallHistory} style={styles.button}>
            <Typo style={styles.buttonText}>출동 내역</Typo>
          </CustomButton>
          <CustomButton onPress={goToPointHistory} style={styles.button}>
            <Typo style={styles.buttonText}>포인트 내역</Typo>
          </CustomButton>
          <CustomButton onPress={goToPointRefund} style={styles.button}>
            <Typo style={styles.buttonText}>포인트 환급</Typo>
          </CustomButton>
          <CustomButton onPress={goToAppSetting} style={styles.button}>
            <Typo style={styles.buttonText}>앱 설정</Typo>
          </CustomButton>
        </View>
        <PhoneAuthSheet
          visible={showPhoneAuthSheet}
          onClose={() => setShowPhoneAuthSheet(false)}
          navigation={navigation}
        />
      </View>
    </DefaultLayout>
  );
};

export default ManagerProfilePage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  infoContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  greetingText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  pointText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F7CFF',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    backgroundColor: '#eee',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
});
