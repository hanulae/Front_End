import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import Typo from '../../components/common/Typo';
import CustomButton from '../../components/common/CustomButton';
import {useCallback, useEffect, useState} from 'react';
import {
  useRoute,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import PhoneIcon from '../../assets/Attachment/Attach_PhoneDisable.svg';
import {useFuneralDispatch} from '../../hooks/useFuneralDispatch';
import {
  DispatchDetail,
  FuneralHallInfo,
  GetFuneralDispatchTransactionStatusResponse,
} from '../../services/api/funeral/funeralDispatchService';
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {isValidPhoneNumber} from '../../util/validation';

const ConfirmTransactionPage = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<any>>();
  const {dispatchRequestId} = route.params as {dispatchRequestId: string};
  const {
    loading,
    error,
    fetchDispatchDetail,
    fetchFuneralHallInfo,
    confirmTransaction,
  } = useFuneralDispatch();
  const [dispatchDetail, setDispatchDetail] = useState<DispatchDetail | null>(
    null,
  );
  const [funeralHallInfo, setFuneralHallInfo] =
    useState<FuneralHallInfo | null>(null);
  const [transactionStatus, setTransactionStatus] =
    useState<GetFuneralDispatchTransactionStatusResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const {width} = useWindowDimensions();

  // 화면 크기에 따른 반응형 스타일 계산
  const isTablet = width > 768;
  const isSmallDevice = width < 375;

  const responsiveStyles = {
    // 텍스트 크기
    titleSize: isTablet ? 20 : isSmallDevice ? 14 : 16,
    topTextSize: isTablet ? 18 : isSmallDevice ? 14 : 16,
    bottomInfoTextSize: isTablet ? 16 : isSmallDevice ? 12 : 14,
    bottomValueTextSize: isTablet ? 18 : isSmallDevice ? 14 : 16,
    buttonTextSize: isTablet ? 18 : isSmallDevice ? 14 : 16,
    inputTextSize: isTablet ? 18 : isSmallDevice ? 14 : 16,

    // 패딩 및 마진
    screenPadding: isTablet ? 32 : isSmallDevice ? 16 : 20,
    bottomContainerPadding: isTablet ? 40 : isSmallDevice ? 20 : 30,
    titleBottomPadding: isTablet ? 28 : isSmallDevice ? 16 : 20,
    infoMarginBottom: isTablet ? 28 : isSmallDevice ? 16 : 20,

    // 입력 필드
    inputHeight: isTablet ? 60 : isSmallDevice ? 44 : 50,
    inputPadding: isTablet ? 24 : isSmallDevice ? 16 : 20,
    inputTopMargin: isTablet ? 12 : isSmallDevice ? 8 : 10,

    // 버튼
    buttonPaddingVertical: isTablet ? 22 : isSmallDevice ? 14 : 18,
    buttonMarginBottom: isTablet ? 32 : isSmallDevice ? 20 : 24,

    // 간격
    bottomInfoPaddingVertical: isTablet ? 14 : isSmallDevice ? 8 : 10,
    bottomInfoPaddingTop: isTablet ? 14 : isSmallDevice ? 8 : 10,
    bottomInfoPaddingBottom: isTablet ? 28 : isSmallDevice ? 16 : 20,

    // 보더
    borderTopWidth: isTablet ? 6 : isSmallDevice ? 4 : 5,
  };

  // 현재 상태 계산 (장례식장 관점)
  const getCurrentStatus = () => {
    if (!dispatchDetail) return null;

    // transactionStatus가 있으면 거래 관련 상태 확인
    if (transactionStatus?.data) {
      const {managerTransactionCompletedAt, funeralTransactionCompletedAt} =
        transactionStatus.data;

      // 장례식장이 완료했지만 매니저가 아직 완료하지 않음
      if (funeralTransactionCompletedAt && !managerTransactionCompletedAt) {
        return 'waiting_manager_completion';
      }

      // 매니저가 완료했지만 장례식장이 아직 완료하지 않음
      if (managerTransactionCompletedAt && !funeralTransactionCompletedAt) {
        return 'waiting_funeral_completion';
      }

      // 둘 다 완료
      if (managerTransactionCompletedAt && funeralTransactionCompletedAt) {
        return 'transaction_completed';
      }
    }

    // 기본 출동 상태 (pending, approved, completed 등)
    return dispatchDetail.isApproved;
  };

  // 전화 앱 열기
  const handleCall = async (phoneNumber?: string) => {
    if (!phoneNumber) {
      Toast.show({
        text1: '연락처 정보가 없습니다.',
        type: 'error',
        position: 'top',
        topOffset: 0,
      });
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      Toast.show({
        text1: '올바르지 않은 전화번호입니다.',
        type: 'error',
        position: 'top',
        topOffset: 0,
      });
      return;
    }

    try {
      // 전화 앱을 열어서 전화번호 미리 입력
      const telUrl = `tel:${phoneNumber}`;

      const canOpen = await Linking.canOpenURL(telUrl);
      if (canOpen) {
        await Linking.openURL(telUrl);
      } else {
        Toast.show({
          text1: '전화 앱을 열 수 없습니다.',
          type: 'error',
          position: 'top',
          topOffset: 0,
        });
      }
    } catch (err) {
      console.error('전화 앱 열기 실패:', err);
      Toast.show({
        text1: '전화 앱을 열 수 없습니다.',
        type: 'error',
        position: 'top',
        topOffset: 0,
      });
    }
  };

  const loadFuneralHallInfo = useCallback(
    async (managerFormBidId: string) => {
      if (!managerFormBidId) {
        console.log(
          '❌ managerFormBidId가 없어서 장례식장 정보를 로드할 수 없습니다.',
        );
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
    },
    [fetchFuneralHallInfo],
  );

  // 출동 요청 상세 데이터 로드
  const loadDispatchDetail = useCallback(async () => {
    try {
      const result = await fetchDispatchDetail(dispatchRequestId);

      console.log('loadDispatchDetail result', result);

      if (result) {
        setDispatchDetail(result.dispatchRequest);
        setTransactionStatus(result.transactionStatus);
        console.log('출동 요청 상세 데이터 로드 성공:', result);

        // 출동 상세 데이터 로드 완료 후 장례식장 정보 로드
        if (result.dispatchRequest.managerFormBidId) {
          await loadFuneralHallInfo(result.dispatchRequest.managerFormBidId);
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
    }, [loadDispatchDetail]),
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

  // 풀 투 리프레시 핸들러
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadDispatchDetail();
      Toast.show({
        type: 'success',
        text1: '새로고침 완료',
        position: 'top',
        topOffset: 0,
      });
    } catch (err) {
      console.error('새로고침 중 오류 발생:', err);
      Toast.show({
        type: 'error',
        text1: '새로고침 중 오류가 발생했습니다.',
        position: 'top',
        topOffset: 0,
      });
    } finally {
      setRefreshing(false);
    }
  }, [loadDispatchDetail]);

  // 상태별 안내 메시지
  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          text: '출동이 승인되었습니다.',
          style: styles.approvedMessage,
        };
      case 'waiting_manager_completion':
        return {
          text: '상조팀장의 거래 완료 확인이 필요합니다.',
          style: styles.waitingMessage,
        };
      case 'waiting_funeral_completion':
        return {
          text: '거래완료 대기중 입니다. 거래를 완료해주세요.',
          style: styles.waitingMessage,
        };
      case 'transaction_completed':
        return {
          text: '거래가 성공적으로 완료되었습니다.',
          style: styles.completedMessage,
        };
      case 'completed':
        return {
          text: '거래가 성공적으로 완료되었습니다.',
          style: styles.completedMessage,
        };
      default:
        return {
          text: '상태를 확인할 수 없습니다.',
          style: styles.defaultMessage,
        };
    }
  };

  // handle Transaction Confirm
  const handleTransactionConfirm = async () => {
    try {
      console.log('거래 확정 요청 시작:', dispatchRequestId);

      const result = await confirmTransaction(dispatchRequestId);

      if (result && result.success) {
        console.log('거래 확정 요청 성공:', result);

        // 성공 시 메시지 처리
        // const statusMessage =
        //   'status' in result && result.status === 'waiting_counterpart'
        //     ? '거래 확정을 완료했습니다. 상조팀장의 거래 완료가 필요합니다.'
        //     : 'status' in result && result.status === 'completed'
        //     ? '거래가 성공적으로 완료되었습니다.'
        //     : result.message || '거래 확정이 완료되었습니다.';

        // Toast.show({
        //   type: 'success',
        //   text1: statusMessage,
        //   position: 'top',
        //   topOffset: 0,
        // });

        // 성공 시에만 데이터 새로고침
        try {
          await loadDispatchDetail();
        } catch (refreshError) {
          console.error('데이터 새로고침 실패:', refreshError);
          // 새로고침 실패해도 계속 진행
        }

        // 거래가 완전히 완료된 경우에만 뒤로가기
        if ('status' in result && result.status === 'completed') {
          setTimeout(() => {
            navigation.goBack();
          }, 1500);
        }
      } else {
        console.log('거래 확정 요청 실패:', result);
        const errorMessage = result?.message || '거래 확정에 실패했습니다.';
        
        // 캐시 부족 관련 에러 메시지 특별 처리
        const isCashInsufficientError = errorMessage.includes('캐시') || errorMessage.includes('포인트') || errorMessage.includes('부족');

        // 캐시 부족일 때는 Alert 표시
        if (isCashInsufficientError) {
          Alert.alert(
            '거래확정 불가',
            '캐시 부족으로 거래확정이 불가능합니다.\n캐시를 충전해주세요.',
            [
              {
                text: '확인',
                style: 'default',
              },
            ],
            { cancelable: false }
          );
        }

        // 에러 발생 시 현재 페이지 유지 - 네비게이션 없음
        return;
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

      // 캐시 부족 관련 에러 메시지 특별 처리
      const isCashInsufficientError = errorMessage.includes('캐시') || errorMessage.includes('포인트') || errorMessage.includes('부족') || errorMessage.includes('insufficient');
      const finalErrorMessage = isCashInsufficientError
        ? '캐시 부족으로 거래확정이 불가능합니다.\n캐시를 충전해주세요.'
        : errorMessage;

      console.log('🔍 최종 에러 메시지:', finalErrorMessage);

      // 캐시 부족일 때는 Alert 표시
      if (isCashInsufficientError) {
        Alert.alert(
          '거래확정 불가',
          '캐시 부족으로 거래확정이 불가능합니다.\n캐시를 충전해주세요.',
          [
            {
              text: '확인',
              style: 'default',
            },
          ],
          { cancelable: false }
        );
      }
      // 에러 발생 시 현재 페이지 유지 - 어떤 네비게이션도 수행하지 않음
      // 현재 상태 유지하여 사용자가 계속 거래확정 페이지에서 작업할 수 있도록 함
      return;
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  // 상태별 버튼 렌더링
  const renderActionButton = () => {
    const status = getCurrentStatus();

    switch (status) {
      case 'approved':
        // 출동 승인 상태 - 거래 확정 가능
        return (
          <CustomButton
            onPress={handleTransactionConfirm}
            style={[
              styles.button,
              loading && styles.buttonDisabled,
              {
                paddingVertical: responsiveStyles.buttonPaddingVertical,
                marginBottom: responsiveStyles.buttonMarginBottom,
              },
            ]}
            disabled={loading}>
            <Typo
              style={[
                styles.buttonText,
                {fontSize: responsiveStyles.buttonTextSize},
              ]}>
              {loading ? '거래완료 중...' : '거래완료'}
            </Typo>
          </CustomButton>
        );

      case 'waiting_manager_completion':
        // 장례식장이 거래 확정했지만 매니저가 아직 완료하지 않음
        return (
          <CustomButton
            onPress={() => {}}
            style={[
              styles.button,
              styles.buttonWaiting,
              {
                paddingVertical: responsiveStyles.buttonPaddingVertical,
                marginBottom: responsiveStyles.buttonMarginBottom,
              },
            ]}
            disabled={true}>
            <Typo
              style={[
                styles.buttonTextWaiting,
                {fontSize: responsiveStyles.buttonTextSize},
              ]}>
              상조팀장 거래완료 대기중
            </Typo>
          </CustomButton>
        );

      case 'waiting_funeral_completion':
        return (
          <CustomButton
            onPress={handleTransactionConfirm}
            style={[
              styles.button,
              loading && styles.buttonDisabled,
              {
                paddingVertical: responsiveStyles.buttonPaddingVertical,
                marginBottom: responsiveStyles.buttonMarginBottom,
              },
            ]}
            disabled={loading}>
            <Typo
              style={[
                styles.buttonText,
                {fontSize: responsiveStyles.buttonTextSize},
              ]}>
              {loading ? '거래 확정 중...' : '거래 확정'}
            </Typo>
          </CustomButton>
        );

      case 'transaction_completed':
      case 'completed':
        // 거래 완료 상태
        return (
          <CustomButton
            onPress={handleGoBack}
            style={[
              styles.button,
              styles.buttonCompleted,
              {
                paddingVertical: responsiveStyles.buttonPaddingVertical,
                marginBottom: responsiveStyles.buttonMarginBottom,
              },
            ]}>
            <Typo
              style={[
                styles.buttonTextCompleted,
                {fontSize: responsiveStyles.buttonTextSize},
              ]}>
              뒤로가기
            </Typo>
          </CustomButton>
        );

      default:
        return (
          <CustomButton
            onPress={() => {}}
            style={[
              styles.button,
              styles.buttonDisabled,
              {
                paddingVertical: responsiveStyles.buttonPaddingVertical,
                marginBottom: responsiveStyles.buttonMarginBottom,
              },
            ]}
            disabled={true}>
            <Typo
              style={[
                styles.buttonText,
                styles.buttonTextDisabled,
                {fontSize: responsiveStyles.buttonTextSize},
              ]}>
              상태 확인 중
            </Typo>
          </CustomButton>
        );
    }
  };

  // 상태 메시지 렌더링
  const renderStatusMessage = () => {
    if (!dispatchDetail) return null;

    const status = getCurrentStatus();
    if (!status) return null;

    const statusMessage = getStatusMessage(status);

    return (
      <View style={styles.statusMessageContainer}>
        <Typo style={statusMessage.style}>{statusMessage.text}</Typo>
      </View>
    );
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
        {/* 로딩 상태 */}
        {loading && !dispatchDetail && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#2D81F1" />
            <Typo style={styles.loadingText}>
              출동 신청 정보를 불러오는 중...
            </Typo>
          </View>
        )}

        {/* 에러 상태 */}
        {error && !loading && !dispatchDetail && (
          <View style={styles.centerContainer}>
            <Typo style={styles.errorText}>{error}</Typo>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadDispatchDetail}>
              <Typo style={styles.retryButtonText}>다시 시도</Typo>
            </TouchableOpacity>
          </View>
        )}

        {/* 데이터 표시 */}
        {!loading && !error && dispatchDetail && (
          <>
            <ScrollView
              contentContainerStyle={[
                styles.scrollView,
                {padding: responsiveStyles.screenPadding},
              ]}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#2D81F1']}
                  tintColor="#2D81F1"
                />
              }>
              <View
                style={[
                  styles.topTitleContainer,
                  {paddingBottom: responsiveStyles.titleBottomPadding},
                ]}>
                <Typo
                  style={[
                    styles.titleText,
                    {fontSize: responsiveStyles.titleSize},
                  ]}>
                  출동정보
                </Typo>
              </View>
              <View
                style={[
                  styles.topInfoContainer,
                  {marginBottom: responsiveStyles.infoMarginBottom},
                ]}>
                <Typo
                  style={[
                    styles.topText,
                    {fontSize: responsiveStyles.topTextSize},
                  ]}>
                  주소
                </Typo>
                <TextInput
                  value={dispatchDetail?.address || ''}
                  editable={false}
                  style={[
                    styles.input,
                    {
                      height: responsiveStyles.inputHeight,
                      paddingHorizontal: responsiveStyles.inputPadding,
                      marginTop: responsiveStyles.inputTopMargin,
                      fontSize: responsiveStyles.inputTextSize,
                    },
                  ]}
                />
                <TextInput
                  value={dispatchDetail?.addressDetail || ''}
                  placeholder={
                    !dispatchDetail?.addressDetail ? '작성하지 않은 항목' : ''
                  }
                  placeholderTextColor="#AFB3BB"
                  editable={false}
                  style={[
                    styles.input2,
                    !dispatchDetail?.addressDetail && styles.inputEmpty,
                    {
                      height: responsiveStyles.inputHeight,
                      paddingHorizontal: responsiveStyles.inputPadding,
                      marginTop: responsiveStyles.inputTopMargin,
                      fontSize: responsiveStyles.inputTextSize,
                    },
                  ]}
                />
              </View>
              <View
                style={[
                  styles.topInfoContainer,
                  {marginBottom: responsiveStyles.infoMarginBottom},
                ]}>
                <Typo
                  style={[
                    styles.topText,
                    {fontSize: responsiveStyles.topTextSize},
                  ]}>
                  가족연락처
                </Typo>
                <TextInput
                  value={dispatchDetail?.famPhoneNumber || ''}
                  placeholder={
                    !dispatchDetail?.famPhoneNumber ? '작성하지 않은 항목' : ''
                  }
                  placeholderTextColor="#AFB3BB"
                  editable={false}
                  style={[
                    styles.input,
                    !dispatchDetail?.famPhoneNumber && styles.inputEmpty,
                    {
                      height: responsiveStyles.inputHeight,
                      paddingHorizontal: responsiveStyles.inputPadding,
                      marginTop: responsiveStyles.inputTopMargin,
                      fontSize: responsiveStyles.inputTextSize,
                    },
                  ]}
                />
              </View>
              <View
                style={[
                  styles.topInfoContainer,
                  {marginBottom: responsiveStyles.infoMarginBottom},
                ]}>
                <View style={styles.labelRow}>
                  <Typo
                    style={[
                      styles.topText,
                      {fontSize: responsiveStyles.topTextSize},
                    ]}>
                    팀장연락처
                  </Typo>
                  <TouchableOpacity
                    style={[styles.inlinePhoneButton, loading && styles.disabledButton]}
                    onPress={() => handleCall(dispatchDetail?.managerPhoneNumber)}
                    disabled={loading}>
                    <PhoneIcon width={16} height={16} />
                  </TouchableOpacity>
                </View>
                <TextInput
                  value={dispatchDetail?.managerPhoneNumber || ''}
                  editable={false}
                  style={[
                    styles.input,
                    {
                      height: responsiveStyles.inputHeight,
                      paddingHorizontal: responsiveStyles.inputPadding,
                      marginTop: responsiveStyles.inputTopMargin,
                      fontSize: responsiveStyles.inputTextSize,
                    },
                  ]}
                />
              </View>
              <View
                style={[
                  styles.topInfoContainer,
                  {marginBottom: responsiveStyles.infoMarginBottom},
                ]}>
                <Typo
                  style={[
                    styles.topText,
                    {fontSize: responsiveStyles.topTextSize},
                  ]}>
                  비상연락처
                </Typo>
                <TextInput
                  value={dispatchDetail?.emergencyPhoneNumber || ''}
                  placeholder={
                    !dispatchDetail?.emergencyPhoneNumber
                      ? '작성하지 않은 항목'
                      : ''
                  }
                  placeholderTextColor="#AFB3BB"
                  editable={false}
                  style={[
                    styles.input,
                    !dispatchDetail?.emergencyPhoneNumber && styles.inputEmpty,
                    {
                      height: responsiveStyles.inputHeight,
                      paddingHorizontal: responsiveStyles.inputPadding,
                      marginTop: responsiveStyles.inputTopMargin,
                      fontSize: responsiveStyles.inputTextSize,
                    },
                  ]}
                />
              </View>
            </ScrollView>
            <View
              style={[
                styles.bottomContainer,
                {
                  paddingHorizontal: responsiveStyles.bottomContainerPadding,
                  paddingTop: responsiveStyles.titleBottomPadding,
                  borderTopWidth: responsiveStyles.borderTopWidth,
                },
              ]}>
              <View style={styles.bottomTitleContainer}>
                <Typo
                  style={[
                    styles.titleText,
                    {fontSize: responsiveStyles.titleSize},
                  ]}>
                  견적요약
                </Typo>
              </View>
              <View
                style={[
                  styles.bottomInfo,
                  {
                    paddingTop: responsiveStyles.bottomInfoPaddingTop,
                    paddingBottom: responsiveStyles.bottomInfoPaddingBottom,
                  },
                ]}>
                <View
                  style={[
                    styles.bottomInfoContainer,
                    {
                      paddingVertical:
                        responsiveStyles.bottomInfoPaddingVertical,
                    },
                  ]}>
                  <Typo
                    style={[
                      styles.bottomInfoText,
                      {fontSize: responsiveStyles.bottomInfoTextSize},
                    ]}>
                    호실
                  </Typo>
                  <Typo
                    style={[
                      styles.bottomValueText,
                      {fontSize: responsiveStyles.bottomValueTextSize},
                    ]}>
                    {funeralHallInfo?.funeralHallName || ''}
                  </Typo>
                </View>
                <View
                  style={[
                    styles.bottomInfoContainer,
                    {
                      paddingVertical:
                        responsiveStyles.bottomInfoPaddingVertical,
                    },
                  ]}>
                  <Typo
                    style={[
                      styles.bottomInfoText,
                      {fontSize: responsiveStyles.bottomInfoTextSize},
                    ]}>
                    식장지불금액 + 호실 사용료
                  </Typo>
                  <Typo
                    style={[
                      styles.bottomValueText,
                      {fontSize: responsiveStyles.bottomValueTextSize},
                    ]}>
                    {(funeralHallInfo?.funeralHallPrice || 0) +
                      (funeralHallInfo?.funeralHallDetailPrice || 0)}{' '}
                    만원
                  </Typo>
                </View>
                <View
                  style={[
                    styles.bottomInfoContainer,
                    {
                      paddingVertical:
                        responsiveStyles.bottomInfoPaddingVertical,
                    },
                  ]}>
                  <Typo
                    style={[
                      styles.bottomInfoText,
                      {fontSize: responsiveStyles.bottomInfoTextSize},
                    ]}>
                    제안 최종 가격
                  </Typo>
                  <Typo
                    style={[
                      styles.bottomValueText2,
                      {fontSize: responsiveStyles.bottomValueTextSize},
                    ]}>
                    {funeralHallInfo?.proponentMoney || ''} 만원
                  </Typo>
                </View>
                <View
                  style={[
                    styles.bottomInfoContainer,
                    {
                      paddingVertical:
                        responsiveStyles.bottomInfoPaddingVertical,
                    },
                  ]}>
                  <Typo
                    style={[
                      styles.bottomInfoText,
                      {fontSize: responsiveStyles.bottomInfoTextSize},
                    ]}>
                    할인율
                  </Typo>
                  <Typo
                    style={[
                      styles.bottomValueText,
                      {fontSize: responsiveStyles.bottomValueTextSize},
                    ]}>
                    {funeralHallInfo?.discount ?? ''} %
                  </Typo>
                </View>
              </View>
              {/* <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.phoneButton, loading && styles.disabledButton]}
                  onPress={() => handleCall(dispatchDetail.managerPhoneNumber)}
                  disabled={loading}>
                  <PhoneIcon width={18} height={18} />
                  <Typo style={styles.phoneIconButtonText}>전화</Typo>
                </TouchableOpacity>
              </View> */}
              {/* 상태 메시지 */}
              {renderStatusMessage()}

              {/* 상태별 버튼 */}
              {renderActionButton()}
            </View>
          </>
        )}

        {/* 데이터 없음 */}
        {!loading && !error && !dispatchDetail && (
          <View style={styles.centerContainer}>
            <Typo style={styles.errorText}>
              출동 신청 정보를 찾을 수 없습니다.
            </Typo>
          </View>
        )}
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
  },
  topTitleContainer: {},
  topInfoContainer: {},
  topText: {
    fontWeight: '600',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },
  input: {
    alignSelf: 'stretch',
    borderRadius: 10,
    backgroundColor: '#F5F6F8',
    fontFamily: 'Pretendard-Black',
  },
  input2: {
    alignSelf: 'stretch',
    borderRadius: 10,
    backgroundColor: '#F5F6F8',
    fontFamily: 'Pretendard-Black',
  },
  bottomContainer: {
    flexDirection: 'column',
    borderTopColor: '#F5F6F8',
  },
  bottomTitleContainer: {},
  titleText: {
    fontWeight: '600',
    color: '#2D81F1',
    fontFamily: 'Pretendard-Black',
  },
  bottomInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomInfo: {},
  bottomInfoText: {
    fontWeight: '500',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },
  bottomValueText: {
    fontWeight: '600',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },
  bottomValueText2: {
    fontWeight: '600',
    color: '#F04452',
    fontFamily: 'Pretendard-Black',
  },
  button: {
    borderRadius: 10,
    backgroundColor: '#2D81F1',
  },
  buttonText: {
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Black',
    textAlign: 'center',
  },
  inputEmpty: {
    color: '#AFB3BB',
  },
  buttonDisabled: {
    backgroundColor: '#AFB3BB',
  },
  buttonTextDisabled: {
    color: '#FFFFFF',
  },
  buttonWaiting: {
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  buttonTextWaiting: {
    fontWeight: '700',
    color: '#F57C00',
    fontFamily: 'Pretendard-Black',
    textAlign: 'center',
  },
  buttonCompleted: {
    backgroundColor: '#4CAF50',
  },
  buttonTextCompleted: {
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Black',
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Pretendard-Regular',
  },
  errorText: {
    fontSize: 16,
    color: '#F04452',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Pretendard-Regular',
  },
  retryButton: {
    backgroundColor: '#2D81F1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
  },
  statusMessageContainer: {
    marginBottom: 16,
  },
  pendingMessage: {
    fontSize: 14,
    color: '#F57C00',
    textAlign: 'center',
    fontFamily: 'Pretendard-Regular',
    lineHeight: 20,
  },
  approvedMessage: {
    fontSize: 14,
    color: '#1976D2',
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
    lineHeight: 20,
  },
  waitingMessage: {
    fontSize: 14,
    color: '#F57C00',
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
    lineHeight: 20,
  },
  completedMessage: {
    fontSize: 14,
    color: '#2E7D32',
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
    lineHeight: 20,
  },
  defaultMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Pretendard-Regular',
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    gap: 10,
  },
  phoneButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    flex: 1,
    backgroundColor: 'rgba(226, 242, 255, 0.5)',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  phoneIconButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    fontFamily: 'Pretendard-Bold',
  },
  disabledButton: {
    backgroundColor: '#f2f2f2',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 8,
  },
  inlinePhoneButton: {
    flexDirection: 'row',
    marginLeft: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  inlinePhoneButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    fontFamily: 'Pretendard-Bold',
  },
});
