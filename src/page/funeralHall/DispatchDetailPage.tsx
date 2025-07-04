import {StyleSheet, TextInput, View, ActivityIndicator} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import {useRoute} from '@react-navigation/native';
import Typo from '../../components/common/Typo';
import {useState, useEffect} from 'react';
import {useFuneralDispatch} from '../../hooks/useFuneralDispatch';
import {DispatchDetail} from '../../services/api/funeral/funeralDispatchService';

const DispatchDetailPage = () => {
  const route = useRoute();
  const {dispatchRequestId, chiefMournerName} = route.params as {dispatchRequestId: string, chiefMournerName: string};
  const {dispatchDetail, loading, error, fetchDispatchDetail} = useFuneralDispatch();
  const [detailData, setDetailData] = useState<DispatchDetail | null>(null);

  // 데이터 로드
  useEffect(() => {
    if (dispatchRequestId) {
      fetchDispatchDetail(dispatchRequestId);
    }
  }, [dispatchRequestId, fetchDispatchDetail]);

  // dispatchDetail 상태 업데이트
  useEffect(() => {
    setDetailData(dispatchDetail);
  }, [dispatchDetail]);

  if (loading) {
    return (
      <FuneralLayout
        top={true}
        headerShown={true}
        headerTitle="출동 내역 상세"
        color="#FFFFFF"
        backButtonVisible={false}
        homeButton={false}
        closeButton={true}
        homeRouteName="FuneralMain">
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2D81F1" />
          <Typo style={styles.loadingText}>출동 상세 정보를 불러오는 중...</Typo>
        </View>
      </FuneralLayout>
    );
  }

  if (error || !detailData) {
    return (
      <FuneralLayout
        top={true}
        headerShown={true}
        headerTitle={`${chiefMournerName} 출동 내역 상세`}
        color="#FFFFFF"
        backButtonVisible={false}
        homeButton={false}
        closeButton={true}
        homeRouteName="FuneralMain">
        <View style={styles.centerContainer}>
          <Typo style={styles.errorText}>⚠️ {error || '정보를 불러올 수 없습니다'}</Typo>
          <Typo style={styles.retryText} onPress={() => fetchDispatchDetail(dispatchRequestId)}>
            다시 시도
          </Typo>
        </View>
      </FuneralLayout>
    );
  }

  return (
    <FuneralLayout
      top={true}
      headerShown={true}
      headerTitle={`${chiefMournerName}님 출동 내역 상세`}
      color="#FFFFFF"
      backButtonVisible={false}
      homeButton={false}
      closeButton={true}
      homeRouteName="FuneralMain">
      <View style={styles.wrapper}>
        {/* <View style={styles.detailContainer}>
          <Typo style={styles.titleText}>출동 요청 ID</Typo>
          <TextInput
            value={detailData.dispatchRequestId}
            editable={false}
            style={styles.input}
          />
        </View> */}
        <View style={styles.detailContainer}>
          <Typo style={styles.titleText}>주소</Typo>
          <TextInput
            value={detailData.address}
            editable={false}
            style={styles.input}
          />
          {detailData.addressDetail && (
            <TextInput
              value={detailData.addressDetail}
              editable={false}
              style={styles.input2}
            />
          )}
        </View>
        <View style={styles.detailContainer}>
          <Typo style={styles.titleText}>가족연락처</Typo>
          <TextInput
            value={detailData.famPhoneNumber || '정보없음'}
            editable={false}
            style={styles.input}
          />
        </View>
        <View style={styles.detailContainer}>
          <Typo style={styles.titleText}>팀장연락처</Typo>
          <TextInput
            value={detailData.managerPhoneNumber}
            editable={false}
            style={styles.input}
          />
        </View>
        <View style={styles.detailContainer}>
          <Typo style={styles.titleText}>비상연락처</Typo>
          <TextInput
            value={detailData.emergencyPhoneNumber || '정보없음'}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#2D81F1',
  },
  errorText: {
    color: '#721C24',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryText: {
    color: '#2D81F1',
    textDecorationLine: 'underline',
  },
});
