import {ScrollView, StyleSheet, TextInput, View} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import Typo from '../../components/common/Typo';
import CustomButton from '../../components/common/CustomButton';
import {useCallback, useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import { useFuneralDispatch } from '../../hooks/useFuneralDispatch';
import { DispatchDetail, FuneralHallInfo } from '../../services/api/funeral/funeralDispatchService';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const ConfirmTransactionPage = () => {
  const route = useRoute();
  const {dispatchRequestId} = route.params as {dispatchRequestId: string};
  const {loading, error, fetchDispatchDetail, fetchFuneralHallInfo, confirmTransaction} = useFuneralDispatch();
  const [dispatchDetail, setDispatchDetail] = useState<DispatchDetail | null>(null);
  const [funeralHallInfo, setFuneralHallInfo] = useState<FuneralHallInfo | null>(null);

  const loadFuneralHallInfo = useCallback(async (managerFormBidId: string) => {
    if (!managerFormBidId) {
      console.log('❌ managerFormBidId가 없어서 장례식장 정보를 로드할 수 없습니다.');
      return;
    }
    
    try {
      const result = await fetchFuneralHallInfo(managerFormBidId);
      console.log('loadFuneralHallInfo result', result);
      if (result) {
        setFuneralHallInfo(result);
        console.log('Funeral Hall Info 로드 성공:', result);
      } else {
        console.log('❌ Funeral Hall Info 로드 실패 - 빈 데이터');
        setFuneralHallInfo(null);
      }
    } catch (err) {
      console.error('💥 Funeral Hall Info 로드 에러:', err);
      setFuneralHallInfo(null);
    }
  }, [fetchFuneralHallInfo]);

  // 출동 요청 상세 데이터 로드
  const loadDispatchDetail = useCallback(async () => {
    try {
      const result = await fetchDispatchDetail(dispatchRequestId);
      console.log('loadDispatchDetail result', result);
      if (result) {
        setDispatchDetail(result);
        console.log('출동 요청 상세 데이터 로드 성공:', result);
        
        // 출동 상세 데이터 로드 완료 후 장례식장 정보 로드
        if (result.managerFormBidId) {
          await loadFuneralHallInfo(result.managerFormBidId);
        }
      } else {
        console.log('❌ 출동 요청 상세 데이터 로드 실패 - 빈 데이터');
        setDispatchDetail(null);
      }
    } catch (err) {
      console.error('💥 출동 요청 상세 데이터 로드 에러:', err);
      setDispatchDetail(null);
    }
  }, [fetchDispatchDetail, dispatchRequestId, loadFuneralHallInfo]);

  // 페이지 포커스 시 데이터 로드
  useFocusEffect(
    useCallback(() => {
      loadDispatchDetail();
    }, [loadDispatchDetail])
  );

  // 에러 발생 시 토스트 표시
  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'top',
        topOffset: 0,
      });
    }
  }, [error]);

  // handle Transaction Confirm
  const handleTransactionConfirm = async () => {
    try {
      console.log('거래 확정 요청 시작:', dispatchRequestId);
      
      const result = await confirmTransaction(dispatchRequestId);
      
      if (result && result.success) {
        console.log('거래 확정 요청 성공:', result);
        Toast.show({
          type: 'success',
          text1: result.message || '거래 확정이 완료되었습니다.',
          position: 'top',
          topOffset: 0,
        });
        
        // 거래 확정 완료 후 메인 페이지로 이동하거나 다른 처리
        // navigation.navigate('FuneralMain');
      } else {
        console.log('거래 확정 요청 실패:', result);
        const errorMessage = result?.message || '거래 확정에 실패했습니다.';
        Toast.show({
          type: 'error',
          text1: errorMessage,
          position: 'top',
          topOffset: 0,
        });
      }
    } catch (err: any) {
      console.error('거래 확정 에러:', err);
      console.log('🔍 에러 전체 객체:', JSON.stringify(err, null, 2));
      
      // 서버에서 온 구체적인 에러 메시지 추출
      let errorMessage = '거래 확정 중 오류가 발생했습니다.';
      
      if (err.response?.data?.message) {
        // 서버에서 JSON 형태로 에러 메시지를 보낸 경우
        errorMessage = err.response.data.message;
        console.log('🔍 서버 에러 메시지:', errorMessage);
      } else if (err.message) {
        // Error 객체의 message 속성
        errorMessage = err.message;
        console.log('🔍 Error 객체 메시지:', errorMessage);
      }
      
      console.log('🔍 최종 에러 메시지:', errorMessage);
      Toast.show({
        type: 'error',
        text1: errorMessage,
        position: 'top',
        topOffset: 0,
      });
    }
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
              value={dispatchDetail?.address || ''}
              editable={false}
              style={styles.input}
            />
            <TextInput
              value={dispatchDetail?.addressDetail || ''}
              placeholder={!dispatchDetail?.addressDetail ? '작성하지 않은 항목' : ''}
              placeholderTextColor="#AFB3BB"
              editable={false}
              style={[
                styles.input2,
                !dispatchDetail?.addressDetail && styles.inputEmpty,
              ]}
            />
          </View>
          <View style={styles.topInfoContainer}>
            <Typo style={styles.topText}>가족연락처</Typo>
            <TextInput
              value={dispatchDetail?.famPhoneNumber || ''}
              placeholder={!dispatchDetail?.famPhoneNumber ? '작성하지 않은 항목' : ''}
              placeholderTextColor="#AFB3BB"
              editable={false}
              style={[
                styles.input,
                !dispatchDetail?.famPhoneNumber && styles.inputEmpty,
              ]}
            />
          </View>
          <View style={styles.topInfoContainer}>
            <Typo style={styles.topText}>팀장연락처</Typo>
            <TextInput
              value={dispatchDetail?.managerPhoneNumber || ''}
              editable={false}
              style={styles.input}
            />
          </View>
          <View style={styles.topInfoContainer}>
            <Typo style={styles.topText}>비상연락처</Typo>
            <TextInput
              value={dispatchDetail?.emergencyPhoneNumber || ''}
              placeholder={!dispatchDetail?.emergencyPhoneNumber ? '작성하지 않은 항목' : ''}
              placeholderTextColor="#AFB3BB"
              editable={false}
              style={[
                styles.input,
                !dispatchDetail?.emergencyPhoneNumber && styles.inputEmpty,
              ]}
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
              <Typo style={styles.bottomValueText}>{funeralHallInfo?.funeralHallName || ''}</Typo>
            </View>
            <View style={styles.bottomInfoContainer}>
              <Typo style={styles.bottomInfoText}>식장지불금액 + 호실 사용료</Typo>
              <Typo style={styles.bottomValueText}>{(funeralHallInfo?.funeralHallPrice || 0) + (funeralHallInfo?.funeralHallDetailPrice || 0)} 만원</Typo>
            </View>
            <View style={styles.bottomInfoContainer}>
              <Typo style={styles.bottomInfoText}>제안 최종 가격</Typo>
              <Typo style={styles.bottomValueText2}>{funeralHallInfo?.proponentMoney || ''} 만원</Typo>
            </View>
            <View style={styles.bottomInfoContainer}>
              <Typo style={styles.bottomInfoText}>할인율</Typo>
              <Typo style={styles.bottomValueText}>{funeralHallInfo?.discount ?? ''} %</Typo>
            </View>
          </View>
          <CustomButton
            onPress={handleTransactionConfirm}
            style={[styles.button, loading && styles.buttonDisabled]}
            disabled={loading}>
            <Typo style={styles.buttonText}>
              {loading ? '확정 중...' : '거래확정'}
            </Typo>
          </CustomButton>
        </View>
      </View>
      <Toast />
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
  inputEmpty: {
    alignSelf: 'stretch',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F5F6F8',
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: 'Pretendard-Black',
    marginHorizontal: 10,
    color: '#AFB3BB', // 흐린 글씨 색상
  },
  buttonDisabled: {
    backgroundColor: '#AFB3BB',
  },
});
