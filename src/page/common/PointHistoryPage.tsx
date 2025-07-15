import {ScrollView, StyleSheet, View} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import {
  useFocusEffect,
  useRoute,
  useNavigation,
} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import {Platform, StatusBar} from 'react-native';
import Typo from '../../components/common/Typo';
import PointIcon from '../../assets/Bullet/Bullet_PointBlue.svg';
import CashIcon from '../../assets/Bullet/Bullet_CoinYellow.svg';
import CustomButton from '../../components/common/CustomButton';
import SelectIcon from '../../assets/Icon/Icon_DropDown03.svg';
import PointHistoryCard from '../../components/common/PointHistoryCard';
import TypeBottomSheet from '../../components/common/TypeBottomSheet';
import { scaleFontSize, scaleSize, isSmallDevice } from '../../utils/responsive';

// BSK ADD IMPORTS
import api from '../../api/config';

interface ITransaction {
  id: string;
  assetType: 'point' | 'cash';
  transactionType: 'earn' | 'refund';
  transactionDate: string;
  amount: number;
  balance: number;
  status: 'pending' | 'completed';
}

const PointHistoryPage = () => {
  // BSK ADD LOGIN INFO
  // const loginInfo = useAtomValue(loginAtom); // Remove unused variable
  const [currentPoint, setCurrentPoint] = useState<number>(0);
  const [currentCash, setCurrentCash] = useState<number>(0);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<ITransaction[]>([]);

  // BSK ADD VARIANT
  const route = useRoute();
  const navigation = useNavigation<any>();
  const {variant} = route.params as {variant: 'manager' | 'funeral'};
  console.log('variant', variant);
  console.log('route.params', route.params);

  const [typeSheetVisible, setTypeSheetVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('전체');
  const [selectedType, setSelectedType] = useState('전체');
  const [selectedOrder, setSelectedOrder] = useState('최신순');

  useFocusEffect(
    useCallback(() => {
      console.log('useFocusEffect triggered with variant:', variant);
      if (!variant) {
        console.log('variant is undefined or null');
        return;
      }
      const fetchPointAndCash = async () => {
        try {
          const isManager = variant === 'manager';
          console.log('isManager', isManager);
          console.log('variant type:', typeof variant);
          console.log('variant value:', variant);

          const pointUrl = isManager
            ? '/manager/point/current'
            : '/funeral/point/current';
          const cashUrl = isManager
            ? '/manager/cash/current'
            : '/funeral/cash/current';
          console.log('pointUrl', pointUrl);
          console.log('cashUrl', cashUrl);

          const pointRes = await api.get(pointUrl);
          setCurrentPoint(pointRes.data.currentPoint || 0);

          const cashRes = await api.get(cashUrl);
          setCurrentCash(cashRes.data.currentCash || 0);

          // Fetch transaction history
          const historyUrl = isManager
            ? '/manager/cash/history/list'
            : '/funeral/cash/history/list';
          const historyRes = await api.get(historyUrl);
          // console.log('🚀 ~ fetchPointAndCash ~ historyRes:', historyRes);
          // console.log('🚀 ~ historyRes.data:', historyRes.data);
          // console.log('🚀 ~ historyRes.data.data:', historyRes.data.data);

          // API 응답 데이터를 PointHistoryCard 형식에 맞게 변환
          const transformedTransactions = (historyRes.data.data || []).map(
            (transaction: any) => {
              const transformed = {
                id:
                  transaction.managerCashHistoryId ||
                  transaction.funeralCashHistoryId,
                assetType: transaction.transactionType?.includes('cash')
                  ? 'cash'
                  : 'point',
                transactionType: (() => {
                  const type = transaction.transactionType;
                  if (
                    type?.includes('earn_cash') ||
                    type?.includes('service_cash')
                  ) {
                    return 'earn';
                  } else if (
                    type?.includes('use_cash') ||
                    type?.includes('withdraw_cash')
                  ) {
                    return 'refund';
                  }
                  return 'earn'; // 기본값
                })(),
                transactionDate: new Date(
                  transaction.transactionDate,
                ).toLocaleDateString('ko-KR'),
                amount:
                  transaction.managerCashAmount ||
                  transaction.funeralCashAmount ||
                  0,
                balance:
                  transaction.managerCashBalanceAfter ||
                  transaction.funeralCashBalanceAfter ||
                  0,
                status: transaction.status,
              };
              return transformed;
            },
          );

          console.log(
            '🚀 ~ final transformedTransactions:',
            transformedTransactions,
          );
          setAllTransactions(transformedTransactions);
          setTransactions(transformedTransactions);
        } catch (error: any) {
          console.error(
            '잔액 조회 실패:',
            error.response?.data || error.message,
          );
        }
      };

      fetchPointAndCash();
    }, [variant]),
  );

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

  const handlePointCharge = () => {
    // 포인트 충전 페이지로 이동
    // navigation.navigate('PointCharge', {variant});
    navigation.navigate('PointRefund', {variant});
  };

  // 필터링 함수
  const filterTransactions = () => {
    let filtered = [...allTransactions];
    // 유형 필터
    if (selectedType !== '전체') {
      filtered = filtered.filter(t =>
        selectedType === '적립'
          ? t.transactionType === 'earn'
          : t.transactionType === 'refund',
      );
    }
    // 기간 필터 (예시: '1개월', '3개월')
    if (selectedPeriod !== '전체') {
      const now = new Date();
      let fromDate = new Date();
      if (selectedPeriod === '1개월') {
        fromDate.setMonth(now.getMonth() - 1);
      } else if (selectedPeriod === '3개월') {
        fromDate.setMonth(now.getMonth() - 3);
      }
      filtered = filtered.filter(t => {
        const date = new Date(t.transactionDate);
        return date >= fromDate && date <= now;
      });
    }
    // 정렬
    if (selectedOrder === '최신순') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.transactionDate).getTime();
        const dateB = new Date(b.transactionDate).getTime();
        return dateB - dateA;
      });
    } else {
      filtered.sort((a, b) => {
        const dateA = new Date(a.transactionDate).getTime();
        const dateB = new Date(b.transactionDate).getTime();
        return dateA - dateB;
      });
    }
    setTransactions(filtered);
  };

  // TypeBottomSheet 확인 시 필터링 적용
  const handleTypeSheetConfirm = () => {
    setTypeSheetVisible(false);
    filterTransactions();
  };

  return (
    <DefaultLayout
      headerShown={true}
      color="white"
      top={true}
      backButton={true}
      homeButton={true}
      homeRouteName={variant === 'manager' ? 'ManagerMain' : 'FuneralMain'}
      headerTitle="캐시 내역">
      <View style={styles.wrapper}>
        <View style={styles.pointSection}>
          <View style={styles.pannel}>
            {/* <View style={styles.pointContainer}>
              <Typo style={styles.titleText}>보유 포인트</Typo>
              <View style={styles.pointValueConainer}>
                <Typo style={styles.pointValue}>
                  {currentPoint.toLocaleString()}
                </Typo>
                <PointIcon width={scaleSize(24)} height={scaleSize(24)} />
              </View>
            </View> */}
            <View style={styles.cashContainer}>
              <Typo style={styles.titleText}>캐시 포인트</Typo>
              <View style={styles.cashValueConainer}>
                <Typo style={styles.cashValue}>
                  {currentCash.toLocaleString()}
                </Typo>
                <CashIcon width={scaleSize(24)} height={scaleSize(24)} />
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              style={styles.actionButton}
              onPress={handlePointCharge}>
              <Typo style={styles.actionButtonText}>
                {variant === 'manager' ? '캐시 환급' : '캐시 충전'}
              </Typo>
            </CustomButton>
          </View>
        </View>
        <View style={styles.historySection}>
          <View style={styles.historySelector}>
            <CustomButton
              style={styles.historySelectorButton}
              onPress={() => setTypeSheetVisible(true)}>
              <Typo style={styles.historySelectorText}>유형</Typo>
              <SelectIcon width={scaleSize(16)} height={scaleSize(16)} />
            </CustomButton>
          </View>
          <ScrollView contentContainerStyle={styles.card}>
            {(() => {
              console.log('🚀 ~ rendering transactions:', transactions);
              return transactions.length === 0 ? (
                <View style={{padding: scaleSize(20), alignItems: 'center'}}>
                  <Typo style={{color: '#666', fontSize: scaleFontSize(16)}}>
                    거래 내역이 없습니다.
                  </Typo>
                </View>
              ) : (
                transactions.map(item => (
                  <PointHistoryCard
                    key={item.id}
                    assetType={item.assetType as 'point' | 'cash'}
                    transactionType={item.transactionType as 'earn' | 'refund'}
                    transactionDate={item.transactionDate}
                    amount={item.amount}
                    balance={item.balance}
                    status={item.status as 'pending' | 'completed'}
                  />
                ))
              );
            })()}
          </ScrollView>
        </View>
        <TypeBottomSheet
          visible={typeSheetVisible}
          onClose={() => setTypeSheetVisible(false)}
          onConfirm={handleTypeSheetConfirm}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />
      </View>
    </DefaultLayout>
  );
};

