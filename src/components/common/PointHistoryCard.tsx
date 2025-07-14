import {StyleSheet, View} from 'react-native';
import PointIcon from '../../assets/Bullet/Bullet_PointBlue.svg';
import CashGrayIcon from '../../assets/Bullet/Bullet_CoinGray.svg';
import CalendarIcon from '../../assets/Bullet/Bullet_Date.svg';
import Typo from './Typo';

interface IPointHistoryCardProps {
  assetType: 'point' | 'cash';
  transactionType: 'earn' | 'refund';
  transactionDate: string;
  amount: number;
  balance: number;
  status: 'pending' | 'completed';
}

const PointHistoryCard = ({
  assetType,
  transactionType,
  transactionDate,
  amount,
  balance,
  status,
}: IPointHistoryCardProps) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.firstRow}>
        <View style={styles.typeStatusContainer}>
          <Typo
            style={[
              styles.typeText,
              transactionType === 'refund'
                ? styles.typeWithdraw
                : styles.typeDeposit,
            ]}>
            {transactionType === 'refund' ? '출금' : '적립'}
          </Typo>
          {status === 'pending' && (
            <Typo style={styles.pendingText}>대기중</Typo>
          )}
          {status === 'completed' && (
            <Typo style={styles.completedText}>완료</Typo>
          )}
          {status === 'cancelled' && (
            <Typo style={styles.cancelledText}>거절</Typo>
          )}
        </View>

        <View style={styles.amountContainer}>
          <Typo style={styles.amountText}>{amount}</Typo>
          {assetType === 'point' ? <PointIcon /> : <CashGrayIcon />}
        </View>
      </View>
      <View style={styles.secondRow}>
        <View style={styles.dateContainer}>
          <CalendarIcon />
          <Typo style={styles.dateText}>{transactionDate}</Typo>
        </View>
        <View style={styles.balanceContainer}>
          <Typo style={styles.balanceTitle}>잔액</Typo>
          <Typo style={styles.balanceText}>{balance}</Typo>
        </View>
      </View>
    </View>
  );
};

export default PointHistoryCard;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    backgroundColor: '#F8F9FB',
    borderRadius: 10,
  },
  firstRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167, 169, 176, 0.15)',
  },
  typeStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pendingText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#283042',
    fontFamily: 'Pretendard-Bold',
  },
  completedText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#283042',
    fontFamily: 'Pretendard-Bold',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  amountText: {
    fontSize: 17,
    fontWeight: 500,
    color: '#283042',
    fontFamily: 'GmarketSansTTFBold',
  },
  secondRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#A7A9B0',
    fontFamily: 'Pretendard-Medium',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  balanceTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#283042',
    fontFamily: 'Pretendard-Bold',
  },
  balanceText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#6F717D',
    fontFamily: 'Pretendard-Medium',
  },
  typeText: {
    fontSize: 14,
    fontWeight: 500,
    fontFamily: 'Pretendard-Bold',
  },
  typeDeposit: {
    color: '#2D81F1', // 입금(파란색)
  },
  typeWithdraw: {
    color: '#F04452', // 출금(빨간색)
  },
  cancelledText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#F04452',
    fontFamily: 'Pretendard-Bold',
  },
});
