import {StyleSheet, TouchableOpacity, View} from 'react-native';
import RoomIconBlue from '../../../assets/Button/Button_ManageRoomBlue.svg';
import RoomIconBlack from '../../../assets/Button/Button_ManageRoomBlack.svg';
import Typo from '../../common/Typo';
import ButtonGroup from './ButtonGroup';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface IRoomCardProps {
  roomName: string;
  roomId: string;
  isButtonVisible: boolean;
  toggleEdit: () => void;
  handleDelete: () => void;
}

const RoomCard = ({
  roomName,
  roomId,
  isButtonVisible,
  toggleEdit,
  handleDelete,
}: IRoomCardProps) => {
  // const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const MoveRoomDetail = () => {
    console.log('RoomDetail');
    // navigation.navigate('RoomDetail', { roomId });
  };

  const MoveRoomModify = () => {
    console.log('RoomModify');
    // navigation.navigate('RoomModify', { roomId });
  };

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={MoveRoomDetail}
      disabled={isButtonVisible}>
      <RoomIconBlack width={24} height={24} />
      <View style={styles.cardContent}>
        <Typo style={styles.roomName}>{roomName}</Typo>
        {isButtonVisible && (
          <ButtonGroup
            isVisible={isButtonVisible}
            isEdit={true}
            isDelete={true}
            isCancel={true}
            onEditPress={MoveRoomModify}
            onDeletePress={handleDelete}
            onCancelPress={toggleEdit}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default RoomCard;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
    flex: 1,
  },
  roomName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },
});

// 카드를 누르면 호실 상세 페이지로 이동
// 편집 버튼을 누르고, 카드의 수정 버튼을 누르면 수정 페이지로 이동
// 삭제 버튼을 누르면 삭제 확인 모달이 뜨고, 확인을 누르면 삭제
