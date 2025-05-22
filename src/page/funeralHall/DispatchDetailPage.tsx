import {StyleSheet, TextInput, View} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import {useRoute} from '@react-navigation/native';
import Typo from '../../components/common/Typo';
import {FuneralInput} from '../../components/common/input/FuneralInput';
import {useState} from 'react';

const DispatchDetailPage = () => {
  const route = useRoute();
  const {name} = route.params as {name: string};
  const [clientInfo, setClientInfo] = useState({
    name: '',
    address: '',
    familyContact: '',
    teamLeaderContact: '',
    emergencyContact: '',
  });

  // 고객 출동 내역 조회 API
  // 추후 작성.

  return (
    <FuneralLayout
      top={true}
      headerShown={true}
      headerTitle={`${name} 고객님 출동 내역`}
      color="#FFFFFF"
      backButtonVisible={false}
      homeButton={false}
      closeButton={true}
      homeRouteName="FuneralMain">
      <View style={styles.wrapper}>
        <View style={styles.detailContainer}>
          <Typo style={styles.titleText}>상주이름</Typo>
          <TextInput
            value={clientInfo.name}
            editable={false}
            style={styles.input}
          />
        </View>
        <View style={styles.detailContainer}>
          <Typo style={styles.titleText}>주소</Typo>
          <TextInput
            value={clientInfo.address}
            editable={false}
            style={styles.input}
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
      </View>
    </FuneralLayout>
  );
};

export default DispatchDetailPage;

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(243, 245, 248, 1)',
    flex: 1,
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
});
