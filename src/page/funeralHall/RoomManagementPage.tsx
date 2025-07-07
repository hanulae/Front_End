import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {Platform, ScrollView, StatusBar, StyleSheet, View, ActivityIndicator, RefreshControl, Alert} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import CustomButton from '../../components/common/CustomButton';
import Typo from '../../components/common/Typo';
import RoomCard from '../../components/funeralHall/management/RoomCard';
import AddRoomIcon from '../../assets/Button/Button_AddRoom.svg';
import MoveIcon from '../../assets/Button/Button_MoveTransparent.svg';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useFuneralHallInfo} from '../../hooks/useFuneralHallInfo';
import Toast from 'react-native-toast-message';

const RoomManagementPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const {
    loading,
    error,
    funeralHallList,
    fetchFuneralHallList,
    deleteFuneralHallInfo,
    clearError,
  } = useFuneralHallInfo();

  // 상태 관리
  const [isEdit, setIsEdit] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 데이터 로드 함수
  const loadHallData = useCallback(async () => {
    try {
      await fetchFuneralHallList();
    } catch (err) {
      console.error('호실 데이터 로드 실패:', err);
    }
  }, [fetchFuneralHallList]);

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
      };
    }, []),
  );

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadHallData();
  }, [loadHallData]);

  // 화면 포커스 시 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      loadHallData();
    }, [loadHallData])
  );

  // Pull to Refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHallData();
    setRefreshing(false);
  }, [loadHallData]);

  // 에러 처리
  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: '호실 정보 로드 실패',
        text2: error,
        position: 'top',
        topOffset: 0,
      });
    }
  }, [error]);

  // 수정 버튼 클릭 핸들러
  const toggleEdit = () => {
    setIsEdit(!isEdit);
  };

  // 삭제 버튼 클릭 핸들러 - 확인 대화상자 표시
  const handleDeletePress = (roomId: string) => {
    const roomName = funeralHallList.find(hall => hall.funeralHallId === roomId)?.funeralHallName || '선택한 호실';
    
    Alert.alert(
      '호실 삭제',
      `'${roomName}'을(를) 정말 삭제하시겠습니까?\n삭제 후에는 되돌릴 수 없습니다.`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => confirmDelete(roomId),
        },
      ]
    );
  };

  // 실제 삭제 처리
  const confirmDelete = async (roomId: string) => {
    try {
      const result = await deleteFuneralHallInfo(roomId);
      
      if (result) {
        Toast.show({
          type: 'success',
          text1: '삭제 완료',
          text2: '호실이 성공적으로 삭제되었습니다.',
          position: 'top',
          topOffset: 0,
        });
        
        // 목록 새로고침
        await loadHallData();
      }
    } catch (err: any) {
      console.error('호실 삭제 실패:', err);
      Toast.show({
        type: 'error',
        text1: '삭제 실패',
        text2: err.message || '호실 삭제 중 오류가 발생했습니다.',
        position: 'top',
        topOffset: 0,
      });
    }
  };

  const addRoom = () => {
    navigation.navigate('AddRoom', {purpose: 'add'});
  };

  // 로딩 상태 렌더링
  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#2D81F1" />
      <Typo style={styles.loadingText}>호실 정보를 불러오는 중...</Typo>
    </View>
  );

  // 에러 상태 렌더링
  const renderError = () => (
    <View style={styles.centerContainer}>
      <Typo style={styles.errorText}>{error}</Typo>
      <CustomButton style={styles.retryButton} onPress={() => {
        clearError();
        loadHallData();
      }}>
        <Typo style={styles.retryButtonText}>다시 시도</Typo>
      </CustomButton>
    </View>
  );

  // 빈 상태 렌더링
  const renderEmpty = () => (
    <View style={styles.centerContainer}>
      <Typo style={styles.emptyText}>등록된 호실이 없습니다.</Typo>
      <Typo style={styles.emptySubText}>호실을 추가해보세요!</Typo>
    </View>
  );

  return (
    <FuneralLayout
      headerShown={true}
      backButtonVisible={true}
      homeButton={true}
      color="#F5F6F8"
      homeRouteName="FuneralMain"
      top={true}
      headerTitle="호실 관리">
      <View style={styles.wrapper}>
        <View style={styles.editButtonContainer}>
          <CustomButton onPress={toggleEdit} style={styles.editButton}>
            <Typo style={styles.editButtonText}>
              {isEdit ? '완료' : '편집'}
            </Typo>
          </CustomButton>
        </View>

        {/* 로딩, 에러, 빈 상태 처리 */}
        {loading && !refreshing ? (
          renderLoading()
        ) : error ? (
          renderError()
        ) : funeralHallList.length === 0 ? (
          renderEmpty()
        ) : (
          <ScrollView
            style={styles.cardContainer}
            contentContainerStyle={{gap: 10}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {funeralHallList.map(hall => (
              <RoomCard
                key={hall.funeralHallId}
                roomId={hall.funeralHallId}
                roomName={hall.funeralHallName}
                isButtonVisible={isEdit}
                toggleEdit={toggleEdit}
                handleDelete={() => handleDeletePress(hall.funeralHallId)}
              />
            ))}
          </ScrollView>
        )}

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
      <Toast />
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
    justifyContent: 'flex-end',
    backgroundColor: '#3287F8',
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    marginBottom: 20,
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
  emptyText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Pretendard-SemiBold',
  },
  emptySubText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    fontFamily: 'Pretendard-Regular',
  },
});