export default PointHistoryPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pointSection: {
    paddingHorizontal: scaleSize(20),
    paddingVertical: scaleSize(20),
    borderBottomWidth: 10,
    borderBottomColor: '#E5E5E5',
  },
  pannel: {
    flexDirection: 'column',
    backgroundColor: '#2D81F1',
    borderRadius: scaleSize(15),
    marginBottom: scaleSize(16),
  },
  pointContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(20),
    paddingVertical: scaleSize(23),
  },
  titleText: {
    fontSize: scaleFontSize(14),
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Regular',
  },
  pointValueConainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleSize(10),
  },
  pointValue: {
    fontSize: scaleFontSize(isSmallDevice ? 18 : 20),
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'GmarketSansTTFBold',
  },
  cashValueConainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleSize(10),
  },
  cashValue: {
    fontSize: scaleFontSize(isSmallDevice ? 18 : 20),
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'GmarketSansTTFBold',
  },
  cashContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(20),
    paddingVertical: scaleSize(23),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  historySection: {
    flex: 1,
    paddingHorizontal: scaleSize(20),
    paddingVertical: scaleSize(20),
  },
  historySelector: {
    justifyContent: 'flex-start',
    marginBottom: scaleSize(20),
  },
  historySelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: scaleSize(24),
  },
  historySelectorText: {
    fontSize: scaleFontSize(16),
    fontWeight: 600,
    color: '#000000',
    fontFamily: 'Pretendard-Bold',
  },
  card: {
    gap: scaleSize(10),
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: scaleSize(12),
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: scaleSize(8),
    paddingVertical: scaleSize(12),
    paddingHorizontal: scaleSize(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: scaleFontSize(14),
    fontWeight: '600',
    color: '#2D81F1',
    fontFamily: 'Pretendard-SemiBold',
  },
});
