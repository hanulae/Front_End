import {NavigationProp, useFocusEffect} from '@react-navigation/native';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import {useCallback, useEffect, useState} from 'react';
import Typo from '../../components/common/Typo';
import ManagerLayout from '../../layout/ManagerLayout';
import {useManagerDispatchRequest} from '../../hooks/useManagerDispatchRequest';
import {ActivityIndicator} from 'react-native';

interface ICallHistoryPageProps {
  navigation: NavigationProp<any>;
}

const CallHistoryPage = ({navigation}: ICallHistoryPageProps) => {
  const [selectedTab, setSelectedTab] = useState<'진행중' | '완료'>('진행중');
  const {loading, error, getManagerDispatchRequestList} =
    useManagerDispatchRequest();
  const [dispatchList, setDispatchList] = useState<any[]>([]);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // 출동 신청 내역 조회
  const loadDispatchList = useCallback(async () => {
    try {
      const result = await getManagerDispatchRequestList();
      if (result && result.data) {
        const formattedData = result.data.map((item: any) => {
          // 완료 상태 정의: completed, rejected, cancelled
          const isCompleted = ['completed', 'rejected', 'cancelled'].includes(
            item.isApproved,
          );

          return {
            id: item.dispatchRequestId,
            name: item.chiefMournerName,
            status: isCompleted ? '완료' : '진행중', // 상태별 탭 분류
            createdAt: item.createdAt,
            isApproved: item.isApproved,
          };
        });

        setDispatchList(formattedData);
        console.log('출동 신청 내역 로드 성공:', formattedData);
      }
    } catch (err) {
      console.error('출동 신청 내역 로드 실패:', err);
    }
  }, [getManagerDispatchRequestList]);

  useFocusEffect(
    useCallback(() => {
      loadDispatchList();

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
    }, [loadDispatchList]),
  );

  // 필터링
  useEffect(() => {
    const filtered = dispatchList.filter(item => item.status === selectedTab);
    setFilteredList(filtered);
  }, [dispatchList, selectedTab]);

  // const goToClientDetail = (clientId: number) => {

  // }

  const goToClientDetailDevMode = () => {
    navigation.navigate('ClientDetail', {clientId: 1});
  };

  const handleCardPress = (item: any) => {
    if (selectedTab === '진행중') {
      navigation.navigate('ProceedCall', {callId: item.id});
    } else {
      navigation.navigate('ProceedCall', {callId: item.id, status: '완료'});
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${year}.${month}.${day} ${hours}:${minutes}`;
    } catch (error) {
      return '날짜 정보 없음';
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDispatchList();
    setRefreshing(false);
  }, [loadDispatchList]);

  // 상태별 태그 텍스트 반환 함수
  const getStatusText = (isApproved: string) => {
    switch (isApproved) {
      case 'pending':
        return '출동 대기';
      case 'approved':
        return '출동 승인';
      case 'completed':
        return '거래 완료';
      case 'rejected':
        return '출동 거부';
      case 'cancelled':
        return '출동 취소';
      default:
        return '출동 신청';
    }
  };

  // 상태별 태그 스타일 반환 함수
  const getStatusTagStyle = (isApproved: string) => {
    switch (isApproved) {
      case 'pending':
        return {
          container: [styles.tag, styles.pendingTag],
          text: [styles.tagText, styles.pendingTagText],
        };
      case 'approved':
        return {
          container: [styles.tag, styles.approvedTag],
          text: [styles.tagText, styles.approvedTagText],
        };
      case 'completed':
        return {
          container: [styles.tag, styles.completedTag],
          text: [styles.tagText, styles.completedTagText],
        };
      case 'rejected':
        return {
          container: [styles.tag, styles.rejectedTag],
          text: [styles.tagText, styles.rejectedTagText],
        };
      case 'cancelled':
        return {
          container: [styles.tag, styles.cancelledTag],
          text: [styles.tagText, styles.cancelledTagText],
        };
      default:
        return {
          container: [styles.tag],
          text: [styles.tagText],
        };
    }
  };

  return (
    <ManagerLayout
      headerShown={true}
      color="white"
      headerTitle="출동 신청 내역"
      homeButton={true}
      homeRouteName="ManagerMain">
      {/* 탭 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === '진행중' && styles.activeTab,
          ]}
          onPress={() => setSelectedTab('진행중')}>
          <Typo
            style={[
              styles.tabText,
              selectedTab === '진행중' && styles.activeTabText,
            ]}>
            진행중
          </Typo>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === '완료' && styles.activeTab]}
          onPress={() => setSelectedTab('완료')}>
          <Typo
            style={[
              styles.tabText,
              selectedTab === '완료' && styles.activeTabText,
            ]}>
            완료
          </Typo>
        </TouchableOpacity>
      </View>

      {/* 리스트 */}
      <ScrollView
        contentContainerStyle={styles.wrapper}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2D81F1']} // Android
            tintColor="#2D81F1" // iOS
          />
        }>
        {/* 로딩 상태 */}
        {loading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#2D81F1" />
            <Typo style={styles.loadingText}>
              출동 신청 내역을 불러오는 중...
            </Typo>
          </View>
        )}

        {/* 에러 상태 */}
        {error && !loading && (
          <View style={styles.centerContainer}>
            <Typo style={styles.errorText}>{error}</Typo>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadDispatchList}>
              <Typo style={styles.retryButtonText}>다시 시도</Typo>
            </TouchableOpacity>
          </View>
        )}

        {/* 데이터 없음 */}
        {!loading && !error && filteredList.length === 0 && (
          <View style={styles.centerContainer}>
            <Typo style={styles.emptyText}>
              {selectedTab === '진행중' ? '진행 중인' : '완료된'} 출동 신청이
              없습니다.
            </Typo>
          </View>
        )}

        {/* 실제 데이터 리스트 */}
        {!loading &&
          !error &&
          filteredList.length > 0 &&
          filteredList.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => handleCardPress(item)}>
              <View style={styles.topRow}>
                <Typo style={styles.clientName}>{item.name}</Typo>
                <Typo style={styles.clientDesc}>고객님</Typo>
              </View>
              <View style={styles.bottomRow}>
                <View style={getStatusTagStyle(item.isApproved).container}>
                  <Typo style={getStatusTagStyle(item.isApproved).text}>
                    {getStatusText(item.isApproved)}
                  </Typo>
                </View>
                <View style={styles.dateContainer}>
                  <Typo style={styles.dateText}>
                    {formatDate(item.createdAt)}
                  </Typo>
                  <TouchableOpacity
                    style={styles.detailButton}
                    onPress={() => {
                      goToClientDetailDevMode();
                    }}>
                    <Typo style={styles.detailText}>상세보기</Typo>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </ManagerLayout>
  );
};

export default CallHistoryPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F6F8',
    paddingHorizontal: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 30,
    backgroundColor: '#F5F6F8',
    paddingBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 18,
    backgroundColor: 'rgba(75, 153, 253, 0.1)',
    borderRadius: 100,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4F7CFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(45, 129, 241, 0.5)',
    fontFamily: 'Pretendard-Light',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    // padding: 16,
    marginBottom: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#eee',
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tag: {
    backgroundColor: 'white',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Pretendard-Bold',
  },
  topRow: {
    flexDirection: 'row',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },
  clientDesc: {
    fontSize: 18,
    fontWeight: '600',
    color: '#283042',
    fontFamily: 'Pretendard-Medium',
    marginLeft: 8,
  },
  detailButton: {
    // paddingVertical: 4,
    // paddingHorizontal: 8,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6F717D',
    textDecorationLine: 'underline',
    textDecorationColor: '#6F717D',
    fontFamily: 'Pretendard-Bold',
  },
  centerContainer: {
    flex: 1,
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

  dateContainer: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    fontFamily: 'Pretendard-Regular',
  },
  pendingTag: {borderColor: '#FFB74D'},
  pendingTagText: {color: '#F57C00'},
  approvedTag: {borderColor: '#42A5F5'},
  approvedTagText: {color: '#1976D2'},
  completedTag: {borderColor: '#4CAF50'},
  completedTagText: {color: '#2E7D32'},
  rejectedTag: {borderColor: '#EF5350'},
  rejectedTagText: {color: '#D32F2F'},
  cancelledTag: {borderColor: '#9E9E9E'},
  cancelledTagText: {color: '#616161'},
});
