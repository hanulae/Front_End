import {useRoute} from '@react-navigation/native';
import {KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import {useEffect, useState} from 'react';
import {useInputBase} from '../../hooks/input/useInputBase';
import Typo from '../../components/common/Typo';
import {FuneralInput} from '../../components/common/input/FuneralInput';
import CustomButton from '../../components/common/CustomButton';

interface IAddRoomPageProps {}

const AddRoomPage = () => {
  const route = useRoute();
  const {roomId, roomName, purpose} = route.params as {
    roomId: string;
    roomName: string;
    purpose: string;
  };
  const [roomInfo, setRoomInfo] = useState({
    roomName: '',
    roomSpace: '',
    roomCapacity: '',
    roomSubFee: '',
    roomMainFee: '',
  });

  const room_name = useInputBase();
  const room_space = useInputBase();
  const room_capacity = useInputBase();
  const room_sub_fee = useInputBase();
  const room_main_fee = useInputBase();

  //   useEffect(() => {
  //   if (purpose === 'modify' || purpose === 'detail') {
  //     const { existingRoomInfo } = route.params as {
  //       roomId: string;
  //       roomName: string;
  //       purpose: string;
  //       existingRoomInfo: {
  //         roomName: string;
  //         roomSpace: string;
  //         roomCapacity: string;
  //         roomSubFee: string;
  //         roomMainFee: string;
  //       };
  //     };

  //     setRoomInfo(existingRoomInfo);
  //   }
  // }, [purpose]);

  return (
    <FuneralLayout
      headerTitle={
        purpose === 'detail'
          ? roomName
          : purpose === 'modify'
          ? '호실 수정'
          : purpose === 'add'
          ? '호실 추가'
          : ''
      }
      backButtonVisible={true}
      homeButton={true}
      homeRouteName="FuneralMain"
      top={true}
      color="white"
      headerShown={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 0} // 헤더 높이만큼 여백 조정
        style={{flex: 1}}>
        <View style={styles.wrapper}>
          <View style={styles.roomContainer}>
            <Typo style={styles.titleText}>호실이름</Typo>
            <FuneralInput
              input={room_name}
              placeholder="호실 이름을 입력하세요"
              disabled={purpose === 'detail'}
            />
          </View>
          <View style={styles.roomContainer}>
            <Typo style={styles.titleText}>평수</Typo>
            <FuneralInput input={room_space} placeholder="평수를 입력하세요" />
          </View>
          <View style={styles.roomContainer}>
            <Typo style={styles.titleText}>수용인원</Typo>
            <FuneralInput
              input={room_capacity}
              placeholder="수용인원을 입력하세요"
              disabled={purpose === 'detail'}
            />
          </View>
          <View style={styles.roomContainer}>
            <Typo style={styles.titleText}>식장지불금액(세부내역)</Typo>
            <FuneralInput
              input={room_sub_fee}
              placeholder="식장지불금액을 입력하세요"
              disabled={purpose === 'detail'}
            />
          </View>
          <View style={styles.roomContainer}>
            <Typo style={styles.titleText}>호실사용료</Typo>
            <FuneralInput
              input={room_main_fee}
              placeholder="호실사용료를 입력하세요"
              disabled={purpose === 'detail'}
            />
          </View>
          {purpose !== 'detail' && (
            <View style={styles.buttonContainer}>
              <CustomButton
                onPress={() => {
                  console.log('호실 추가/수정 완료');
                }}
                style={styles.button}>
                <Typo style={styles.buttonText}>
                  {purpose === 'modify' ? '호실 수정' : '호실 추가'}
                </Typo>
              </CustomButton>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </FuneralLayout>
  );
};

export default AddRoomPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  roomContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  titleText: {
    fontSize: 18,
    marginLeft: 20,
    fontWeight: '700',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
    marginBottom: 10,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 24,
  },
  button: {
    backgroundColor: '#2D81F1',
    borderRadius: 10,
    paddingVertical: 18,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Black',
  },
});
