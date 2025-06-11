import {ScrollView, StyleSheet, View} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {useCallback} from 'react';
import {Platform, StatusBar} from 'react-native';
import Typo from '../../components/common/Typo';
import PointIcon from '../../assets/Bullet/Bullet_PointBlue.svg';
import CashIcon from '../../assets/Bullet/Bullet_CoinYellow.svg';
import CashGrayIcon from '../../assets/Bullet/Bullet_CoinGray.svg';
import CustomButton from '../../components/common/CustomButton';
import SelectIcon from '../../assets/Icon/Icon_DropDown03.svg';
import PointHistoryCard from '../../components/common/PointHistoryCard';

const DummyData = [
  {
    id: 1,
    assetType: 'point',
    transactionType: 'earn',
    transactionDate: '2025-05-30',
    amount: 50000,
    balance: 100000,
  },
  {
    id: 2,
    assetType: 'cash',
    transactionType: 'refund',
    transactionDate: '2025-05-30',
    amount: 50000,
    balance: 100000,
  },
  {
    id: 3,
    assetType: 'cash',
    transactionType: 'earm',
    transactionDate: '2025-05-30',
    amount: 50000,
    balance: 100000,
  },
];

const PointHistoryPage = () => {
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

  const route = useRoute();
  const {variant} = route.params as {variant: 'manager' | 'funeral'};

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
                <Typo style={styles.pointValue}>100,000</Typo>
                <PointIcon />
              </View>
            </View>
            <View style={styles.cashContainer}>
              <Typo style={styles.titleText}>캐시 포인트</Typo>
              <View style={styles.cashValueConainer}>
                <Typo style={styles.cashValue}>100,000</Typo>
                <CashIcon />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.historySection}>
          <View style={styles.historySelector}>
            <CustomButton
              style={styles.historySelectorButton}
              onPress={() => {}}>
              <Typo style={styles.historySelectorText}>유형</Typo>
              <SelectIcon width={16} height={16} />
            </CustomButton>
          </View>
          <ScrollView contentContainerStyle={styles.card}>
            {DummyData.map(item => (
              <PointHistoryCard
                key={item.id}
                assetType={item.assetType as 'point' | 'cash'}
                transactionType={item.transactionType as 'earn' | 'refund'}
                transactionDate={item.transactionDate}
                amount={item.amount}
                balance={item.balance}
              />
            ))}
          </ScrollView>
        </View>
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
});
