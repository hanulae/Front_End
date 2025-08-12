/**
 * 포인트 및 캐시 거래 내역을 조회하고 관리하는 페이지 컴포넌트
 * 현재 보유 포인트/캐시 표시, 거래 내역 필터링, 충전/환급 페이지 연결 기능 제공
 *
 * @props variant - 사용자 타입 ('manager' | 'funeral')
 * @libraries @react-navigation/native, jotai
 */
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
import {scaleFontSize, scaleSize, isSmallDevice} from '../../utils/responsive';
import api from '../../api/config';

// 거래 내역 인터페이스 정의
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
  const [currentPoint, setCurrentPoint] = useState<number>(0);
  const [currentCash, setCurrentCash] = useState<number>(0);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<ITransaction[]>([]);

  const route = useRoute();
  const navigation = useNavigation<any>();
  const {variant} = route.params as {variant: 'manager' | 'funeral'};

  const [typeSheetVisible, setTypeSheetVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('전체');
  const [selectedType, setSelectedType] = useState('전체');
  const [selectedOrder, setSelectedOrder] = useState('최신순');

  /**
   * 화면 포커스 시 포인트/캐시 잔액 및 거래 내역 조회
   * GET /manager|funeral/point/current - 현재 포인트 잔액을 가져오기 위함
   * GET /manager|funeral/cash/current - 현재 캐시 잔액을 가져오기 위함
   * GET /manager|funeral/cash/history/list - 캐시 거래 내역을 가져오기 위함
   */
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

          const pointUrl = isManager
            ? '/manager/point/current'
            : '/funeral/point/current';
          const cashUrl = isManager
            ? '/manager/cash/current'
            : '/funeral/cash/current';

          // 현재 포인트 잔액 조회
          const pointRes = await api.get(pointUrl);
          setCurrentPoint(pointRes.data.currentPoint || 0);

          // 현재 캐시 잔액 조회
          const cashRes = await api.get(cashUrl);
          setCurrentCash(res.data.currentCash || 0);

          // 거래 내역 조회
          const historyUrl = isManager
            ? '/manager/cash/history/list'
            : '/funeral/cash/history/list';
          const historyRes = await api.get(historyUrl);

          // API 응답 데이터를 UI에 맞는 형태로 변환
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
                  // 거래 타입에 따른 분기 처리
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

  /**
   * 화면 포커스 시 상태바 스타일 설정
   * Android와 iOS의 상태바 색상 및 스타일을 플랫폼별로 적용
   */
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

  /**
   * 포인트 충전/환급 페이지로 이동
   * variant에 따라 manager는 환급, funeral은 충전 페이지로 네비게이션
   */
  const handlePointCharge = () => {
    navigation.navigate('PointRefund', {variant});
  };

  /**
   * 거래 내역 필터링 처리
   * 선택된 유형, 기간, 정렬 조건에 따라 거래 내역을 필터링하고 정렬
   */
  const filterTransactions = () => {
    let filtered = [...allTransactions];

    // 유형 필터 적용 (적립/환급)
    if (selectedType !== '전체') {
      filtered = filtered.filter(t =>
        selectedType === '적립'
          ? t.transactionType === 'earn'
          : t.transactionType === 'refund',
      );
    }

    // 기간 필터 적용
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

    // 정렬 조건 적용 (최신순/오래된순)
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

  /**
   * 필터 바텀시트 확인 처리
   * 필터 조건을 적용하고 바텀시트를 닫음
   */
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
        {/* 포인트/캐시 잔액 표시 섹션 */}
        <View style={styles.pointSection}>
          <View style={styles.pannel}>
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

          {/* 충전/환급 버튼 */}
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

        {/* 거래 내역 섹션 */}
        <View style={styles.historySection}>
          {/* 필터 선택 버튼 */}
          <View style={styles.historySelector}>
            <CustomButton
              style={styles.historySelectorButton}
              onPress={() => setTypeSheetVisible(true)}>
              <Typo style={styles.historySelectorText}>유형</Typo>
              <SelectIcon width={scaleSize(16)} height={scaleSize(16)} />
            </CustomButton>
          </View>

          {/* 거래 내역 목록 */}
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

        {/* 필터 바텀시트 */}
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
