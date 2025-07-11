import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useCallback, useState, useEffect} from 'react';
import QuoteCard from '../../components/funeralHall/QuoteCard';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useFuneralEstimate} from '../../hooks/useFuneralEstimate';
import Typo from '../../components/common/Typo';
import Toast from 'react-native-toast-message';

const EstimateHistoryPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {loading, error, fetchEstimateList} = useFuneralEstimate();
  const [estimateList, setEstimateList] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  // const route = useRoute();
  // const managerFormId = route.params as {managerFormId: string};
  // console.log('managerFormId', managerFormId);

  // useEffect(() => {
  //   const estimateStatus = estimateList.find(
  //     item => item.managerFormId === managerFormId,
  //   )?.bidStatus;
  //   if (managerFormId) {
  //     navigation.navigate('QuoteProposal', {
  //       id: managerFormId,
  //       status: estimateStatus,
  //     });
  //   }
  // }, []);

  // if (managerFormId) {
  //   const estimateStatus = estimateList.find(
  //     item => item.managerFormId === managerFormId,
  //   )?.bidStatus;
  //   navigation.navigate('EstimateHistory', {
  //     id: managerFormId,
  //     status: estimateStatus,
  //   });
  // }

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

  // 견적 내역 데이터 로드
  const loadEstimateList = useCallback(async () => {
    try {
      const result = await fetchEstimateList();
      console.log('pageResult', result);

      if (result && Array.isArray(result)) {
        const filteredResult = result.filter(item => item.bidStatus !== 'transaction_completed');
        setEstimateList(filteredResult);
        
        console.log('견적 내역 로드 성공(필터링):', filteredResult);
      } else {
        console.log('❌ 견적 내역 로드 실패 - 빈 데이터');
        setEstimateList([]);
      }
    } catch (err) {
      console.error('💥 견적 내역 로드 에러:', err);
      setEstimateList([]);
    }
  }, [fetchEstimateList]);

  // 새로고침 처리
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadEstimateList();
    } finally {
      setRefreshing(false);
    }
  }, [loadEstimateList]);

  // 페이지 포커스 시 데이터 로드
  useFocusEffect(
    useCallback(() => {
      loadEstimateList();
    }, [loadEstimateList]),
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

  // bidStatus를 한국어 상태로 변환 (장례식장용 API 응답)
  const getStatusText = (bidStatus: string) => {
    switch (bidStatus) {
      case 'pending':
        return '입찰 요청';
      case 'bid_submitted':
        return '입찰 제출';
      case 'bid_selected':
        return '입찰 성공';
      case 'bid_progress':
        return '거래 진행중';
      // case 'deceased_arrived':
      //   return '고인 안치';
      case 'transaction_completed':
        return '거래 완료';
      case 'rejected':
        return '입찰 실패';
      case 'expired':
        return '입찰 마감';
      default:
        return '상태 불명';
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date
      .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\./g, '.')
      .replace(/\s/g, '');
  };

  // 시간 포맷팅 함수 - 월일 시분 형태로 반환
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';

    try {
      const date = new Date(dateString);

      // 유효한 날짜인지 확인
      if (isNaN(date.getTime())) {
        return '-';
      }

      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${month}월 ${day}일 ${hours}:${minutes}`;
    } catch (error) {
      console.warn('날짜 포맷팅 오류:', error);
      return '-';
    }
  };

  // handle Quote Card Press - 현재는 managerFormBidId를 받으므로 해당 ID로 이동
  const handleQuoteCardPress = (managerFormBidId: string, status: string) => {
    navigation.navigate('QuoteProposal', {
      id: managerFormBidId,
      status: status,
    });
  };

  const renderContent = () => {
    // 로딩 상태
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3287F8" />
          <Typo style={styles.loadingText}>견적 내역을 불러오는 중...</Typo>
        </View>
      );
    }

    // 에러 상태 (데이터는 없지만 에러가 있는 경우)
    if (error && estimateList.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Typo style={styles.errorText}>{error}</Typo>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadEstimateList}>
            <Typo style={styles.retryButtonText}>다시 시도</Typo>
          </TouchableOpacity>
        </View>
      );
    }

    // 데이터 없음
    if (estimateList.length === 0) {
      return (
        <ScrollView
          contentContainerStyle={styles.centerContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3287F8']} // Android
              tintColor="#3287F8" // iOS
            />
          }>
          <Typo style={styles.emptyText}>아직 견적 요청이 없습니다.</Typo>
        </ScrollView>
      );
    }

    // 데이터 표시 (현재 받는 장례식장용 API 응답 구조에 맞게)
    return (
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3287F8']} // Android
            tintColor="#3287F8" // iOS
          />
        }>
        {estimateList.map((item, index) => (
          <QuoteCard
            key={item.managerFormBidId || index}
            name={`${item.managerForm.chiefMournerName} 상주님`} // 임시로 순번 표시
            date={formatDate(item.managerFormCreatedAt)}
            status={getStatusText(item.bidStatus)}
            requestedAt={formatDateTime(item.managerFormCreatedAt)}
            sentAt={formatDateTime(item.bidSubmittedAt)}
            id={item.managerFormBidId}
            onPress={() =>
              handleQuoteCardPress(item.managerFormBidId, item.bidStatus)
            }
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <FuneralLayout
      top={true}
      headerShown={true}
      headerTitle="견적 내역"
      color="#FFFFFF"
      backButtonVisible={true}
      homeButton={true}
      homeRouteName="FuneralMain">
      <View style={styles.wrapper}>{renderContent()}</View>
      <Toast />
    </FuneralLayout>
  );
};

export default EstimateHistoryPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F6F8',
    paddingHorizontal: 20,
  },
  scrollView: {
    flexGrow: 1,
    gap: 10,
    paddingTop: 20,
  },
  centerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
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
    marginBottom: 16,
    fontFamily: 'Pretendard-Regular',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Pretendard-Regular',
  },
  retryButton: {
    backgroundColor: '#3287F8',
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
});
