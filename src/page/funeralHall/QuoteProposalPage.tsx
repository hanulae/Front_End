import {useRoute} from '@react-navigation/native';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import Typo from '../../components/common/Typo';
import CustomButton from '../../components/common/CustomButton';
import ButtonIcon from '../../assets/Icon/Icon_DropDown01.svg';
import {useState} from 'react';
import RoomSelector from '../../components/funeralHall/RoomSelector';

// 호실 정보 interface
interface RoomInfo {
  id: number;
  roomName: string;
  roomSpace: number;
  roomCapacity: number;
  roomServiceFee: number;
  roomPrice: number;
}

// 호실 정보 더미데이터
const DUMMY_ROOM_LIST: RoomInfo[] = [
  {
    id: 1,
    roomName: '1호실',
    roomSpace: 50,
    roomCapacity: 50,
    roomServiceFee: 50,
    roomPrice: 100,
  },
  {
    id: 2,
    roomName: '2호실',
    roomSpace: 70,
    roomCapacity: 90,
    roomServiceFee: 70,
    roomPrice: 120,
  },
  {
    id: 3,
    roomName: '3호실',
    roomSpace: 100,
    roomCapacity: 100,
    roomServiceFee: 100,
    roomPrice: 150,
  },
];

const QuoteProposalPage = () => {
  const route = useRoute();
  const {id, status} = route.params as {id: number; status: string};
  console.log('QuoteProposalPage', id, status);

  const [isSelectRoomSheetVisible, setSelectRoomSheetVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomInfo | null>(null);
  const [proposalPrice, setProposalPrice] = useState('');

  // 할인률 계산
  const calculateDiscountRate = (proposal: number, total: number): string => {
    if (proposal <= 0 || total <= 0) return '0';
    const discount = ((total - proposal) / total) * 100;
    return discount.toFixed(1);
  };

  // 제안가 입력 처리
  const handleProposalPriceChange = (value: string) => {
    if (!selectedRoom) return;

    const numericValue = value.replace(/[^0-9]/g, '');
    const total = selectedRoom.roomServiceFee + selectedRoom.roomPrice;

    // 합계값 이상으로 입력할 수 없도록 제한
    if (numericValue && Number(numericValue) > total) {
      return;
    }

    setProposalPrice(numericValue);
  };

  // 호실 선택 처리
  const handleRoomSelect = (room: RoomInfo) => {
    setSelectedRoom(room);
    setProposalPrice(''); // 호실 변경 시 제안가 초기화
  };

  // 현재 할인률 계산
  const currentDiscountRate =
    selectedRoom && proposalPrice
      ? calculateDiscountRate(
          Number(proposalPrice),
          selectedRoom.roomServiceFee + selectedRoom.roomPrice,
        )
      : '0';

  // status가 '대기중' 일 때는 견적 제안서의 input을 활성화
  // status가 '완료' 일 때는 견적 제안서의 input을 비활성화
  const isDisabled = status === '완료';

  return (
    <FuneralLayout
      headerShown={true}
      headerTitle="견적 제안서"
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
                {selectedRoom ? selectedRoom.roomName : '호실 선택'}
              </Typo>
              <ButtonIcon width={24} height={24} />
            </CustomButton>
          </View>
          <View style={styles.inputContainer}>
            <Typo style={styles.titleText}>평수</Typo>
            <View style={styles.inputDisabled}>
              <Typo style={styles.inputText}>
                {selectedRoom ? selectedRoom.roomSpace.toString() : '-'}
              </Typo>
              <Typo style={styles.inputValueText}>평</Typo>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Typo style={styles.titleText}>수용인원</Typo>
            <View style={styles.inputDisabled}>
              <Typo style={styles.inputText}>
                {selectedRoom ? selectedRoom.roomCapacity.toString() : '-'}
              </Typo>
              <Typo style={styles.inputValueText}>명</Typo>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Typo style={styles.titleText}>식장지불금액</Typo>
            <View style={styles.inputDisabled}>
              <Typo style={styles.inputText}>
                {selectedRoom ? selectedRoom.roomServiceFee.toString() : '-'}
              </Typo>
              <Typo style={styles.inputValueText}>만원</Typo>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Typo style={styles.titleText}>호실사용료</Typo>
            <View style={styles.inputDisabled}>
              <Typo style={styles.inputText}>
                {selectedRoom ? selectedRoom.roomPrice.toString() : '-'}
              </Typo>
              <Typo style={styles.inputValueText}>만원</Typo>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Typo style={styles.titleText}>
              합계 (식장지불금액 + 호실사용료)
            </Typo>
            <View style={styles.inputDisabled}>
              <Typo style={styles.inputText}>
                {selectedRoom
                  ? (
                      selectedRoom.roomServiceFee + selectedRoom.roomPrice
                    ).toString()
                  : '-'}
              </Typo>
              <Typo style={styles.inputValueText}>만원</Typo>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Typo style={styles.titleText}>제안가</Typo>
            <TextInput
              style={[
                styles.inputDisabled,
                isDisabled && styles.disabled,
                !selectedRoom && styles.disabled,
              ]}
              value={proposalPrice}
              placeholder={
                selectedRoom
                  ? (
                      selectedRoom.roomServiceFee + selectedRoom.roomPrice
                    ).toString()
                  : '호실을 먼저 선택해주세요'
              }
              placeholderTextColor="#AFB3BB"
              onChangeText={handleProposalPriceChange}
              keyboardType="numeric"
              editable={!isDisabled && !!selectedRoom}
              returnKeyType="done"
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo style={styles.titleText}>할인률</Typo>
            <View style={styles.inputDisabled}>
              <Typo style={styles.inputText}>{currentDiscountRate}</Typo>
              <Typo style={styles.inputValueText}>%</Typo>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              onPress={() => {}}
              style={[
                styles.button,
                (!selectedRoom || !proposalPrice || isDisabled) &&
                  styles.buttonDisabled,
              ]}>
              <Typo
                style={[
                  styles.buttonText,
                  (!selectedRoom || !proposalPrice || isDisabled) &&
                    styles.buttonTextDisabled,
                ]}>
                입찰
              </Typo>
            </CustomButton>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <RoomSelector
        visible={isSelectRoomSheetVisible}
        onClose={() => setSelectRoomSheetVisible(false)}
        onSelect={handleRoomSelect}
        roomList={DUMMY_ROOM_LIST}
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
    backgroundColor: '#F5F6F8',
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
  inputValueText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
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
