import React, {useState, useEffect, useCallback} from 'react';
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Linking,
} from 'react-native';
import Typo from '../../components/common/Typo';
import ManagerLayout from '../../layout/ManagerLayout';
import SMSIcon from '../../assets/Attachment/Attach_SMSActive.svg';
import PhoneIcon from '../../assets/Attachment/Attach_PhoneDisable.svg';
import {isValidPhoneNumber} from '../../util/validation';
import {useManagerDispatchRequest} from '../../hooks/useManagerDispatchRequest';
import Toast from 'react-native-toast-message';
import {Alert} from 'react-native';
import {GetManagerDispatchRequestTransactionStatus} from '../../services/api/manager/managerDispatchRequestService';
import {GetManagerFormBidDetailResponse} from '../../services/api/manager/managerFormService';
import {scaleFontSize, scaleSize} from '../../utils/responsive';

const ProceedCallPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  const {callId} = route.params as {callId: string};

  console.log('dispatchRequestId: ', callId);

  // API 훅 사용
  const {
    loading,
    error,
    getManagerDispatchRequestDetail,
    cancelManagerDispatchRequest,
    completeManagerDispatchRequest,
  } = useManagerDispatchRequest();

  // 출동 신청 상세 데이터 상태
  const [dispatchDetail, setDispatchDetail] = useState<any>(null);
  const [transactionStatus, setTransactionStatus] =
    useState<GetManagerDispatchRequestTransactionStatus | null>(null);
  const [managerFormBidDetail, setManagerFormBidDetail] =
    useState<GetManagerFormBidDetailResponse | null>(null);

  console.log('!!!! dispatchDetail: ', dispatchDetail);

  // 새로고침 상태 추가
  const [refreshing, setRefreshing] = useState(false);

  // 현재 상태 계산 (dispatchDetail과 transactionStatus를 종합)
  const getCurrentStatus = () => {
    if (!dispatchDetail) return null;

    // transactionStatus가 있으면 거래 관련 상태 확인
    if (transactionStatus?.data) {
      const {managerTransactionCompletedAt, funeralTransactionCompletedAt} =
        transactionStatus.data;

      // 매니저는 완료했지만 장례식장이 아직 완료하지 않음
      if (managerTransactionCompletedAt && !funeralTransactionCompletedAt) {
        return 'waiting_funeral_completion';
      }

      // 장례식장은 완료했지만 매니저가 아직 완료하지 않음
      if (funeralTransactionCompletedAt && !managerTransactionCompletedAt) {
        return 'waiting_manager_completion';
      }

      // 둘 다 완료
      if (managerTransactionCompletedAt && funeralTransactionCompletedAt) {
        return 'transaction_completed';
      }
    }

    // 기본 출동 상태 (pending, approved, completed 등)
    return dispatchDetail.isApproved;
  };

  // 장례식장 입찰 정보 렌더링
  const renderBidInfo = () => {
    if (!managerFormBidDetail?.data) return null;

    const bidData = managerFormBidDetail.data;

    return (
      <View style={styles.bidInfoSection}>
        <View style={styles.bidInfoHeader}>
          <Typo style={styles.bidInfoTitle}>
            {bidData.funeralName} 입찰정보
          </Typo>
        </View>

        <View style={styles.bidInfoContent}>
          {/* 기본 정보 */}
          <View style={styles.bidInfoItem}>
            <Typo style={styles.bidInfoLabelText}>호실명:</Typo>
            <Typo style={styles.bidInfoValue}>{bidData.funeralHallName}</Typo>
          </View>

          <View style={styles.bidInfoItem}>
            <Typo style={styles.bidInfoLabelText}>평수:</Typo>
            <Typo style={styles.bidInfoValue}>{bidData.funeralHallSize}평</Typo>
          </View>

          <View style={styles.bidInfoItem}>
            <Typo style={styles.bidInfoLabelText}>수용인원:</Typo>
            <Typo style={styles.bidInfoValue}>
              {bidData.funeralHallNumberOfMourners}명
            </Typo>
          </View>

          <View style={styles.bidInfoItem}>
            <Typo style={styles.bidInfoLabelText}>식장지불금액:</Typo>
            <Typo style={styles.bidInfoValue}>
              {bidData.funeralHallDetailPrice}만원
            </Typo>
          </View>

          <View style={styles.bidInfoItem}>
            <Typo style={styles.bidInfoLabelText}>호실사용료:</Typo>
            <Typo style={styles.bidInfoValue}>
              {bidData.funeralHallPrice}만원
            </Typo>
          </View>

          <View style={styles.bidInfoItem}>
            <Typo style={styles.bidInfoLabelText}>
              합계 (시장지불금액 + 호실사용료):
            </Typo>
            <Typo style={[styles.bidInfoValue, styles.strikethrough]}>
              {bidData.funeralHallDetailPrice + bidData.funeralHallPrice}만원
            </Typo>
          </View>

          <View style={styles.bidInfoItem}>
            <Typo style={styles.bidInfoLabelText}>제안가:</Typo>
            <Typo style={[styles.bidInfoValue, styles.proposalPriceText]}>
              {bidData.funeralProponentMoney}만원
            </Typo>
          </View>

          <View style={styles.bidInfoItem}>
            <Typo style={styles.bidInfoLabelText}>할인율:</Typo>
            <Typo style={[styles.bidInfoValue, styles.discountRateText]}>
              {bidData.funeralDiscount}%
            </Typo>
          </View>
        </View>
      </View>
    );
  };

  // 데이터 로드
  const loadDispatchDetail = useCallback(async () => {
    try {
      const result = await getManagerDispatchRequestDetail(callId);

      console.log('!!!!result: ', result);

      if (
        result &&
        result.transactionStatus !== null &&
        result.dispatchRequest
      ) {
        setDispatchDetail(result.dispatchRequest);
        setTransactionStatus(result.transactionStatus);
        setManagerFormBidDetail(result.managerFormBidDetail);
      } else if (result && result.dispatchRequest) {
        setDispatchDetail(result.dispatchRequest);
        setManagerFormBidDetail(result.managerFormBidDetail);
      } else {
        console.log('❌ 출동 신청 상세 정보 로드 실패');
      }
    } catch (err) {
      console.error('💥 출동 신청 상세 정보 로드 에러:', err);
    }
  }, [callId, getManagerDispatchRequestDetail]);

  // 페이지 로드시 데이터 가져오기
  useEffect(() => {
    if (callId) {
      loadDispatchDetail();
    }
  }, [callId, loadDispatchDetail]);

  // 새로고침 함수
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadDispatchDetail();
      Toast.show({
        text1: '새로고침 완료',
        type: 'success',
        position: 'top',
        topOffset: 0,
      });
    } catch (error) {
      console.error('새로고침 중 오류 발생:', error);
      Toast.show({
        text1: '새로고침 실패',
        type: 'error',
        position: 'top',
        topOffset: 0,
      });
    } finally {
      setRefreshing(false);
    }
  }, [loadDispatchDetail]);

  const handleMessage = async (phoneNumber?: string) => {
    if (!phoneNumber) {
      Toast.show({
        text1: '연락처 정보가 없습니다.',
        type: 'error',
        position: 'top',
        topOffset: 0,
      });
      return;
    }

    try {
      // 출동 정보를 포함한 맞춤형 메시지 생성
      const address = dispatchDetail?.address || '주소 미확인';
      // const currentTime = new Date().toLocaleString('ko-KR', {
      //   year: 'numeric',
      //   month: '2-digit',
      //   day: '2-digit',
      //   hour: '2-digit',
      //   minute: '2-digit',
      // });

      const message = encodeURIComponent(
        `안녕하세요. 하늘애 상조팀장입니다.\n\n` +
          `출동 요청 건으로 연락드립니다.\n` +
          `📍 위치: ${address}\n` +
          `안녕하세요안녕하세요\n` +
          `문의사항이 있으시면 언제든지 연락 바랍니다.`,
      );
      const smsUrl = `sms:${phoneNumber}?body=${message}`;

      const canOpen = await Linking.canOpenURL(smsUrl);
      if (canOpen) {
        await Linking.openURL(smsUrl);
      } else {
        Toast.show({
          text1: 'SMS 앱을 열 수 없습니다.',
          type: 'error',
          position: 'top',
          topOffset: 0,
        });
      }
    } catch (error) {
      console.error('SMS 앱 열기 실패:', error);
      Toast.show({
        text1: 'SMS 앱을 열 수 없습니다.',
        type: 'error',
        position: 'top',
        topOffset: 0,
      });
    }
  };

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

  const handleConfirm = () => {
    navigation.goBack();
  };

  const handleComplete = async (dispatchRequestId: string) => {
    try {
      const result = await completeManagerDispatchRequest(dispatchRequestId);

      if (result) {
        // 성공 시 메시지 처리
        const statusMessage =
          result.status === 'waiting_counterpart'
            ? '거래 확정을 완료했습니다. 장례식장의 확인을 기다리고 있습니다.'
            : result.status === 'completed'
            ? '거래가 성공적으로 완료되었습니다!'
            : result.message;

        Toast.show({
          text1: statusMessage,
          type: 'success',
          position: 'top',
          topOffset: 0,
        });

        // 데이터 새로고침
        await loadDispatchDetail();

        // 거래가 완전히 완료된 경우에만 뒤로가기
        if (result.status === 'completed') {
          setTimeout(() => {
            navigation.goBack();
          }, 1500);
        }
      }
    } catch (err: any) {
      console.error('거래 확정 실패:', err);
      Toast.show({
        text1: err.message || '거래 확정에 실패했습니다.',
        type: 'error',
        position: 'top',
        topOffset: 0,
      });
    }
  };

  // 출동 취소 확인 대화상자 함수
  const showCancelConfirmDialog = (dispatchRequestId: string) => {
    Alert.alert(
      '출동 취소',
      '정말로 출동을 취소하시겠습니까?',
      [
        {
          text: '네',
          style: 'destructive',
          onPress: () => handleCancel(dispatchRequestId),
        },
        {
          text: '아니오',
          style: 'cancel',
          onPress: () => {
            console.log('출동 취소 - 아니오 선택');
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {
          console.log('출동 취소 대화상자 닫힘');
        },
      },
    );
  };

  const handleCancel = async (dispatchRequestId: string) => {
    try {
      const result = await cancelManagerDispatchRequest(dispatchRequestId);

      if (result) {
        Toast.show({
          text1: '출동이 취소되었습니다.',
          type: 'success',
          position: 'top',
          topOffset: 0,
        });

        // 취소 후 뒤로가기
        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      }
    } catch (err: any) {
      console.error('출동 취소 실패:', err);
      Toast.show({
        text1: err.message || '출동 취소에 실패했습니다.',
        type: 'error',
        position: 'top',
        topOffset: 0,
      });
    }
  };

  // 상태별 안내 메시지
  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          text: '장례식장의 출동 승인을 기다리고 있습니다.',
          style: styles.pendingMessage,
        };
      case 'approved':
        return {
          text: '출동이 승인되었습니다.',
          style: styles.approvedMessage,
        };
      case 'waiting_funeral_completion':
        return {
          text: '장례식장의 거래 완료 확인이 필요합니다.',
          style: styles.waitingMessage,
        };
      case 'waiting_manager_completion':
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

  // 상태별 버튼 렌더링
  const renderActionButtons = () => {
    const status = getCurrentStatus();

    switch (status) {
      case 'pending':
        // 출동 대기 상태 - 아직 액션할 수 없음
        return (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.waitingButton, loading && styles.disabledButton]}
              disabled={true} // 대기 상태에서는 비활성화
            >
              <Typo style={styles.waitingButtonText}>출동 대기 중</Typo>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, loading && styles.disabledButton]}
              onPress={() =>
                showCancelConfirmDialog(dispatchDetail.dispatchRequestId)
              }
              disabled={loading}>
              <Typo style={styles.cancelButtonText}>
                {loading ? '처리 중...' : '출동 취소'}
              </Typo>
            </TouchableOpacity>
          </View>
        );

      case 'approved':
        // 출동 승인 상태 - 이제 거래 확정 가능
        return (
          <>
            {/* 거래확정/취소 버튼 */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.confirmButton, loading && styles.disabledButton]}
                onPress={() => handleComplete(dispatchDetail.dispatchRequestId)}
                disabled={loading}>
                <Typo style={styles.confirmButtonText}>
                  {loading ? '거래완료 처리 중...' : '거래완료'}
                </Typo>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelButton, loading && styles.disabledButton]}
                onPress={() =>
                  showCancelConfirmDialog(dispatchDetail.dispatchRequestId)
                }
                disabled={loading}>
                <Typo style={styles.cancelButtonText}>출동 취소</Typo>
              </TouchableOpacity>
            </View>
          </>
        );

      case 'waiting_funeral_completion':
        // 매니저는 거래 완료했지만 장례식장이 아직 완료하지 않음
        return (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.waitingCompletionButton,
                loading && styles.disabledButton,
              ]}
              disabled={true}>
              <Typo style={styles.waitingCompletionButtonText}>
                장례식장 거래완료 대기중
              </Typo>
            </TouchableOpacity>
          </View>
        );

      case 'waiting_manager_completion':
        // 장례식장은 완료 했지만 상조팀장이 아직 완료하지 않음
        return (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.confirmButton, loading && styles.disabledButton]}
              onPress={() => handleComplete(dispatchDetail.dispatchRequestId)}
              disabled={loading}>
              <Typo style={styles.confirmButtonText}>
                {loading ? '거래완료 처리 중...' : '거래완료'}
              </Typo>
            </TouchableOpacity>
          </View>
        );

      case 'transaction_completed':
      case 'completed':
        // 거래 완료 상태
        return (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.completedButton}
              onPress={handleConfirm}>
              <Typo style={styles.completedButtonText}>뒤로가기</Typo>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  const renderStatusAndActions = () => {
    if (!dispatchDetail) return null;

    const status = getCurrentStatus();
    const statusMessage = getStatusMessage(status);

    return (
      <View style={styles.statusActionSection}>
        {/* 연락 버튼들 */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.messageButton, loading && styles.disabledButton]}
            onPress={() => handleMessage(dispatchDetail.managerPhoneNumber)}
            disabled={loading}>
            <SMSIcon width={18} height={18} />
            <Typo style={styles.messageIconButtonText}>문자</Typo>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.phoneButton, loading && styles.disabledButton]}
            onPress={() => handleCall(dispatchDetail.managerPhoneNumber)}
            disabled={loading}>
            <PhoneIcon width={18} height={18} />
            <Typo style={styles.phoneIconButtonText}>전화</Typo>
          </TouchableOpacity>
        </View>

        {/* 상태별 안내 메시지 */}
        <View style={styles.statusMessageContainer}>
          <Typo style={statusMessage.style}>{statusMessage.text}</Typo>
        </View>

        {/* 상태별 액션 버튼 */}
        {renderActionButtons()}
      </View>
    );
  };

  return (
    <ManagerLayout
      headerShown={true}
      headerTitle="출동 진행 내역"
      color="white"
      homeButton={true}
      homeRouteName="ManagerMain"
      logoutButton={false}>
      <ScrollView
        contentContainerStyle={styles.wrapper}
        showsVerticalScrollIndicator={false}
        bounces={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2D81F1']} // Android
            tintColor="#2D81F1" // iOS
            title="새로고침 중..." // iOS
          />
        }>
        {/* 로딩 상태 */}
        {loading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#2D81F1" />
            <Typo style={styles.loadingText}>
              출동 신청 정보를 불러오는 중...
            </Typo>
          </View>
        )}

        {/* 에러 상태 */}
        {error && !loading && (
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
            {/* 장례식장 입찰 정보 */}
            {renderBidInfo()}

            {/* 출동 신청서 정보 */}

            <View style={styles.dispatchHeader}>
              <Typo style={styles.dispatchTitle}>출동 신청 내용</Typo>
            </View>

            {/* 주소 정보 */}
            <View style={styles.section}>
              <Typo style={styles.label}>주소</Typo>
              <View style={styles.inputBox}>
                <Typo
                  style={[
                    styles.text,
                    dispatchDetail.address && styles.filledText,
                  ]}>
                  {dispatchDetail.address || '주소 정보 없음'}
                </Typo>
              </View>

              <Typo style={styles.label}>상세주소</Typo>
              <View style={styles.inputBox}>
                <Typo
                  style={[
                    styles.text,
                    dispatchDetail.addressDetail && styles.filledText,
                  ]}>
                  {dispatchDetail.addressDetail || '상세주소 정보 없음'}
                </Typo>
              </View>

              <Typo style={styles.label}>가족 연락처</Typo>
              <View style={styles.inputBox}>
                <Typo
                  style={[
                    styles.text,
                    dispatchDetail.famPhoneNumber && styles.filledText,
                  ]}>
                  {dispatchDetail.famPhoneNumber || '가족 연락처 정보 없음'}
                </Typo>
              </View>

              <Typo style={styles.label}>팀장 연락처</Typo>
              <View style={styles.inputBox}>
                <Typo
                  style={[
                    styles.text,
                    dispatchDetail.managerPhoneNumber && styles.filledText,
                  ]}>
                  {dispatchDetail.managerPhoneNumber || '팀장 연락처 정보 없음'}
                </Typo>
              </View>

              <Typo style={styles.label}>비상 연락처</Typo>
              <View style={styles.inputBox}>
                <Typo
                  style={[
                    styles.text,
                    dispatchDetail.emergencyPhoneNumber && styles.filledText,
                  ]}>
                  {dispatchDetail.emergencyPhoneNumber ||
                    '비상 연락처 정보 없음'}
                </Typo>
              </View>
            </View>

            {/* 상태 정보 */}
            {renderStatusAndActions()}
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
      </ScrollView>
      <Toast />
    </ManagerLayout>
  );
};

