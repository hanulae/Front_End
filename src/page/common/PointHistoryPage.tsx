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

// BSK ADD IMPORTS

import {useAtomValue} from 'jotai';
import {loginAtom} from '../../state/local_state/loginAtom';
import api from '../../api/config';

interface ITransaction {
  id: string;
  assetType: 'point' | 'cash';
  transactionType: 'earn' | 'refund';
  transactionDate: string;
  amount: number;
  balance: number;
}

const PointHistoryPage = () => {
  // BSK ADD LOGIN INFO
  const loginInfo = useAtomValue(loginAtom);
  const [currentPoint, setCurrentPoint] = useState<number>(0);
  const [currentCash, setCurrentCash] = useState<number>(0);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);

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

          const pointRes = await api.get(pointUrl, {
            headers: {
              Authorization: `Bearer ${loginInfo.accessToken}`,
            },
          });
          setCurrentPoint(pointRes.data.currentPoint || 0);

          const cashRes = await api.get(cashUrl, {
            headers: {
              Authorization: `Bearer ${loginInfo.accessToken}`,
            },
          });
          setCurrentCash(cashRes.data.currentCash || 0);

          // Fetch transaction history
          const historyUrl = isManager
            ? '/manager/cash/history/list'
            : '/funeral/cash/history/list';
          const historyRes = await api.get(historyUrl);
          console.log('🚀 ~ fetchPointAndCash ~ historyRes:', historyRes);
          console.log('🚀 ~ historyRes.data:', historyRes.data);
          console.log('🚀 ~ historyRes.data.data:', historyRes.data.data);

          // API 응답 데이터를 PointHistoryCard 형식에 맞게 변환
          const transformedTransactions = (historyRes.data.data || []).map(
            (transaction: any) => {
              console.log('🚀 ~ processing transaction:', transaction);
              const transformed = {
                id:
                  transaction.managerCashHistoryId ||
                  transaction.funeralCashHistoryId,
                assetType: transaction.transactionType?.includes('cash')
                  ? 'cash'
                  : 'point',
                transactionType: transaction.transactionType?.includes('earn')
                  ? 'earn'
                  : 'refund',
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
              };
              console.log('🚀 ~ transformed transaction:', transformed);
              return transformed;
            },
          );

          console.log(
            '🚀 ~ final transformedTransactions:',
            transformedTransactions,
          );
          setTransactions(transformedTransactions);
        } catch (error: any) {
          console.error(
            '잔액 조회 실패:',
            error.response?.data || error.message,
          );
        }
      };

      fetchPointAndCash();
    }, [variant, loginInfo.accessToken]),
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

  return (
    <DefaultLayout
      headerShown={true}
      color="white"
      top={true}
      backButton={true}
      homeButton={true}
      homeRouteName={variant === 'manager' ? 'ManagerMain' : 'FuneralMain'}
      headerTitle="포인트 내역">
      <View style={styles.wrapper}>
        <View style={styles.pointSection}>
          <View style={styles.pannel}>
            <View style={styles.pointContainer}>
              <Typo style={styles.titleText}>보유 포인트</Typo>
              <View style={styles.pointValueConainer}>
                <Typo style={styles.pointValue}>
                  {currentPoint.toLocaleString()}
                </Typo>
                <PointIcon />
              </View>
            </View>
            <View style={styles.cashContainer}>
              <Typo style={styles.titleText}>캐시 포인트</Typo>
              <View style={styles.cashValueConainer}>
                <Typo style={styles.cashValue}>
                  {currentCash.toLocaleString()}
                </Typo>
                <CashIcon />
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              style={styles.actionButton}
              onPress={handlePointCharge}>
              <Typo style={styles.actionButtonText}>
                {variant === 'manager' ? '환급' : '포인트 충전'}
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
              <SelectIcon width={16} height={16} />
            </CustomButton>
          </View>
          <ScrollView contentContainerStyle={styles.card}>
            {(() => {
              console.log('🚀 ~ rendering transactions:', transactions);
              return transactions.length === 0 ? (
                <View style={{padding: 20, alignItems: 'center'}}>
                  <Typo style={{color: '#666', fontSize: 16}}>
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
                  />
                ))
              );
            })()}
          </ScrollView>
        </View>
        <TypeBottomSheet
          visible={typeSheetVisible}
          onClose={() => setTypeSheetVisible(false)}
          onConfirm={() => setTypeSheetVisible(false)}
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 10,
    borderBottomColor: '#E5E5E5',
  },
  pannel: {
    flexDirection: 'column',
    backgroundColor: '#2D81F1',
    borderRadius: 15,
    marginBottom: 16,
  },
  pointContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 23,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Regular',
  },
  pointValueConainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pointValue: {
    fontSize: 20,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'GmarketSansTTFBold',
  },
  cashValueConainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cashValue: {
    fontSize: 20,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'GmarketSansTTFBold',
  },
  cashContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 23,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  historySection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  historySelector: {
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  historySelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 24,
  },
  historySelectorText: {
    fontSize: 16,
    fontWeight: 600,
    color: '#000000',
    fontFamily: 'Pretendard-Bold',
  },
  card: {
    gap: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D81F1',
    fontFamily: 'Pretendard-SemiBold',
  },
});
