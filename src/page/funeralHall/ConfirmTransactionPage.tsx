import {ScrollView, StyleSheet, TextInput, View} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import Typo from '../../components/common/Typo';
import CustomButton from '../../components/common/CustomButton';
import {useState} from 'react';

const ConfirmTransactionPage = () => {
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

  // handle Transaction Confirm
  const handleTransactionConfirm = () => {
    // 거래 확정 요청 서버 전송.
    console.log('Transaction Confirm');
    // 거래 확정 요청 성공 시 확정 페이지로 이동.
  };
  return (
    <FuneralLayout
      top={true}
      headerShown={true}
      headerTitle="거래 확정"
      color="white"
      backButtonVisible={true}
      homeButton={true}
      homeRouteName="FuneralMain">
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.topTitleContainer}>
            <Typo style={styles.titleText}>출동정보</Typo>
          </View>
          <View style={styles.topInfoContainer}>
            <Typo style={styles.topText}>주소</Typo>
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
          <View style={styles.topInfoContainer}>
            <Typo style={styles.topText}>가족연락처</Typo>
            <TextInput
              value={clientInfo.familyContact}
              editable={false}
              style={styles.input}
            />
          </View>
          <View style={styles.topInfoContainer}>
            <Typo style={styles.topText}>팀장연락처</Typo>
            <TextInput
              value={clientInfo.teamLeaderContact}
              editable={false}
              style={styles.input}
            />
          </View>
          <View style={styles.topInfoContainer}>
            <Typo style={styles.topText}>비상연락처</Typo>
            <TextInput
              value={clientInfo.emergencyContact}
              editable={false}
              style={styles.input}
            />
          </View>
        </ScrollView>
        <View style={styles.bottomContainer}>
          <View style={styles.bottomTitleContainer}>
            <Typo style={styles.titleText}>견적요약</Typo>
          </View>
          <View style={styles.bottomInfo}>
            <View style={styles.bottomInfoContainer}>
              <Typo style={styles.bottomInfoText}>호실</Typo>
              <Typo style={styles.bottomValueText}>1호실</Typo>
            </View>
            <View style={styles.bottomInfoContainer}>
              <Typo style={styles.bottomInfoText}>평수</Typo>
              <Typo style={styles.bottomValueText}>70평</Typo>
            </View>
            <View style={styles.bottomInfoContainer}>
              <Typo style={styles.bottomInfoText}>수용인원</Typo>
              <Typo style={styles.bottomValueText}>100명</Typo>
            </View>
            <View style={styles.bottomInfoContainer}>
              <Typo style={styles.bottomInfoText}>최종가격</Typo>
              <Typo style={styles.bottomValueText2}>500 만원</Typo>
            </View>
          </View>
          <CustomButton
            onPress={handleTransactionConfirm}
            style={styles.button}>
            <Typo style={styles.buttonText}>거래확정</Typo>
          </CustomButton>
        </View>
      </View>
    </FuneralLayout>
  );
};

export default ConfirmTransactionPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  topTitleContainer: {
    paddingBottom: 20,
  },
  topInfoContainer: {
    marginBottom: 20,
  },
  topText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },
  input: {
    marginTop: 10,
    alignSelf: 'stretch',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F5F6F8',
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: 'Pretendard-Black',
    // marginHorizontal: 10,
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
    // marginHorizontal: 10,
  },
  bottomContainer: {
    flexDirection: 'column',
    paddingHorizontal: 30,
    paddingTop: 20,
    borderTopWidth: 5,
    borderTopColor: '#F5F6F8',
  },
  bottomTitleContainer: {},
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D81F1',
    fontFamily: 'Pretendard-Black',
  },
  bottomInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  bottomInfo: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  bottomInfoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },
  bottomValueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },
  bottomValueText2: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F04452',
    fontFamily: 'Pretendard-Black',
  },
  button: {
    borderRadius: 10,
    backgroundColor: '#2D81F1',
    paddingVertical: 18,
    marginBottom: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Black',
    textAlign: 'center',
  },
});
