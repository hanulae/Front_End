import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  View,
  Dimensions,
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

const {width: screenWidth} = Dimensions.get('window');

// 디바이스 크기에 따른 스케일 계산
const isTablet = screenWidth >= 768;
const isSmallDevice = screenWidth < 375;

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
    // bid_selected 상태가 있는지 체크
    const hasBidSelected = userManagerFormList.some(
      item => item.bidStatus === 'bid_selected'
    );

    navigation.navigate('EstimateDetail', {
      managerFormBidId: selectedId,
      funeralName: selectedFuneralName,
      hasBidSelected: hasBidSelected,
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
                _completed={!canSelect}
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
    padding: isTablet ? 24 : isSmallDevice ? 12 : 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: isTablet ? 28 : isSmallDevice ? 16 : 20,
  },
  loadingText: {
    marginTop: isTablet ? 24 : isSmallDevice ? 12 : 16,
    fontSize: isTablet ? 18 : isSmallDevice ? 14 : 16,
    color: '#666',
  },
  errorText: {
    fontSize: isTablet ? 18 : isSmallDevice ? 14 : 16,
    color: '#ff4444',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: isTablet ? 18 : isSmallDevice ? 14 : 16,
    color: '#999',
    textAlign: 'center',
  },
  submitButton: {
    marginTop: isTablet ? 28 : isSmallDevice ? 16 : 20,
    paddingVertical: isTablet ? 18 : isSmallDevice ? 12 : 14,
    marginHorizontal: isTablet ? 24 : isSmallDevice ? 12 : 16,
    borderRadius: isTablet ? 12 : isSmallDevice ? 6 : 8,
    alignItems: 'center',
    marginBottom: isTablet ? 40 : isSmallDevice ? 24 : 32,
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
    fontSize: isTablet ? 18 : isSmallDevice ? 14 : 16,
  },
});
