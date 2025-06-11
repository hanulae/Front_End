import {useEffect, useRef} from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Typo from '../common/Typo';

// QuoteProposalPage에서 사용하는 컴포넌트
// QuoteProposalPage에서 호실 선택 버튼을 눌렀을때, 현재 장례식장에 등록된 호실 목록을 보여주는데, 이때, 호실 정보 배열은 QuoteProposalPage에서 전달받음. 이때 전달 받을 내용은 일단은 DUMMY_ROOM_LIST를 전달받고, 여기선 사실상 이름과 id만 사용함.
// 호실 정보 배열은 다음과 같은 객체가 배열로 전달됨.
// {
//   id: number;
//   roomName: string;
//   roomSpace: number;
//   roomCapacity: number;
//   roomServiceFee: number;
//   roomPrice: number;
// }
// BottomSheet에선 호실 목록만 보여주고, 정보는 클릭 시, QuoteProposalPage로 이동하여 호실 정보를 보여줌.

interface RoomInfo {
  id: number;
  roomName: string;
  roomSpace: number;
  roomCapacity: number;
  roomServiceFee: number;
  roomPrice: number;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (room: RoomInfo) => void;
  roomList: RoomInfo[];
}

const RoomSelector = ({visible, onClose, onSelect, roomList}: Props) => {
  const translateY = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sheet, {transform: [{translateY}]}]}>
        <View style={styles.header}>
          <Typo style={styles.headerTitle}>호실 선택</Typo>
        </View>
        {roomList.map(room => (
          <TouchableOpacity
            style={styles.room}
            key={room.id}
            onPress={() => {
              onSelect(room);
              onClose();
            }}>
            <View style={styles.roomInfo}>
              <Typo style={styles.roomName}>{room.roomName}</Typo>
              <Typo style={styles.roomDetails}>
                {room.roomSpace}평 | {room.roomCapacity}명 수용
              </Typo>
            </View>
            <Typo style={styles.roomPrice}>
              {(room.roomServiceFee + room.roomPrice).toLocaleString()}만원
            </Typo>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </Modal>
  );
};

export default RoomSelector;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 20,
    maxHeight: '70%',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F6F8',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Pretendard-Black',
    color: '#283042',
    textAlign: 'center',
  },
  room: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F6F8',
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard-Black',
    color: '#283042',
    marginBottom: 4,
  },
  roomDetails: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Pretendard-Black',
    color: '#AFB3BB',
  },
  roomPrice: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard-Black',
    color: '#2D81F1',
  },
});
