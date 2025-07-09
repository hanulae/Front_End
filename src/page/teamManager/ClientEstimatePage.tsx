import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  View,
} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Typo from '../../components/common/Typo';
import {useCallback, useState} from 'react';
import FuneralQuoteCard from '../../components/manager/FuneralQuoteCard';
import CustomButton from '../../components/common/CustomButton';
import {useManagerForm} from '../../hooks/useManagerForm';
import {UserManagerFormList} from '../../services/api/manager/managerFormService';

const ClientEstimatePage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  const {managerFormId} = route.params as {managerFormId: string};
  const [selectedId, setSelectedId] = useState<string>('');
  const {getUserManagerFormList, loading, error} = useManagerForm();
  const [userManagerFormList, setUserManagerFormList] = useState<
    UserManagerFormList[]
  >([]);
  const [selectedFuneralName, setSelectedFuneralName] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  const loadUserManagerFormList = useCallback(async () => {
    try {
      const result = await getUserManagerFormList(managerFormId);
      if (result) {
        setUserManagerFormList(result);
      }
    } catch (error) {
      console.error('고객 견적서 리스트 로드 실패: ', error);
    }
  }, [getUserManagerFormList, managerFormId]);

  // 풀 투 리프레시 함수
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUserManagerFormList();
    setRefreshing(false);
  }, [loadUserManagerFormList]);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#3287F8');
        StatusBar.setBarStyle('dark-content');
      } else {
        StatusBar.setBarStyle('dark-content');
      }

      loadUserManagerFormList();

      return () => {
        // 화면 포커스 해제 시 필요하다면 초기화 작업
        // 예: StatusBar.setStyle('default')
      };
    }, [loadUserManagerFormList]),
  );

  // 견적서 선택 (단일 선택)
  const handleSelect = (id: string, funeralName: string) => {
    setSelectedId(id);
    setSelectedFuneralName(funeralName);
  };

  // 견적서 상세 보기
  const goToEstimateDetail = () => {
    navigation.navigate('EstimateDetail', {
      managerFormBidId: selectedId,
      funeralName: selectedFuneralName,
    });
  };

  const getStatusText = (
    status:
      | 'pending'
      | 'bid_submitted'
      | 'bid_selected'
      | 'bid_progress'
      | 'rejected'
      | 'expired'
      | 'transaction_completed',
  ) => {
    switch (status) {
      case 'pending':
        return '입찰대기';
      case 'bid_submitted':
        return '입찰완료';
      case 'bid_selected':
        return '출동신청';
      case 'bid_progress':
        return '출동승인';
      case 'rejected':
        return '입찰실패';
      case 'expired':
        return '입찰만료';
      case 'transaction_completed':
        return '거래완료';
      default:
        return status;
    }
  };

  // ✅ 로딩 상태
  if (loading) {
    return (
      <DefaultLayout
        headerShown={true}
        headerTitle="고객 견적서"
        homeButton={true}
        homeRouteName="ManagerMain"
        logoutButton={false}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3287F8" />
          <Typo style={styles.loadingText}>견적서를 불러오는 중...</Typo>
        </View>
      </DefaultLayout>
    );
  }

  // ✅ 에러 상태
  if (error) {
    return (
      <DefaultLayout
        headerShown={true}
        headerTitle="고객 견적서"
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
      headerTitle="고객 견적서"
      homeButton={true}
      homeRouteName="ManagerMain"
      logoutButton={false}>
      <ScrollView
        contentContainerStyle={styles.wrapper}
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
        {userManagerFormList.length === 0 ? (
          // ✅ 빈 상태
          <View style={styles.centerContainer}>
            <Typo style={styles.emptyText}>견적서가 없습니다.</Typo>
          </View>
        ) : (
          userManagerFormList.map(item => {
            const canSelect = item.bidStatus === 'bid_submitted';
            console.log('item.bidStatus', item.bidStatus);

            return (
              <FuneralQuoteCard
                key={item.managerFormBidId}
                id={item.managerFormBidId}
                handleSelect={
                  canSelect
                    ? () =>
                        handleSelect(item.managerFormBidId, item.funeralName)
                    : () => {}
                }
                selected={item.managerFormBidId === selectedId}
                name={item.funeralName}
                address={item.funeralAddress}
                completed={!canSelect}
                selectable={canSelect}
                status={getStatusText(item.bidStatus)}
                managerFormId={managerFormId}
              />
            );
          })
        )}
      </ScrollView>
      <CustomButton
        onPress={goToEstimateDetail}
        style={[
          styles.submitButton,
          selectedId ? styles.submitButtonEnabled : styles.submitButtonDisabled,
        ]}
        disabled={!selectedId}>
        <Typo style={styles.submitButtonText}>입찰 상세 보기</Typo>
      </CustomButton>
    </DefaultLayout>
  );
};

export default ClientEstimatePage;

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
  submitButton: {
    marginTop: 20,
    paddingVertical: 14,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  submitButtonEnabled: {
    backgroundColor: '#4F7CFF',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