export default ProceedCallPage;

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    paddingHorizontal: scaleSize(16),
    paddingTop: scaleSize(16),
    paddingBottom: scaleSize(40),
  },
  // 장례식장 입찰 정보 섹션
  bidInfoSection: {
    // margin: 10,
    padding: scaleSize(20),
    backgroundColor: '#F8F9FA',
    borderRadius: scaleSize(10),
  },
  bidInfoHeader: {
    marginBottom: scaleSize(16),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  bidStatusRow: {
    marginBottom: scaleSize(20),
    alignItems: 'flex-start',
  },
  bidInfoTitle: {
    fontSize: scaleFontSize(18),
    fontWeight: '700',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
    marginBottom: scaleSize(16),
  },
  bidStatusContainer: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: scaleSize(12),
    paddingVertical: scaleSize(6),
    borderRadius: scaleSize(16),
    borderWidth: 1,
    borderColor: '#42A5F5',
  },
  bidStatusText: {
    fontSize: scaleFontSize(12),
    fontWeight: '600',
    color: '#1976D2',
    fontFamily: 'Pretendard-SemiBold',
  },
  bidInfoContent: {
    gap: scaleSize(8),
  },
  bidInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scaleSize(8),
  },
  bidInfoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleSize(6),
  },
  bidInfoLabelText: {
    fontSize: scaleFontSize(16),
    fontWeight: '500',
    color: '#666',
    fontFamily: 'Pretendard-Black',
  },
  bidInfoValue: {
    fontSize: scaleFontSize(16),
    fontWeight: '600',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  proposalPriceText: {
    color: '#2D81F1',
  },
  discountRateText: {
    color: '#FF4444',
  },
  dispatchSection: {
    margin: scaleSize(20),
    marginBottom: scaleSize(0),
    padding: scaleSize(20),
    backgroundColor: '#F8F9FA',
    borderRadius: scaleSize(10),
  },
  dispatchHeader: {
    marginTop: scaleSize(16),
    padding: scaleSize(8),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: scaleSize(12),
  },
  dispatchTitle: {
    fontSize: scaleFontSize(18),
    fontWeight: '700',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },
  // 가격 정보 섹션
  priceInfoSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: scaleSize(8),
    padding: scaleSize(16),
    marginTop: scaleSize(16),
  },
  priceInfoHeader: {
    marginBottom: scaleSize(16),
    paddingBottom: scaleSize(8),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  priceInfoTitle: {
    fontSize: scaleFontSize(16),
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Pretendard-SemiBold',
  },
  priceInfoItem: {
    backgroundColor: '#ffffff',
    padding: scaleSize(12),
    borderRadius: scaleSize(6),
    marginBottom: scaleSize(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceInfoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleSize(6),
  },
  priceText: {
    fontSize: scaleFontSize(16),
    fontWeight: '700',
    color: '#2D81F1',
    fontFamily: 'Pretendard-Bold',
  },
  proponentMoneyText: {
    fontSize: scaleFontSize(16),
    fontWeight: '700',
    color: '#FF6B35',
    fontFamily: 'Pretendard-Bold',
  },
  discountText: {
    fontSize: scaleFontSize(16),
    fontWeight: '700',
    color: '#4CAF50',
    fontFamily: 'Pretendard-Bold',
  },
  section: {
    marginBottom: scaleSize(24),
  },
  label: {
    fontSize: scaleFontSize(16),
    fontWeight: '600',
    fontFamily: 'Pretendard-Light',
    marginLeft: scaleSize(10),
    marginBottom: scaleSize(16),
    marginTop: scaleSize(16),
  },
  inputBox: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: scaleSize(20),
    paddingVertical: scaleSize(18),
    borderRadius: scaleSize(8),
    // marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: scaleSize(16),
    gap: scaleSize(10),
  },
  messageButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scaleSize(10),
    flex: 1,
    backgroundColor: 'rgba(226, 242, 255, 0.5)',
    paddingVertical: scaleSize(18),
    borderRadius: scaleSize(8),
    alignItems: 'center',
  },
  phoneButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scaleSize(10),
    flex: 1,
    backgroundColor: 'rgba(250, 250, 251, 0.75)',
    paddingVertical: scaleSize(18),
    borderRadius: scaleSize(8),
    alignItems: 'center',
  },
  // iconButtonText: {
  //   fontWeight: 'bold',
  //   fontSize: 16,
  //   color: '#666',
  // },
  messageIconButtonText: {
    fontSize: scaleFontSize(18),
    fontWeight: '600',
    color: '#2D81F1',
    fontFamily: 'Pretendard-Bold',
  },
  phoneIconButtonText: {
    fontSize: scaleFontSize(18),
    fontWeight: '600',
    color: '#666',
    fontFamily: 'Pretendard-Bold',
  },
  bottomButtons: {
    marginTop: 'auto',
  },
  confirmButton: {
    backgroundColor: '#2D81F1',
    paddingVertical: scaleSize(16),
    borderRadius: scaleSize(8),
    alignItems: 'center',
    marginBottom: scaleSize(8),
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: scaleFontSize(16),
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2D81F1',
    paddingVertical: scaleSize(16),
    borderRadius: scaleSize(8),
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#2D81F1',
    fontWeight: 'bold',
    fontSize: scaleFontSize(16),
  },
  text: {
    fontSize: scaleFontSize(16),
    fontWeight: '500',
    color: 'rgba(175, 179, 187, 0.5)',
    fontFamily: 'Pretendard-Black',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scaleSize(60),
  },
  loadingText: {
    marginTop: scaleSize(16),
    fontSize: scaleFontSize(16),
    color: '#666',
    fontFamily: 'Pretendard-Regular',
  },
  errorText: {
    fontSize: scaleFontSize(16),
    color: '#F04452',
    textAlign: 'center',
    marginBottom: scaleSize(16),
    fontFamily: 'Pretendard-Regular',
  },
  retryButton: {
    backgroundColor: '#2D81F1',
    paddingHorizontal: scaleSize(20),
    paddingVertical: scaleSize(10),
    borderRadius: scaleSize(8),
  },
  retryButtonText: {
    color: '#fff',
    fontSize: scaleFontSize(14),
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
  },
  filledText: {
    color: '#333', // 데이터가 있을 때 진한 색상
  },
  statusSection: {
    marginBottom: scaleSize(24),
  },
  statusBox: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: scaleSize(20),
    paddingVertical: scaleSize(12),
    borderRadius: scaleSize(8),
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  completedStatusBox: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  statusText: {
    fontSize: scaleFontSize(16),
    fontWeight: '600',
    color: '#FF8F00',
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
  },
  completedStatusText: {
    color: '#2E7D32',
  },
  actionButtons: {
    marginTop: scaleSize(24),
    marginBottom: scaleSize(32),
  },
  waitingButton: {
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFB74D',
    paddingVertical: scaleSize(18),
    borderRadius: scaleSize(8),
    alignItems: 'center',
    marginBottom: scaleSize(12),
  },
  waitingButtonText: {
    color: '#F57C00',
    fontWeight: '600',
    fontSize: scaleFontSize(16),
    fontFamily: 'Pretendard-SemiBold',
  },
  disabledButton: {
    backgroundColor: '#f2f2f2',
  },
  completedButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: scaleSize(18),
    borderRadius: scaleSize(8),
    alignItems: 'center',
  },
  completedButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: scaleFontSize(16),
    fontFamily: 'Pretendard-Bold',
  },
  pendingMessage: {
    fontSize: scaleFontSize(14),
    color: '#F57C00',
    textAlign: 'center',
    fontFamily: 'Pretendard-Regular',
    lineHeight: scaleFontSize(20),
  },
  approvedMessage: {
    fontSize: scaleFontSize(14),
    color: '#1976D2',
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
    lineHeight: scaleFontSize(20),
  },
  completedMessage: {
    fontSize: scaleFontSize(14),
    color: '#2E7D32',
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
    lineHeight: scaleFontSize(20),
  },
  waitingMessage: {
    fontSize: scaleFontSize(14),
    color: '#F57C00',
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
    lineHeight: scaleFontSize(20),
  },
  defaultMessage: {
    fontSize: scaleFontSize(14),
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Pretendard-Regular',
    lineHeight: scaleFontSize(20),
  },
  statusActionSection: {
    marginBottom: scaleSize(24),
  },
  currentStatusContainer: {
    marginBottom: scaleSize(12),
  },
  statusLabel: {
    fontSize: scaleFontSize(16),
    fontWeight: '600',
    fontFamily: 'Pretendard-Light',
    marginLeft: scaleSize(10),
  },
  updatingStatusBox: {
    backgroundColor: '#FFF8E1',
    borderColor: '#FFB74D',
  },
  pendingStatusBox: {
    backgroundColor: '#FFF8E1',
    borderColor: '#FFB74D',
  },
  approvedStatusBox: {
    backgroundColor: '#E3F2FD',
    borderColor: '#42A5F5',
  },
  pendingStatusText: {
    color: '#F57C00',
  },
  approvedStatusText: {
    color: '#1976D2',
  },
  statusMessageContainer: {
    marginBottom: scaleSize(12),
  },
  waitingCompletionButton: {
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFB74D',
    paddingVertical: scaleSize(18),
    borderRadius: scaleSize(8),
    alignItems: 'center',
  },
  waitingCompletionButtonText: {
    color: '#F57C00',
    fontWeight: '600',
    fontSize: scaleFontSize(16),
    fontFamily: 'Pretendard-SemiBold',
  },
});
