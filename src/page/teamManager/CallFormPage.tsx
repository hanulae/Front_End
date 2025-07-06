import {NavigationProp, useNavigation, RouteProp, useRoute} from '@react-navigation/native';
import {StyleSheet, TouchableOpacity, View, TextInput, Alert, ScrollView} from 'react-native';
import {usePhoneInput} from '../../hooks/input/usePhoneInput';
import Typo from '../../components/common/Typo';
import {Input} from '../../components/common/input/Input';
import ManagerLayout from '../../layout/ManagerLayout';
import { useState, useMemo } from 'react';
import { useManagerDispatchRequest } from '../../hooks/useManagerDispatchRequest';
import Toast from 'react-native-toast-message';
import DaumPostcodeModal from '../../components/common/DaumPostcodeModal';

// 라우터 파라미터 타입 정의
type CallFormRouteParams = {
  managerFormBidId: string;
  managerFormId: string;
  funeralId: string;
};

const CallFormPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<{params: CallFormRouteParams}, 'params'>>();

  // 전화번호 입력
  const familyPhone = usePhoneInput();
  const managerPhone = usePhoneInput();
  const emergencyPhone = usePhoneInput();

  // 주소 상태
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [showPostcodeModal, setShowPostcodeModal] = useState(false);

  // 출동 신청 훅
  const { loading, error, createManagerDispatchRequest } = useManagerDispatchRequest();

  // 이전 페이지에서 받아온 데이터
  const { managerFormBidId, managerFormId, funeralId } = route.params || {};

  // 버튼 활성화 상태 계산
  const isFormValid = useMemo(() => {
    return address.trim() !== '' && managerPhone.value.trim() !== '';
  }, [address, managerPhone.value]);

  const handleAddressSearch = () => {
    setShowPostcodeModal(true);
  };

  const handleAddressSelected = (postcodeData: any) => {
    // 도로명주소가 있으면 도로명주소 사용, 없으면 지번주소 사용
    const selectedAddress = postcodeData?.roadAddress ||
                            postcodeData?.jibunAddress ||
                            postcodeData?.address ||
                            postcodeData?.autoRoadAddress ||
                            postcodeData?.autoJibunAddress;

    if (selectedAddress) {
      setAddress(selectedAddress);

      // 모달 닫기 (성공적으로 주소가 설정되었으므로)
      setShowPostcodeModal(false);
    } else {
      // 에러 토스트 표시
      Toast.show({
        type: 'error',
        text1: '주소 선택에 실패했습니다.',
        text2: '다시 시도해주세요.',
        position: 'top',
        topOffset: 0,
      });
    }
  };

  const handleAddressDetailChange = (text: string) => {
    setAddressDetail(text);
  };

  // 입력값 검즘
  const validateInputs = () => {
    if (!address) {
      Toast.show({
        type: 'error',
        text1: '(필수) 주소를 입력해주세요.',
        position: 'top',
        topOffset: 0,
      });
      return false;
    }

    if (!managerPhone.value) {
      Toast.show({
        type: 'error',
        text1: '(필수) 상조 팀장 연락처를 입력해주세요.',
        position: 'top',
        topOffset: 0,
      });
      return false;
    }

    return true;
  };

  // 출동 신청 확인 alert
  const showConfirmDialog = () => {
    Alert.alert(
      '출동신청',
      '해당 내용으로 출동신청하시겠습니까?',
      [
        {
          text: '출동신청',
          onPress: () => handleDispatchRequest(),
        },
        {
          text: '취소',
          style: 'cancel',
        },
      ],
    );
  };

  // 출동 신청 처리 
  const handleDispatchRequest = async () => {
    // 추후 출동 신청 시 모달을 통해 확인하는 프로세스 추가 고려
    // 1. 입력값 검증
    if (!validateInputs()) {
      return;
    }

    // 2. API 호출용 데이터 구성
    const dispatchRequestData = {
      managerFormBidId: managerFormBidId,
      managerFormId: managerFormId,
      funeralId: funeralId,
      address: address,
      addressDetail: addressDetail || undefined,
      famPhoneNumber: familyPhone.value || undefined, // 선택
      managerPhoneNumber: managerPhone.value,
      emergencyPhoneNumber: emergencyPhone.value || undefined, // 선택
    };

    // 3. API 호출
    const result = await createManagerDispatchRequest(dispatchRequestData);

    // 4. 결과 처리
    if (result && result.data?.dispatchRequestId) {
      Toast.show({
        type: 'success',
        text1: '출동 신청이 완료되었습니다.',
        position: 'top',
        topOffset: 0,
      });
      // 출동 신청 완료 후 출동 진행 페이지로 이동 (dispatchRequestId를 callId로 전달)
      navigation.reset({
        index: 2,
        routes: [
          {name: 'ManagerMain'}, // 메인 화면
          {name: 'CallHistory'}, // 출동 신청 내역 화면
          {
            name: 'ProceedCall',
            params: {
              callId: result.data.dispatchRequestId,
            }, // 출동 진행 내역 상세 페이지 (거래 확정 페이지)
          },
        ],
      });
    } else {
      Toast.show({
        type: 'error',
        text1: (error || '출동 신청에 실패했습니다. 다시 시도해주세요.'),
        position: 'top',
        topOffset: 0,
      });
    }
  };

  return (
    <ManagerLayout
      headerShown={true}
      headerTitle="출동 신청서"
      color="white"
      homeButton={true}
      homeRouteName="ManagerMain"
      logoutButton={false}>
    
    <View style={styles.container}>
      {/* 스크롤 가능한 콘텐츠 영역 */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 주소 입력 */}
        <View style={styles.section}>
          <Typo fontSize={16} style={styles.label}>
            주소 입력 *
          </Typo>
          <View style={styles.addressContainer}>
            <View style={styles.addressRow}>
              <View style={styles.addressBox}>
                <Typo style={[
                  styles.addressText,
                  address && { color: '#000' }
                ]}>
                  {address || '주소를 검색해주세요'}
                </Typo>
              </View>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleAddressSearch}>
                <Typo style={styles.searchButtonText}>주소검색</Typo>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* 상세주소 입력 */}
          <TextInput
            style={styles.addressDetailInput}
            placeholder="상세주소를 입력해주세요"
            value={addressDetail}
            onChangeText={handleAddressDetailChange}
          />
        </View>

        {/* 연락처 입력 */}
        <View style={styles.bottomSection}>
          <Typo style={styles.label}>가족 연락처 (선택)</Typo>
          <Input
            input={familyPhone}
            placeholder="가족 연락처를 입력해주세요."
            type="number"
          />

          <Typo style={styles.label}>상조 팀장 연락처 (필수)</Typo>
          <Input
            input={managerPhone}
            placeholder="상조 팀장 연락처를 입력해주세요."
            type="number"
          />

          <Typo style={styles.label}>비상 연락처 (선택)</Typo>
          <Input
            input={emergencyPhone}
            placeholder="비상 연락처를 입력해주세요."
            type="number"
          />
        </View>
      </ScrollView>

      {/* 고정된 버튼 영역 */}
      <View style={styles.fixedBottomContainer}>
        <TouchableOpacity 
          style={[
            styles.nextButton,
            (!isFormValid || loading) && styles.disabledButton
          ]} 
          onPress={showConfirmDialog}
          disabled={!isFormValid || loading}
        >
          <Typo style={[
            styles.nextButtonText,
            (!isFormValid || loading) && styles.disabledButtonText
          ]}>
            {loading ? '신청 중...' : 
             !isFormValid ? '필수 정보를 입력해주세요' : 
             '출동 신청'}
          </Typo>
        </TouchableOpacity>
      </View>
    </View>

    {/* 주소검색 모달 */}
    <DaumPostcodeModal
      visible={showPostcodeModal}
      onClose={() => setShowPostcodeModal(false)}
      onSelected={handleAddressSelected}
    />

    <Toast />
  </ManagerLayout>
);
};

export default CallFormPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  section: {
    flexDirection: 'column',
    gap: 8,
  },
  addressContainer: {
    flexDirection: 'column',
  },
  bottomSection: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 24,
  },
  fixedBottomContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  nextButton: {
    backgroundColor: '#2D81F1',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
  
  // 기존 스타일들...
  label: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard-Bold',
    marginLeft: 10,
    marginBottom: 16,
    marginTop: 16,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressBox: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#F5F6F8',
    borderRadius: 8,
    justifyContent: 'center',
  },
  addressText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(175, 179, 187, 0.5)',
    fontFamily: 'Pretendard-Black',
  },
  addressDetailInput: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#F5F6F8',
    borderRadius: 8,
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    marginBottom: 24,
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: '#8990A0',
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  searchButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Pretendard-Black',
  },
});
