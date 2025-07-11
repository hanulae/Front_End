import {Platform, ScrollView, StatusBar, StyleSheet, RefreshControl, View} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useCallback, useEffect, useState} from 'react';
import PendingDispatchCard from '../../components/funeralHall/PendingDispatchCard';
import { useFuneralDispatch } from '../../hooks/useFuneralDispatch';
import { DispatchListItem } from '../../services/api/funeral/funeralDispatchService';
import Toast from 'react-native-toast-message';
import Typo from '../../components/common/Typo';
import {scaleFontSize, scaleSize} from '../../utils/responsive';

const PendingDispatchPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {error, fetchDispatchList, fetchDispatchDetail} = useFuneralDispatch();
  const [dispatchList, setDispatchList] = useState<DispatchListItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  console.log('dispatchList', dispatchList);

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
        // completed 상태 필터링 (출동 완료된 항목은 대기 목록에서 제외)
        const filteredResult = result.filter(item => item.isApproved !== 'completed');
        setDispatchList(filteredResult);
        console.log('출동 대기 내역 로드 성공 (필터링 적용):', filteredResult);
      } else {
        console.log('❌ 출동 대기 내역 로드 실패 - 빈 데이터');
        setDispatchList([]);
      }
    } catch (err) {
      console.error('💥 출동 대기 내역 로드 에러:', err);
      setDispatchList([]);
    }
  }, [fetchDispatchList]);

  // 풀 투 리프레시 함수
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDispatchList();
    setRefreshing(false);
  }, [loadDispatchList]);

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

  // 상태값을 한국어로 변환하는 함수
  const getStatusText = (isApproved: string) => {
    switch (isApproved) {
      case 'pending':
        return '출동 요청';
      case 'approved':
        return '출동 승인';
      case 'rejected':
        return '출동 거절';
      case 'cancelled':
        return '출동 취소';
      case 'completed':
        return '거래 완료';
      default:
        return '상태 불명';
    }
  };

  // handle navigation to Dispatch Detail
  const goToDispatchDetail = (id: string, status: string) => {
    if (status === 'pending') {
      navigation.navigate('DispatchRequestDetail', {
        dispatchRequestId: id,
      });
    } else if (status === 'approved') {
      navigation.navigate('ConfirmTransaction', {
        dispatchRequestId: id,
      });
    } else {
      // 기타 상태 (rejected, cancelled 등)는 상세보기로
      navigation.navigate('DispatchRequestDetail', {
        dispatchRequestId: id,
      });
    }
  };

  // 입찰 상세 정보 버튼 클릭 시 - 입찰 상세 정보 페이지로 이동
  const goToBidDetail = async (dispatchRequestId: string, _chiefMournerName: string) => {
    try {
      // 출동 상세정보를 가져와서 managerFormBidId 얻기
      const detailData = await fetchDispatchDetail(dispatchRequestId);
      
      if (detailData && detailData.dispatchRequest.managerFormBidId) {
        navigation.navigate('QuoteProposal', {
          id: detailData.dispatchRequest.managerFormBidId,
          status: 'bid_submitted', // 조회 모드로 강제 설정
        });
      } else {
        // managerFormBidId가 없으면 Toast 메시지 표시
        Toast.show({
          type: 'error',
          text1: '입찰 정보를 찾을 수 없습니다.',
          position: 'top',
        });
      }
    } catch (error) {
      console.error('입찰 상세정보 가져오기 실패:', error);
      Toast.show({
        type: 'error',
        text1: '입찰 정보를 불러오는데 실패했습니다.',
        position: 'top',
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
        style={styles.wrapper}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3287F8']} // Android 색상
            tintColor="#3287F8" // iOS 색상
            title="새로고침 중..." // iOS 텍스트
            titleColor="#3287F8" // iOS 텍스트 색상
          />
        }>
        {dispatchList.length === 0 ? (
          // ✅ 빈 상태
          <View style={styles.emptyContainer}>
            <Typo style={styles.emptyText}>출동 대기 내역이 없습니다.</Typo>
          </View>
        ) : (
          dispatchList.map((item, index) => (
            <PendingDispatchCard
              key={item.dispatchRequestId}
              name={item.chiefMournerName}
              index={index}
              status={getStatusText(item.isApproved)}
              onPress={() => {
                goToDispatchDetail(item.dispatchRequestId, item.isApproved);
              }}
              onBidDetailPress={() => goToBidDetail(item.dispatchRequestId, item.chiefMournerName)}
            />
          ))
        )}
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
    padding: scaleSize(20),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scaleSize(60),
  },
  emptyText: {
    fontSize: scaleFontSize(16),
    color: '#999',
    textAlign: 'center',
    fontFamily: 'Pretendard-Regular',
  },
});
