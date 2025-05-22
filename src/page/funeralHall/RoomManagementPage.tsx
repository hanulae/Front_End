import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import {Platform, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import CustomButton from '../../components/common/CustomButton';
import Typo from '../../components/common/Typo';
import RoomCard from '../../components/funeralHall/management/RoomCard';
import AddRoomIcon from '../../assets/Button/Button_AddRoom.svg';
import MoveIcon from '../../assets/Button/Button_MoveTransparent.svg';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const DummyData = [
  {roomId: '1', roomName: '1호실'},
  {roomId: '2', roomName: '2호실'},
  {roomId: '3', roomName: '3호실'},
  {roomId: '4', roomName: '4호실'},
  {roomId: '5', roomName: '5호실'},
];

const RoomManagementPage = () => {
  // StatusBar 설정
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#3287F8');
        StatusBar.setBarStyle('dark-content');
      } else {
        StatusBar.setBarStyle('dark-content');
      }
      return () => {
        // 화면 포커스 해제 시 필요하다면 초기화 작업
        // 예: StatusBar.setStyle('default')
      };
    }, []),
  );

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  // 상태 관리
  const [isEdit, setIsEdit] = useState(false);
  const [rooms, setRooms] = useState(DummyData);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 수정 버튼 클릭 핸들러
  const toggleEdit = () => {
    setIsEdit(!isEdit);
  };

  // 삭제 버튼 클릭 핸들러
  const handleDeletePress = (roomId: string) => {
    setSelectedRoomId(roomId);
    setIsModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedRoomId) {
      // 실제 삭제 처리 로직
      console.log('Deleting room', selectedRoomId);
    }
    setIsModalVisible(false);
    setSelectedRoomId(null);
  };

  const addRoom = () => {
    // 방 추가 처리 로직
    navigation.navigate('AddRoom', {purpose: 'add'});
  };

  // 호실 fetch
  // 추후 작성.

  return (
    <FuneralLayout
      headerShown={true}
      backButtonVisible={true}
      homeButton={true}
      color="#F5F6F8"
      homeRouteName="FuneralMain"
      top={true}
      headerTitle="호실관리">
      <View style={styles.wrapper}>
        <View style={styles.editButtonContainer}>
          <CustomButton onPress={toggleEdit} style={styles.editButton}>
            <Typo style={styles.editButtonText}>
              {isEdit ? '완료' : '편집'}
            </Typo>
          </CustomButton>
        </View>
        <ScrollView
          style={styles.cardContainer}
          contentContainerStyle={{gap: 10}}>
          {rooms.map(room => (
            <RoomCard
              key={room.roomId}
              roomId={room.roomId}
              roomName={room.roomName}
              isButtonVisible={isEdit}
              toggleEdit={toggleEdit}
              handleDelete={() => handleDeletePress(room.roomId)}
            />
          ))}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <CustomButton onPress={addRoom} style={styles.addRoomButton}>
            <View style={styles.addRoomButtonContent}>
              <AddRoomIcon width={24} height={24} />
              <Typo style={styles.addRoomButtonText}>호실 추가</Typo>
            </View>
            <MoveIcon width={20} height={20} />
          </CustomButton>
        </View>
      </View>
    </FuneralLayout>
  );
};

export default RoomManagementPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  editButtonContainer: {
    padding: 20,
  },
  editButton: {
    alignSelf: 'flex-end',
    borderRadius: 10,
    backgroundColor: '#283042',
    paddingHorizontal: 27,
    paddingVertical: 10,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Pretendard-Black',
  },
  cardContainer: {
    flexDirection: 'column',
    gap: 10,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  addRoomButton: {
    flexDirection: 'row',
    // flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#C4C7CF',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  addRoomButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  addRoomButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Pretendard-Black',
  },
});
