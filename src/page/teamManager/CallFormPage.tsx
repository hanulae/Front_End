import {NavigationProp, useNavigation, RouteProp, useRoute} from '@react-navigation/native';
import {StyleSheet, TouchableOpacity, View, TextInput, Alert, ScrollView, useWindowDimensions} from 'react-native';
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
  const { width: screenWidth } = useWindowDimensions();

  // 디바이스 크기에 따른 반응형 계산
  const isTablet = screenWidth >= 768;
  const isSmallDevice = screenWidth < 375;

  // 반응형 크기 계산
  const responsiveSizes = useMemo(() => ({
    // 텍스트 크기
    labelFontSize: isTablet ? 18 : isSmallDevice ? 14 : 16,
    inputFontSize: isTablet ? 18 : isSmallDevice ? 14 : 16,
    buttonFontSize: isTablet ? 18 : isSmallDevice ? 14 : 16,
    searchButtonFontSize: isTablet ? 16 : isSmallDevice ? 13 : 15,

    // 패딩과 마진
    horizontalPadding: isTablet ? 28 : isSmallDevice ? 12 : 16,
    verticalPadding: isTablet ? 24 : isSmallDevice ? 12 : 16,
    inputPadding: isTablet ? 24 : isSmallDevice ? 14 : 18,
    inputHorizontalPadding: isTablet ? 28 : isSmallDevice ? 16 : 20,
    searchButtonPadding: isTablet ? 32 : isSmallDevice ? 20 : 24,
    labelMarginLeft: isTablet ? 14 : isSmallDevice ? 8 : 10,
    labelMarginVertical: isTablet ? 20 : isSmallDevice ? 12 : 16,

    // 높이와 간격
    buttonHeight: isTablet ? 24 : isSmallDevice ? 14 : 18,
    minHeight: isTablet ? 64 : isSmallDevice ? 48 : 54,
    sectionGap: isTablet ? 12 : isSmallDevice ? 6 : 8,
    bottomSectionGap: isTablet ? 12 : isSmallDevice ? 6 : 8,
    marginBottom: isTablet ? 32 : isSmallDevice ? 20 : 24,

    // 테두리 반경
    borderRadius: isTablet ? 12 : isSmallDevice ? 6 : 8,
    searchButtonRadius: isTablet ? 14 : isSmallDevice ? 8 : 10,
  }), [isTablet, isSmallDevice]);

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

    if (!addressDetail) {
      Toast.show({
        type: 'error',
        text1: '(필수) 상세주소를 입력해주세요.',
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

  // 동적 스타일 생성
  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: responsiveSizes.horizontalPadding,
      paddingBottom: responsiveSizes.verticalPadding,
    },
    section: {
      flexDirection: 'column',
      gap: responsiveSizes.sectionGap,
    },
    addressContainer: {
      flexDirection: 'column',
    },
    bottomSection: {
      flexDirection: 'column',
      gap: responsiveSizes.bottomSectionGap,
      marginBottom: responsiveSizes.marginBottom,
    },
    fixedBottomContainer: {
      backgroundColor: 'white',
      paddingHorizontal: responsiveSizes.horizontalPadding,
      paddingBottom: responsiveSizes.verticalPadding,
      paddingTop: responsiveSizes.verticalPadding,
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
    },
    nextButton: {
      backgroundColor: '#2D81F1',
      paddingVertical: responsiveSizes.buttonHeight,
      borderRadius: responsiveSizes.borderRadius,
      alignItems: 'center',
      minHeight: responsiveSizes.minHeight,
    },
    nextButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: responsiveSizes.buttonFontSize,
    },
    disabledButton: {
      backgroundColor: '#D1D5DB',
    },
    disabledButtonText: {
      color: '#9CA3AF',
    },
    label: {
      fontSize: responsiveSizes.labelFontSize,
      fontWeight: '600',
      fontFamily: 'Pretendard-Bold',
      marginLeft: responsiveSizes.labelMarginLeft,
      marginBottom: responsiveSizes.labelMarginVertical,
      marginTop: responsiveSizes.labelMarginVertical,
    },
    addressRow: {
      flexDirection: isTablet ? 'row' : screenWidth < 400 ? 'column' : 'row',
      alignItems: isTablet ? 'center' : screenWidth < 400 ? 'stretch' : 'center',
      marginBottom: responsiveSizes.verticalPadding,
      gap: isTablet ? 12 : screenWidth < 400 ? 8 : 8,
    },
    addressBox: {
      flex: isTablet ? 1 : screenWidth < 400 ? 0 : 1,
      paddingVertical: responsiveSizes.inputPadding,
      paddingHorizontal: responsiveSizes.inputHorizontalPadding,
      backgroundColor: '#F5F6F8',
      borderRadius: responsiveSizes.borderRadius,
      justifyContent: 'center',
      minHeight: responsiveSizes.minHeight,
    },
    addressText: {
      fontSize: responsiveSizes.inputFontSize,
      fontWeight: '500',
      color: 'rgba(175, 179, 187, 0.5)',
      fontFamily: 'Pretendard-Black',
    },
    addressDetailInput: {
      paddingVertical: responsiveSizes.inputPadding,
      paddingHorizontal: responsiveSizes.inputHorizontalPadding,
      backgroundColor: '#F5F6F8',
      borderRadius: responsiveSizes.borderRadius,
      fontSize: responsiveSizes.inputFontSize,
      fontFamily: 'Pretendard-Regular',
      marginBottom: responsiveSizes.marginBottom,
      minHeight: responsiveSizes.minHeight,
    },
    searchButton: {
      marginLeft: isTablet ? 12 : screenWidth < 400 ? 0 : 8,
      backgroundColor: '#8990A0',
      borderRadius: responsiveSizes.searchButtonRadius,
      paddingVertical: responsiveSizes.inputPadding,
      paddingHorizontal: responsiveSizes.searchButtonPadding,
      minHeight: responsiveSizes.minHeight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchButtonText: {
      fontSize: responsiveSizes.searchButtonFontSize,
      fontWeight: '600',
      color: '#fff',
      fontFamily: 'Pretendard-Black',
    },
  }), [responsiveSizes, screenWidth, isTablet]);

  return (
    <ManagerLayout
      headerShown={true}
      headerTitle="출동 신청서"
      color="white"
      homeButton={true}
      homeRouteName="ManagerMain"
      logoutButton={false}>
    
    <View style={dynamicStyles.container}>
      {/* 스크롤 가능한 콘텐츠 영역 */}
      <ScrollView 
        style={dynamicStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={dynamicStyles.scrollContent}
      >
        {/* 주소 입력 */}
        <View style={dynamicStyles.section}>
          <Typo fontSize={responsiveSizes.labelFontSize} style={dynamicStyles.label}>
            주소 입력 *
          </Typo>
          <View style={dynamicStyles.addressContainer}>
            <View style={dynamicStyles.addressRow}>
              <View style={dynamicStyles.addressBox}>
                <Typo style={[
                  dynamicStyles.addressText,
                  address && { color: '#000' }
                ]}>
                  {address || '주소를 검색해주세요'}
                </Typo>
              </View>
              <TouchableOpacity
                style={dynamicStyles.searchButton}
                onPress={handleAddressSearch}>
                <Typo style={dynamicStyles.searchButtonText}>주소검색</Typo>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* 상세주소 입력 */}
          <TextInput
            style={dynamicStyles.addressDetailInput}
            placeholder="상세주소를 입력해주세요"
            value={addressDetail}
            onChangeText={handleAddressDetailChange}
          />
        </View>

        {/* 연락처 입력 */}
        <View style={dynamicStyles.bottomSection}>
          <Typo style={dynamicStyles.label}>가족 연락처 (선택)</Typo>
          <Input
            input={familyPhone}
            placeholder="가족 연락처를 입력해주세요."
            type="number"
          />

          <Typo style={dynamicStyles.label}>상조 팀장 연락처 (필수)</Typo>
          <Input
            input={managerPhone}
            placeholder="상조 팀장 연락처를 입력해주세요."
            type="number"
          />

          <Typo style={dynamicStyles.label}>비상 연락처 (선택)</Typo>
          <Input
            input={emergencyPhone}
            placeholder="비상 연락처를 입력해주세요."
            type="number"
          />
        </View>
      </ScrollView>

      {/* 고정된 버튼 영역 */}
      <View style={dynamicStyles.fixedBottomContainer}>
        <TouchableOpacity 
          style={[
            dynamicStyles.nextButton,
            (!isFormValid || loading) && dynamicStyles.disabledButton
          ]} 
          onPress={showConfirmDialog}
          disabled={!isFormValid || loading}
        >
          <Typo style={[
            dynamicStyles.nextButtonText,
            (!isFormValid || loading) && dynamicStyles.disabledButtonText
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
