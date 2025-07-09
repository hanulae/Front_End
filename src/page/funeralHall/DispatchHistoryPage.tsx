import {Platform, ScrollView, StatusBar, StyleSheet, View, ActivityIndicator} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import DispatchCard from '../../components/funeralHall/DispatchCard';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback, useState, useEffect} from 'react';
import {useFuneralDispatch} from '../../hooks/useFuneralDispatch';
import {DispatchListItem} from '../../services/api/funeral/funeralDispatchService';
import Typo from '../../components/common/Typo';

const DispatchHistoryPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {dispatchList, loading, error, fetchDispatchList, fetchDispatchDetail} = useFuneralDispatch();
  const [completedDispatches, setCompletedDispatches] = useState<DispatchListItem[]>([]);

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

  // 데이터 로드
  useEffect(() => {
    fetchDispatchList();
  }, [fetchDispatchList]);

  // 완료된 출동 내역만 필터링
  useEffect(() => {
    const completed = dispatchList.filter(item => item.isApproved === 'completed');
    setCompletedDispatches(completed);
  }, [dispatchList]);

  // 페이지 포커스 시 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      fetchDispatchList();
    }, [fetchDispatchList]),
  );

  // 카드 전체 클릭 시 - 출동 상세 정보 페이지로 이동
  const goToDispatchDetail = (dispatchRequestId: string, chiefMournerName: string) => {
    navigation.navigate('DispatchDetail', {
      dispatchRequestId: dispatchRequestId,
      chiefMournerName: chiefMournerName,
    });
  };

  // 입찰 상세 정보 버튼 클릭 시 - 입찰 상세 정보 페이지로 이동
  const goToBidDetail = async (dispatchRequestId: string, chiefMournerName: string) => {
    try {
      // 출동 상세정보를 가져와서 managerFormBidId 얻기
      const detailData = await fetchDispatchDetail(dispatchRequestId);
      
      if (detailData && detailData.dispatchRequest.managerFormBidId) {
        // QuoteProposalPage로 네비게이트 (완료된 출동이므로 status는 transaction_completed)
        navigation.navigate('QuoteProposal', {
          id: detailData.dispatchRequest.managerFormBidId,
          status: 'transaction_completed',
        });
      } else {
        // managerFormBidId가 없으면 출동 상세 페이지로 이동
        navigation.navigate('DispatchDetail', {
          dispatchRequestId: dispatchRequestId,
          chiefMournerName: chiefMournerName,
        });
      }
    } catch (error) {
      console.error('입찰 상세정보 가져오기 실패:', error);
      // 에러 발생 시 출동 상세 페이지로 이동
      navigation.navigate('DispatchDetail', {
        dispatchRequestId: dispatchRequestId,
        chiefMournerName: chiefMournerName,
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\./g, '.').replace(/\s/g, '');
  };

  return (
    <FuneralLayout
      headerTitle="지난 출동 내역"
      backButtonVisible={true}
      homeButton={true}
      color="#FFFFFF"
      homeRouteName="FuneralMain"
      top={true}
      headerShown={true}>
      <View style={styles.wrapper}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2D81F1" />
            <Typo style={styles.loadingText}>출동 내역을 불러오는 중...</Typo>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Typo style={styles.errorText}>⚠️ {error}</Typo>
            <Typo style={styles.retryText} onPress={() => fetchDispatchList()}>
              다시 시도
            </Typo>
          </View>
        ) : completedDispatches.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Typo style={styles.emptyText}>완료된 출동 내역이 없습니다.</Typo>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollView}>
            {completedDispatches.map((item, index) => (
              <DispatchCard
                key={item.dispatchRequestId}
                name={item.chiefMournerName}
                date={formatDate(item.createdAt)}
                index={index}
                onPress={() => goToDispatchDetail(item.dispatchRequestId, item.chiefMournerName)}
                onBidDetailPress={() => goToBidDetail(item.dispatchRequestId, item.chiefMournerName)}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </FuneralLayout>
  );
};

export default DispatchHistoryPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F6F8',
    paddingHorizontal: 10,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#2D81F1',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorText: {
    color: '#FF0000',
    textAlign: 'center',
  },
  retryText: {
    marginTop: 10,
    color: '#2D81F1',
    textDecorationLine: 'underline',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: '#888888',
    textAlign: 'center',
  },
});
