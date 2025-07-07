import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StyleSheet, TextInput, View, useWindowDimensions, ScrollView} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import Typo from '../../components/common/Typo';
import {useCallback, useEffect, useState} from 'react';
import CustomButton from '../../components/common/CustomButton';  
import { useFuneralDispatch } from '../../hooks/useFuneralDispatch';
import Toast from 'react-native-toast-message';
import { DispatchDetail } from '../../services/api/funeral/funeralDispatchService';

const DispatchRequestDetailPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute();
  const {dispatchRequestId} = route.params as {dispatchRequestId: string};
  const {loading, error, fetchDispatchDetail, approveDispatch} = useFuneralDispatch();
  const [dispatchDetail, setDispatchDetail] = useState<DispatchDetail | null>(null);
  
  // 반응형 디자인을 위한 윈도우 크기 감지
  const {width} = useWindowDimensions();
  
  // 디바이스 크기에 따른 스타일 계산
  const getResponsiveStyles = () => {
    const isSmallDevice = width < 350;
    const isMediumDevice = width >= 350 && width < 400;
    
    return {
      horizontalPadding: isSmallDevice ? 15 : isMediumDevice ? 20 : 25,
      verticalPadding: isSmallDevice ? 15 : isMediumDevice ? 20 : 25,
      fontSize: isSmallDevice ? 16 : isMediumDevice ? 18 : 20,
      inputHeight: isSmallDevice ? 45 : isMediumDevice ? 50 : 55,
      buttonHeight: isSmallDevice ? 45 : isMediumDevice ? 50 : 55,
    };
  };
  
  const responsiveStyles = getResponsiveStyles();

  // 출동 요청 상세 데이터 로드
  const loadDispatchDetail = useCallback(async () => {
    try {
      const result = await fetchDispatchDetail(dispatchRequestId);
      console.log('loadDispatchDetail result', result);
      if (result) {
        setDispatchDetail(result);
        console.log('출동 요청 상세 데이터 로드 성공:', result);
      } else {
        console.log('❌ 출동 요청 상세 데이터 로드 실패 - 빈 데이터');
        setDispatchDetail(null);
      }
    } catch (err) {
      console.error('💥 출동 요청 상세 데이터 로드 에러:', err);
      setDispatchDetail(null);
    }
  }, [fetchDispatchDetail, dispatchRequestId]);

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

  // handle Dispatch Confirm
  const handleDispatchConfirm = async () => {
    try {
      console.log('출동 승인 요청 시작:', dispatchRequestId);

      const success = await approveDispatch(dispatchRequestId);

      if (success) {
        console.log('출동 승인 요청 성공');
        Toast.show({
          type: 'success',
          text1: '출동 승인이 완료되었습니다.',
          position: 'top',
          topOffset: 0,
        });

        // 거래 확정 페이지로 이동
        navigation.reset({
          index: 2,
          routes: [
            { name: 'FuneralMain'},
            { name: 'PendingDispatch' },
            {
              name: 'ConfirmTransaction', params: {
            dispatchRequestId: dispatchRequestId,
            dispatchDetail: dispatchDetail,
          }}],
        });
        navigation.navigate('ConfirmTransaction', {
          dispatchRequestId: dispatchRequestId,
          dispatchDetail: dispatchDetail,
        });
      } else {
        console.log('출동 승인 요청 실패');
        Toast.show({
          type: 'error',
          text1: '출동 승인에 실패했습니다.',
          position: 'top',
          topOffset: 0,
        });
      }
    } catch (err) {
      console.error('출동 승인 에러:', err);
      Toast.show({
        type: 'error',
        text1: '출동 승인 중 오류가 발생했습니다.',
        position: 'top',
        topOffset: 0,
      });
    }
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
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* <View style={styles.detailContainer}>
            <Typo style={styles.titleText}>상주이름</Typo>
            <TextInput
              value={clientInfo.name}
              editable={false}
              style={styles.input}
            />
          </View> */}
          <View style={[styles.detailContainer, {paddingHorizontal: responsiveStyles.horizontalPadding, paddingVertical: responsiveStyles.verticalPadding}]}>
            <Typo style={[styles.titleText, {fontSize: responsiveStyles.fontSize}]}>주소</Typo>
            <TextInput
              value={dispatchDetail?.address || ''}
              editable={false}
              style={[styles.input, {height: responsiveStyles.inputHeight}]}
            />
            <TextInput
              value={dispatchDetail?.addressDetail || ''}
              placeholder={!dispatchDetail?.addressDetail ? '작성하지 않은 항목' : ''}
              placeholderTextColor="#AFB3BB"
              editable={false}
              style={[
                styles.input2,
                {height: responsiveStyles.inputHeight},
                !dispatchDetail?.addressDetail && styles.inputEmpty,
              ]}
            />
          </View>
          <View style={[styles.detailContainer, {paddingHorizontal: responsiveStyles.horizontalPadding, paddingVertical: responsiveStyles.verticalPadding}]}>
            <Typo style={[styles.titleText, {fontSize: responsiveStyles.fontSize}]}>가족연락처</Typo>
            <TextInput
              value={dispatchDetail?.famPhoneNumber || ''}
              placeholder={!dispatchDetail?.famPhoneNumber ? '작성하지 않은 항목' : ''}
              placeholderTextColor="#AFB3BB"
              editable={false}
              style={[
                styles.input,
                {height: responsiveStyles.inputHeight},
                !dispatchDetail?.famPhoneNumber && styles.inputEmpty,
              ]}
            />
          </View>
          <View style={[styles.detailContainer, {paddingHorizontal: responsiveStyles.horizontalPadding, paddingVertical: responsiveStyles.verticalPadding}]}>
            <Typo style={[styles.titleText, {fontSize: responsiveStyles.fontSize}]}>팀장연락처</Typo>
            <TextInput
              value={dispatchDetail?.managerPhoneNumber || ''}
              editable={false}
              style={[styles.input, {height: responsiveStyles.inputHeight}]}
            />
          </View>
          <View style={[styles.detailContainer, {paddingHorizontal: responsiveStyles.horizontalPadding, paddingVertical: responsiveStyles.verticalPadding}]}>
            <Typo style={[styles.titleText, {fontSize: responsiveStyles.fontSize}]}>비상연락처</Typo>
            <TextInput
              value={dispatchDetail?.emergencyPhoneNumber || ''}
              placeholder={!dispatchDetail?.emergencyPhoneNumber ? '작성하지 않은 항목' : ''}
              placeholderTextColor="#AFB3BB"
              editable={false}
              style={[
                styles.input,
                {height: responsiveStyles.inputHeight},
                !dispatchDetail?.emergencyPhoneNumber && styles.inputEmpty,
              ]}
            />
          </View>
        </ScrollView>
        <View style={[styles.buttonContainer, {paddingHorizontal: responsiveStyles.horizontalPadding}]}>
          <CustomButton 
            style={[styles.button, {height: responsiveStyles.buttonHeight}, loading && styles.buttonDisabled]} 
            onPress={handleDispatchConfirm}
            disabled={loading}
          >
            <Typo style={styles.buttonText}>
              {loading ? '승인 중...' : '출동 승인'}
            </Typo>
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 24,
    paddingTop: 16,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E8EB',
  },
  button: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#2D81F1',
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '700',
    fontFamily: 'Pretendard-Black',
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
