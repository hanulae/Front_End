import {Platform, ScrollView, StatusBar, StyleSheet, View, ActivityIndicator} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import EstimateCard from '../../components/manager/EstimateCard';
import {useCallback, useState} from 'react';
import {useManagerForm} from '../../hooks/useManagerForm';
import {ManagerFormList} from '../../services/api/manager/managerFormService';
import Typo from '../../components/common/Typo';

const EstimateListPage = () => {
  const {getManagerFormList, loading, error} = useManagerForm();
  const navigation = useNavigation<NavigationProp<any>>();

  const [managerFormList, setManagerFormList] = useState<ManagerFormList[]>([]);

  // ✅ 페이지 포커스 시 데이터 로드
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#3287F8');
        StatusBar.setBarStyle('dark-content');
      } else {
        StatusBar.setBarStyle('dark-content');
      }

      // ✅ 견적 내역 데이터 로드
      loadManagerFormList();

      return () => {
        // 화면 포커스 해제 시 필요하다면 초기화 작업
      };
    }, []),
  );

  // ✅ 견적 내역 로드 함수
  const loadManagerFormList = async () => {
    try {
      const result = await getManagerFormList();
      if (result) {
        setManagerFormList(result);
      }
    } catch (error) {
      console.error('견적 내역 로드 실패:', error);
    }
  };


  //날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}.${month}.${day} | ${hours}:${minutes}`;
  };

  // ✅ 상태별 한글 변환
  const getStatusText = (status: 'request' | 'bid_received' | 'bid_selected' | 'bid_progress' | 'completed' | 'cancelled') => {
    switch (status) {
      case 'request':
        return '견적 발송';
      case 'bid_received':
        return '입찰 요청';
      case 'bid_selected':
        return '출동 신청';
      case 'bid_progress':
        return '출동 승인';
      case 'completed':
        return '거래 완료';
      case 'cancelled':
        return '거래 취소';
      default:
        return status;
    }

  };

  const goToClientEstimate = (managerFormId: string) => {
    navigation.navigate('ClientEstimate', {managerFormId});
  };

  // ✅ 로딩 상태
  if (loading) {
    return (
      <DefaultLayout
        headerShown={true}
        headerTitle="견적내역"
        homeButton={true}
        homeRouteName="ManagerMain"
        logoutButton={false}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3287F8" />
          <Typo style={styles.loadingText}>견적 내역을 불러오는 중...</Typo>
        </View>
      </DefaultLayout>
    );
  }

  // ✅ 에러 상태
  if (error) {
    return (
      <DefaultLayout
        headerShown={true}
        headerTitle="견적내역"
        homeButton={true}
        homeRouteName="ManagerMain"
        logoutButton={false}>
        <View style={styles.centerContainer}>
          <Typo style={styles.errorText}>❌ {error}</Typo>
        </View>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout
      headerShown={true}
      headerTitle="견적내역"
      homeButton={true}
      homeRouteName="ManagerMain"
      logoutButton={false}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        {managerFormList.length === 0 ? (
          // ✅ 빈 상태
          <View style={styles.centerContainer}>
            <Typo style={styles.emptyText}>견적 내역이 없습니다.</Typo>
          </View>
        ) : (
          // ✅ 실제 데이터 렌더링
          managerFormList.map((item, index) => (
            <EstimateCard
              key={item.managerFormId}
              name={item.chiefMournerName}
              date={formatDate(item.createdAt)}
              count={item.bidCount}
              status={getStatusText(item.formStatus)}
              index={index}
              onPress={() => goToClientEstimate(item.managerFormId)}
              data={item}
            />
          ))
        )}
      </ScrollView>
    </DefaultLayout>
  );
};

export default EstimateListPage;

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tag: {
    backgroundColor: '#eee',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F7CFF',
  },
});
