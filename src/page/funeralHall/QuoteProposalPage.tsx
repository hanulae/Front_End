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
import {useState, useCallback} from 'react';
import RoomSelector from '../../components/funeralHall/RoomSelector';
import { useQuoteProposal } from '../../hooks/useFuneralEstimate';
import { FuneralHallInfo } from '../../services/api/funeral/funeralEstimateService';

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
  
  const {
    hallList,
    estimateDetail,
    loading,
    error,
    fetchHallList,
    fetchEstimateDetail,
    submitBid,
  } = useQuoteProposal();

  const [isSelectRoomSheetVisible, setSelectRoomSheetVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<FuneralHallInfo | null>(null);
  const [proposalPrice, setProposalPrice] = useState('');

  const loadInitialData = useCallback(async () => {
    try {
      // 견적 상세 정보 로드
      await fetchEstimateDetail(id);
      
      // 호실 목록 로드 (현재 장례식장의 호실 목록을 가져옴)
      // JWT 토큰에서 funeralId를 자동으로 가져오므로 파라미터 없이 호출
      await fetchHallList();
    } catch (err) {
      console.error('초기 데이터 로드 실패:', err);
      Alert.alert('오류', '데이터를 불러오는데 실패했습니다.');
    }
  }, [id, fetchEstimateDetail, fetchHallList]);

  // 페이지가 포커스될 때 데이터 로드
  useFocusEffect(
    useCallback(() => {
      loadInitialData();
    }, [loadInitialData])
  );

  // 할인률 계산
  const calculateDiscountRate = (proposal: number, total: number): string => {
    if (proposal <= 0 || total <= 0) return '0';
    const discount = ((total - proposal) / total) * 100;
    return discount.toFixed(1);
  };

  // 날짜 포맷팅 함수 (YYYY/MM/DD 형식)
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
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
        funeralHallId: selectedRoom.funeralHallId,
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

  // status가 '대기중' 일 때는 견적 제안서의 input을 활성화
  // status가 '완료' 일 때는 견적 제안서의 input을 비활성화
  const isDisabled = status === '완료';

  // 에러 표시
  if (error) {
    console.error('견적 제안서 에러:', error);
  }

  return (
    <FuneralLayout
      headerShown={true}
      headerTitle="견적 상세"
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

          {/* 제안 정보 입력 */}
          <View style={styles.proposalContainer}>
            <Typo style={styles.sectionTitle}>입찰 제안서</Typo>
            
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
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              onPress={handleSubmitBid}
              style={[
                styles.button,
                (!selectedRoom || !proposalPrice || isDisabled || loading) &&
                  styles.buttonDisabled,
              ]}
              disabled={!selectedRoom || !proposalPrice || isDisabled || loading}>
              <Typo
                style={[
                  styles.buttonText,
                  (!selectedRoom || !proposalPrice || isDisabled || loading) &&
                    styles.buttonTextDisabled,
                ]}>
                {loading ? '처리중...' : '입찰'}
              </Typo>
            </CustomButton>
          </View>
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
    paddingBottom: 20,
  },
  scrollViewStyle: {
    flex: 1,
  },
  infoContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
  },
  proposalContainer: {
    flex: 1,
    margin: 20,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E8EB',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    fontFamily: 'Pretendard-Black',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },
  inputContainer: {
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
    marginBottom: 20,
  },
  inputDisabled: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginHorizontal: 10,
    paddingVertical: 18,
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E8EB',
    fontSize: 16,
    fontWeight: '500',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },
  disabled: {
    opacity: 0.5,
  },
  inputText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#AFB3BB',
    fontFamily: 'Pretendard-Black',
  },
  inputTextFilled: {
    color: '#283042',
  },
  inputValueText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },
  textInputStyle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
    padding: 0,
    margin: 0,
    height: 24,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    paddingBottom: 24,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    borderRadius: 10,
    backgroundColor: '#2D81F1',
    paddingVertical: 18,
  },
  buttonDisabled: {
    backgroundColor: '#AFB3BB',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Black',
    textAlign: 'center',
  },
  buttonTextDisabled: {
    color: '#FFFFFF',
    opacity: 0.7,
  },
});
