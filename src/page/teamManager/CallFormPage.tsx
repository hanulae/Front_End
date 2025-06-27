import {NavigationProp, useNavigation, RouteProp, useRoute} from '@react-navigation/native';
import {StyleSheet, TouchableOpacity, View, TextInput} from 'react-native';
import {usePhoneInput} from '../../hooks/input/usePhoneInput';
import Typo from '../../components/common/Typo';
import {Input} from '../../components/common/input/Input';
import ManagerLayout from '../../layout/ManagerLayout';
import { useState } from 'react';
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
        text1: '주소를 입력해주세요.',
        position: 'top',
        topOffset: 0,
      });
      return false;
    }

    if (!managerPhone.value) {
      Toast.show({
        type: 'error',
        text1: '상조 팀장 연락처를 입력해주세요.',
        position: 'top',
        topOffset: 0,
      });
      return false;
    }

    return true;
  }

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
      navigation.navigate('ProceedCall', {
        callId: result.data.dispatchRequestId,
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
      {/* 출동 신청서 내용 */}
      <View style={styles.wrapper}>
        {/* 주소 입력 */}
        <View style={styles.section}>
          <Typo fontSize={16} style={styles.label}>
            주소 입력
          </Typo>
          <View style={styles.container}>
            <View style={styles.addressRow}>
              <View style={styles.addressBox}>
                <Typo style={[
                  styles.addressText,
                  address && { color: '#000' } // 주소가 있으면 검은색으로
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
          <Typo style={styles.label}>가족 연락처</Typo>
          <Input
            input={familyPhone}
            placeholder="가족 연락처를 입력해주세요."
            type="number"
          />

          <Typo style={styles.label}>상조 팀장 연락처</Typo>
          <Input
            input={managerPhone}
            placeholder="상조 팀장 연락처를 입력해주세요."
            type="number"
          />

          <Typo style={styles.label}>비상 연락처</Typo>
          <Input
            input={emergencyPhone}
            placeholder="비상 연락처를 입력해주세요."
            type="number"
          />
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={[
              styles.nextButton,
              loading && { opacity: 0.5 } // 로딩 중일 때 반투명
            ]} 
            onPress={handleDispatchRequest}
            disabled={loading} // 로딩 중일 때 비활성화
          >
            <Typo style={styles.nextButtonText}>
              {loading ? '신청 중...' : '출동 신청'}
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
  wrapper: {
    // flexGrow: 1,
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  section: {
    flexDirection: 'column',
    gap: 8,
  },
  bottomSection: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 24,
  },
  container: {
    // flex: 1,
    flexDirection: 'column',
    // alignSelf: 'stretch',
  },
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
  nextButton: {
    marginTop: 40,
    backgroundColor: '#2D81F1',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },

  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
