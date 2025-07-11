import {useRoute, useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import Typo from '../../components/common/Typo';
import CustomButton from '../../components/common/CustomButton';
import ButtonIcon from '../../assets/Icon/Icon_DropDown01.svg';
import {useState, useCallback, useEffect} from 'react';
import RoomSelector from '../../components/funeralHall/RoomSelector';
import { useQuoteProposal } from '../../hooks/useFuneralEstimate';
import { FuneralHallInfo, ManagerFormBidDetail } from '../../services/api/funeral/funeralEstimateService';
import {scaleFontSize, scaleSize} from '../../utils/responsive';

// 호실 정보 interface (RoomSelector 컴포넌트와 호환)
interface RoomInfo {
  id: number;
  roomName: string;
  roomSpace: number;
  roomCapacity: number;
  roomServiceFee: number;
  roomPrice: number;
}

const QuoteProposalPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {id, status} = route.params as {id: string; status: string};
  console.log('id', id);
  console.log('status', status);
  
  const {
    hallList,
    estimateDetail,
    loading,
    error,
    fetchHallList,
    fetchEstimateDetail,
    submitBid,
    fetchManagerFormBidDetail,
  } = useQuoteProposal();

  const [isSelectRoomSheetVisible, setSelectRoomSheetVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<FuneralHallInfo | null>(null);
  const [proposalPrice, setProposalPrice] = useState('');
  const [bidDetail, setBidDetail] = useState<ManagerFormBidDetail | null>(null); // 입찰 상세 내용

  const loadInitialData = useCallback(async () => {
    try {
      // 견적 상세 정보 로드
      await fetchEstimateDetail(id);
      
      // status에 따라 다른 데이터 로드
      if (status === 'pending') {
        // pending 상태: 입찰 작성 모드 - 호실 목록 로드
        await fetchHallList();
      } else {
        // pending이 아닌 상태: 입찰 조회 모드 - 입찰 상세 내용 로드
        try {
          const bidDetailResult = await fetchManagerFormBidDetail(id);
          if (bidDetailResult) {
            setBidDetail(bidDetailResult);
          } else {
            // bidDetail이 없는 경우 (expired 등의 상태에서 발생 가능)
            console.warn('입찰 상세 정보를 찾을 수 없습니다.');
          }
        } catch (bidDetailError) {
          console.error('입찰 상세 정보 로드 실패:', bidDetailError);
          // 입찰 상세 정보 로드에 실패해도 페이지는 표시하되, 기본값으로 설정
          setBidDetail(null);
        }
      }
    } catch (err) {
      console.error('초기 데이터 로드 실패:', err);
      Alert.alert('오류', '데이터를 불러오는데 실패했습니다.');
    }
  }, [id, status, fetchEstimateDetail, fetchHallList, fetchManagerFormBidDetail]);

  // 페이지가 포커스될 때 데이터 로드
  useFocusEffect(
    useCallback(() => {
      loadInitialData();
    }, [loadInitialData])
  );

  // 입찰 상세 내용이 로드되면 UI에 반영
  useEffect(() => {
    if (bidDetail) {
      if (status === 'pending') {
        // 작성모드: hallList에서 호실 찾기 (기존 방식)
        if (hallList.length > 0) {
          const usedRoom = hallList.find(hall => hall.funeralHallId === bidDetail.funeralHallId);
          if (usedRoom) {
            setSelectedRoom(usedRoom);
          }
        }
      } else {
        // 조회모드: bidDetail에서 직접 호실 정보 생성 (null 체크 추가)
        const roomFromBidDetail: FuneralHallInfo = {
          funeralHallId: bidDetail.funeralHallId || '',
          funeralHallName: bidDetail.funeralHallName || '정보 없음',
          funeralHallSize: bidDetail.funeralHallSize || 0,
          funeralHallNumberOfMourners: bidDetail.funeralHallNumberOfMourners || 0,
          funeralHallDetailPrice: bidDetail.funeralHallDetailPrice || 0,
          funeralHallPrice: bidDetail.funeralHallPrice || 0,
          funeralHallStatus: 'available' as const,
          version: 1,
        };
        setSelectedRoom(roomFromBidDetail);
      }
      
      // 제안가 설정 (null 체크 추가)
      const proposalMoney = bidDetail.proponentMoney;
      if (proposalMoney !== null && proposalMoney !== undefined) {
        setProposalPrice(proposalMoney.toString());
      } else {
        setProposalPrice('0');
      }
    }
  }, [bidDetail, hallList, status]);

  // 할인률 계산
  const calculateDiscountRate = (proposal: number, total: number): string => {
    if (proposal <= 0 || total <= 0) return '0';
    const discount = ((total - proposal) / total) * 100;
    return discount.toFixed(1);
  };

  // 기존 날짜 포맷팅 함수는 그대로 두고 (입실일, 퇴실일용)
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
  };

  // 시간까지 표시하는 새로운 포맷팅 함수 추가
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
  };

  // bidStatus를 한국어 상태로 변환
  const getStatusText = (bidStatus: string) => {
    switch (bidStatus) {
      case 'pending':
        return '입찰 요청';
      case 'bid_submitted':
        return '입찰 제출';
      case 'bid_selected':
        return '입찰 성공';
      case 'bid_progress':
        return '거래 진행중';
      case 'transaction_completed':
        return '거래 완료';
      case 'rejected':
        return '입찰 실패';
      case 'expired':
        return '입찰 마감';
      default:
        return '상태 불명';
    }
  };

  // 제안가 입력 처리
  const handleProposalPriceChange = (value: string) => {
    if (!selectedRoom) return;

    const numericValue = value.replace(/[^0-9]/g, '');
    const total = selectedRoom.funeralHallDetailPrice + selectedRoom.funeralHallPrice;

    // 합계값 이상으로 입력할 수 없도록 제한
    if (numericValue && Number(numericValue) > total) {
      return;
    }

    setProposalPrice(numericValue);
  };

  // 호실 선택 처리
  const handleRoomSelect = (room: RoomInfo) => {
    // RoomInfo에서 index를 사용하여 실제 호실 정보 찾기
    const funeralHallRoom = hallList[room.id];
    if (funeralHallRoom) {
      setSelectedRoom(funeralHallRoom);
      console.log('funeralHallRoom', funeralHallRoom);
    }
    setProposalPrice(''); // 호실 변경 시 제안가 초기화
  };

  // 입찰 제출 처리
  const handleSubmitBid = async () => {
    if (!selectedRoom || !proposalPrice) {
      Alert.alert('알림', '호실과 제안가를 모두 입력해주세요.');
      return;
    }

    // const total = selectedRoom.funeralHallDetailPrice + selectedRoom.funeralHallPrice;
    // const discount = total - Number(proposalPrice);

    try {
      const response = await submitBid({
        managerFormBidId: id,
        funeralHallName: selectedRoom.funeralHallName,
        funeralHallSize: selectedRoom.funeralHallSize,
        funeralHallNumberOfMourners: selectedRoom.funeralHallNumberOfMourners,
        funeralHallDetailPrice: selectedRoom.funeralHallDetailPrice,
        funeralHallPrice: selectedRoom.funeralHallPrice,
        proponentMoney: Number(proposalPrice),
        discount: Number(currentDiscountRate),
      });

      if (response.success) {
        Alert.alert('성공', response.message, [
          {
            text: '확인',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (err: any) {
      Alert.alert('오류', err.message || '입찰 제출 중 오류가 발생했습니다.');
    }
  };

  // 현재 할인률 계산
  const currentDiscountRate =
    selectedRoom && proposalPrice
      ? calculateDiscountRate(
          Number(proposalPrice),
          selectedRoom.funeralHallDetailPrice + selectedRoom.funeralHallPrice,
        )
      : '0';

  // 입찰 작성 모드 vs 조회 모드 구분
  const isWriteMode = status === 'pending'; // 입찰 요청 상태
  const isDisabled = !isWriteMode; // 입찰 요청이 아니면 비활성화

  // 에러 표시
  if (error) {
    console.error('견적 제안서 에러:', error);
  }

  return (
    <FuneralLayout
      headerShown={true}
      headerTitle={isWriteMode ? "견적 제안서 작성" : "입찰 상세 정보"}
      backButtonVisible={true}
      homeButton={true}
      homeRouteName="FuneralMain"
      color="#FFFFFF"
      top={true}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          style={styles.scrollViewStyle}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* 견적 요청 정보 표시 */}
          {estimateDetail && (
            <View style={styles.infoContainer}>
              <Typo style={styles.sectionTitle}>견적 상세 정보</Typo>
              
              <View style={styles.infoRow}>
                <Typo style={styles.infoLabel}>상주명:</Typo>
                <Typo style={styles.infoValue}>{estimateDetail.chiefMournerName}</Typo>
              </View>
              
              {estimateDetail.deceasedName && (
                <View style={styles.infoRow}>
                  <Typo style={styles.infoLabel}>고인명:</Typo>
                  <Typo style={styles.infoValue}>{estimateDetail.deceasedName}</Typo>
                </View>
              )}
              
              <View style={styles.infoRow}>
                <Typo style={styles.infoLabel}>예상 조문객 수:</Typo>
                <Typo style={styles.infoValue}>{estimateDetail.numberOfMourners}명</Typo>
              </View>
              
              {estimateDetail.roomSize && (
                <View style={styles.infoRow}>
                  <Typo style={styles.infoLabel}>희망 평수:</Typo>
                  <Typo style={styles.infoValue}>{estimateDetail.roomSize}평</Typo>
                </View>
              )}
              
              <View style={styles.infoRow}>
                <Typo style={styles.infoLabel}>입실일:</Typo>
                <Typo style={styles.infoValue}>{formatDate(estimateDetail.checkInDate)}</Typo>
              </View>
              
              <View style={styles.infoRow}>
                <Typo style={styles.infoLabel}>퇴실일:</Typo>
                <Typo style={styles.infoValue}>{formatDate(estimateDetail.checkOutDate)}</Typo>
              </View>
            </View>
          )}

          {/* 입찰 상세 정보 (조회 모드에서만 표시) */}
          {!isWriteMode && (
            <View style={styles.bidDetailContainer}>
              <Typo style={styles.sectionTitle}>입찰 정보</Typo>
              
              <View style={styles.infoRow}>
                <Typo style={styles.infoLabel}>현재 입찰 상태:</Typo>
                <Typo style={styles.infoValue}>{getStatusText(status)}</Typo>
              </View>
              
              {bidDetail ? (
                <>
                  {bidDetail.bidSubmittedAt && (
                    <View style={styles.infoRow}>
                      <Typo style={styles.infoLabel}>입찰 제출일:</Typo>
                      <Typo style={styles.infoValue}>{formatDateTime(bidDetail.bidSubmittedAt)}</Typo>
                    </View>
                  )}
                  
                  {bidDetail.bidSelectedAt && (
                    <View style={styles.infoRow}>
                      <Typo style={styles.infoLabel}>입찰 성공일:</Typo>
                      <Typo style={styles.infoValue}>{formatDateTime(bidDetail.bidSelectedAt)}</Typo>
                    </View>
                  )}
                  
                  {bidDetail.transactionCompletedAt && (
                    <View style={styles.infoRow}>
                      <Typo style={styles.infoLabel}>거래 완료일:</Typo>
                      <Typo style={styles.infoValue}>{formatDateTime(bidDetail.transactionCompletedAt)}</Typo>
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.infoRow}>
                  <Typo style={styles.infoLabel}>입찰 상세 정보를 불러올 수 없습니다.</Typo>
                </View>
              )}
            </View>
          )}

          {/* 제안 정보 입력 */}
          <View style={styles.proposalContainer}>
            <Typo style={styles.sectionTitle}>
              {isWriteMode ? "입찰 제안서" : "제출한 입찰 내용"}
            </Typo>
            
            {/* 조회 모드에서 bidDetail이 없는 경우 메시지 표시 */}
            {!isWriteMode && !bidDetail && (
              <View style={styles.noDataContainer}>
                <Typo style={styles.noDataText}>
                  {status === 'expired' ? '입찰 기간이 만료되어 입찰 정보가 없습니다.' : '입찰 정보를 불러올 수 없습니다.'}
                </Typo>
              </View>
            )}
            
            {/* 입찰 정보가 있거나 작성 모드인 경우에만 표시 */}
            {(isWriteMode || bidDetail) && (
              <>
                <View style={styles.inputContainer}>
              <Typo style={styles.titleText}>호실 선택</Typo>
              <CustomButton
                onPress={() => {
                  if (!isDisabled) {
                    setSelectRoomSheetVisible(true);
                  }
                }}
                style={[styles.inputDisabled, isDisabled && styles.disabled]}>
                <Typo style={styles.inputText}>
                  {selectedRoom ? selectedRoom.funeralHallName : '호실 선택'}
                </Typo>
                <ButtonIcon width={24} height={24} />
              </CustomButton>
            </View>
            
            <View style={styles.inputContainer}>
              <Typo style={styles.titleText}>평수</Typo>
              <View style={styles.inputDisabled}>
                <Typo style={[styles.inputText, selectedRoom && styles.inputTextFilled]}>
                  {selectedRoom ? selectedRoom.funeralHallSize.toString() : '-'}
                </Typo>
                <Typo style={styles.inputValueText}>평</Typo>
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Typo style={styles.titleText}>수용인원</Typo>
              <View style={styles.inputDisabled}>
                <Typo style={[styles.inputText, selectedRoom && styles.inputTextFilled]}>
                  {selectedRoom ? selectedRoom.funeralHallNumberOfMourners.toString() : '-'}
                </Typo>
                <Typo style={styles.inputValueText}>명</Typo>
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Typo style={styles.titleText}>식장지불금액</Typo>
              <View style={styles.inputDisabled}>
                <Typo style={[styles.inputText, selectedRoom && styles.inputTextFilled]}>
                  {selectedRoom ? selectedRoom.funeralHallDetailPrice.toLocaleString() : '-'}
                </Typo>
                <Typo style={styles.inputValueText}>만원</Typo>
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Typo style={styles.titleText}>호실사용료</Typo>
              <View style={styles.inputDisabled}>
                <Typo style={[styles.inputText, selectedRoom && styles.inputTextFilled]}>
                  {selectedRoom ? selectedRoom.funeralHallPrice.toLocaleString() : '-'}
                </Typo>
                <Typo style={styles.inputValueText}>만원</Typo>
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Typo style={styles.titleText}>
                합계 (식장지불금액 + 호실사용료)
              </Typo>
              <View style={styles.inputDisabled}>
                <Typo style={[styles.inputText, selectedRoom && styles.inputTextFilled]}>
                  {selectedRoom
                    ? (
                        selectedRoom.funeralHallDetailPrice + selectedRoom.funeralHallPrice
                      ).toLocaleString()
                    : '-'}
                </Typo>
                <Typo style={styles.inputValueText}>만원</Typo>
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Typo style={styles.titleText}>제안가</Typo>
              <View style={[styles.inputDisabled, isDisabled && styles.disabled, !selectedRoom && styles.disabled]}>
                <TextInput
                  style={styles.textInputStyle}
                  value={proposalPrice}
                  placeholder={
                    selectedRoom
                      ? (
                          selectedRoom.funeralHallDetailPrice + selectedRoom.funeralHallPrice
                        ).toLocaleString()
                      : '호실을 먼저 선택해주세요'
                  }
                  placeholderTextColor="#AFB3BB"
                  onChangeText={handleProposalPriceChange}
                  keyboardType="numeric"
                  editable={!isDisabled && !!selectedRoom}
                  returnKeyType="done"
                />
                <Typo style={styles.inputValueText}>만원</Typo>
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Typo style={styles.titleText}>할인률</Typo>
              <View style={styles.inputDisabled}>
                <Typo style={[styles.inputText, (selectedRoom && proposalPrice) && styles.inputTextFilled]}>{currentDiscountRate}</Typo>
                <Typo style={styles.inputValueText}>%</Typo>
              </View>
            </View>
              </>
            )}
          </View>

          {/* 입찰 작성 모드에서만 입찰 버튼 표시 */}
          {isWriteMode && (
            <View style={styles.buttonContainer}>
              <CustomButton
                onPress={handleSubmitBid}
                style={[
                  styles.button,
                  (!selectedRoom || !proposalPrice || loading) &&
                    styles.buttonDisabled,
                ]}
                disabled={!selectedRoom || !proposalPrice || loading}>
                <Typo
                  style={[
                    styles.buttonText,
                    (!selectedRoom || !proposalPrice || loading) &&
                      styles.buttonTextDisabled,
                  ]}>
                  {loading ? '처리중...' : '입찰'}
                </Typo>
              </CustomButton>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <RoomSelector
        visible={isSelectRoomSheetVisible}
        onClose={() => setSelectRoomSheetVisible(false)}
        onSelect={handleRoomSelect}
        roomList={hallList.map((hall, index) => ({
          id: index,
          roomName: hall.funeralHallName,
          roomSpace: hall.funeralHallSize,
          roomCapacity: hall.funeralHallNumberOfMourners,
          roomServiceFee: hall.funeralHallDetailPrice,
          roomPrice: hall.funeralHallPrice,
        }))}
      />
    </FuneralLayout>
  );
};

export default QuoteProposalPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: scaleSize(20),
  },
  scrollViewStyle: {
    flex: 1,
  },
  infoContainer: {
    margin: scaleSize(20),
    padding: scaleSize(20),
    backgroundColor: '#F8F9FA',
    borderRadius: scaleSize(10),
  },
  proposalContainer: {
    flex: 1,
    margin: scaleSize(20),
    padding: scaleSize(20),
    backgroundColor: '#FFFFFF',
    borderRadius: scaleSize(10),
    borderWidth: 1,
    borderColor: '#E5E8EB',
  },
  bidDetailContainer: {
    margin: scaleSize(20),
    padding: scaleSize(20),
    backgroundColor: '#F0F8FF',
    borderRadius: scaleSize(10),
    borderWidth: 1,
    borderColor: '#B0D4F1',
  },
  sectionTitle: {
    fontSize: scaleFontSize(20),
    fontWeight: '700',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
    marginBottom: scaleSize(16),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scaleSize(8),
  },
  infoLabel: {
    fontSize: scaleFontSize(16),
    fontWeight: '500',
    color: '#666',
    fontFamily: 'Pretendard-Black',
  },
  infoValue: {
    fontSize: scaleFontSize(16),
    fontWeight: '600',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: scaleSize(20),
    paddingHorizontal: scaleSize(10),
  },
  titleText: {
    fontSize: scaleFontSize(18),
    marginLeft: scaleSize(20),
    fontWeight: '700',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
    marginBottom: scaleSize(20),
  },
  inputDisabled: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(20),
    marginHorizontal: scaleSize(10),
    paddingVertical: scaleSize(18),
    borderRadius: scaleSize(10),
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E8EB',
    fontSize: scaleFontSize(16),
    fontWeight: '500',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },
  disabled: {
    opacity: 0.5,
  },
  inputText: {
    fontSize: scaleFontSize(16),
    fontWeight: '500',
    color: '#AFB3BB',
    fontFamily: 'Pretendard-Black',
  },
  inputTextFilled: {
    color: '#283042',
  },
  inputValueText: {
    fontSize: scaleFontSize(16),
    fontWeight: '500',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },
  textInputStyle: {
    flex: 1,
    fontSize: scaleFontSize(16),
    fontWeight: '500',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
    padding: 0,
    margin: 0,
    height: scaleSize(24),
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    paddingBottom: scaleSize(24),
    paddingHorizontal: scaleSize(20),
    marginTop: scaleSize(20),
  },
  button: {
    borderRadius: scaleSize(10),
    backgroundColor: '#2D81F1',
    paddingVertical: scaleSize(18),
  },
  buttonDisabled: {
    backgroundColor: '#AFB3BB',
  },
  buttonText: {
    fontSize: scaleFontSize(16),
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Black',
    textAlign: 'center',
  },
  buttonTextDisabled: {
    color: '#FFFFFF',
    opacity: 0.7,
  },
  noDataContainer: {
    padding: scaleSize(20),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: scaleSize(8),
    margin: scaleSize(10),
  },
  noDataText: {
    fontSize: scaleFontSize(16),
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Pretendard-Regular',
  },
});
