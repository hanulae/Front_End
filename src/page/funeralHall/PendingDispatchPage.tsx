import {Platform, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useCallback, useEffect, useState} from 'react';
import PendingDispatchCard from '../../components/funeralHall/PendingDispatchCard';
import { useFuneralDispatch } from '../../hooks/useFuneralDispatch';
import { DispatchListItem } from '../../services/api/funeral/funeralDispatchService';
import Toast from 'react-native-toast-message';

const PendingDispatchPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {loading, error, fetchDispatchList} = useFuneralDispatch();
  const [dispatchList, setDispatchList] = useState<DispatchListItem[]>([]);

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

  // 출동 대기 내역 데이터 로드
  const loadDispatchList = useCallback(async () => {
    try {
      const result = await fetchDispatchList();
      console.log('pageResult', result);
      if (result && Array.isArray(result)) {
        setDispatchList(result);
        console.log('출동 대기 내역 로드 성공:', result);
      } else {
        console.log('❌ 출동 대기 내역 로드 실패 - 빈 데이터');
        setDispatchList([]);
      }
    } catch (err) {
      console.error('💥 출동 대기 내역 로드 에러:', err);
      setDispatchList([]);
    }
  }, [fetchDispatchList]);

  // 페이지 포커스 시 데이터 로드
  useFocusEffect(
    useCallback(() => {
      loadDispatchList();
    }, [loadDispatchList])
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

  // handle navigation to Dispatch Detail
  const goToDispatchDetail = (id: string, status: string) => {
    if (status === 'pending') {
      navigation.navigate('DispatchRequestDetail', {
        dispatchRequestId: id,
      });
    } else if (status === 'completed' || status === 'approved') {
      navigation.navigate('ConfirmTransaction', {
        dispatchRequestId: id,
      });
    }
  };

  return (
    <FuneralLayout
      top={true}
      headerShown={true}
      headerTitle="출동 대기 내역"
      backButtonVisible={true}
      homeButton={true}
      homeRouteName="FuneralMain"
      color="white">
      <ScrollView
        contentContainerStyle={styles.scrollView}
        style={styles.wrapper}>
        {dispatchList.map((item, index) => (
          <PendingDispatchCard
            key={item.dispatchRequestId}
            name={item.chiefMournerName}
            index={index}
            status={item.isApproved}
            onPress={() => {
              goToDispatchDetail(item.dispatchRequestId, item.isApproved);
            }}
          />
        ))}
      </ScrollView>
    </FuneralLayout>
  );
};

export default PendingDispatchPage;

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  wrapper: {
    backgroundColor: '#F5F6F8',
    padding: 20,
  },
});
