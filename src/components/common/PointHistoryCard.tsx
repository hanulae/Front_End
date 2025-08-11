import {StyleSheet, View} from 'react-native';
import PointIcon from '../../assets/Bullet/Bullet_PointBlue.svg';
import CashGrayIcon from '../../assets/Bullet/Bullet_CoinGray.svg';
import CalendarIcon from '../../assets/Bullet/Bullet_Date.svg';
import Typo from './Typo';
import {scaleFontSize, scaleSize, isSmallDevice} from '../../utils/responsive';

/**
 * 포인트/현금 거래내역 카드
 *
 * 목적:
 * - 거래 타입(적립/환급), 일시, 금액, 잔액, 상태를 한 카드에 표시
 * - 자산 타입(포인트/현금)에 따라 아이콘 분기
 *
 * 관리하는 상태값들:
 * - 없음 (완전 표시용 컴포넌트)
 *
 * 반응형:
 * - scaleSize/scaleFontSize 유틸로 디바이스 크기에 대응
 */
interface IPointHistoryCardProps {
  /** 자산 타입 (포인트/현금) */
  assetType: 'point' | 'cash';
  /** 거래 유형 (적립/환급) */
  transactionType: 'earn' | 'refund';
  /** 거래 일시 */
  transactionDate: string;
  /** 거래 금액 */
  amount: number;
  /** 거래 후 잔액 */
  balance: number;
  /** 상태 (대기/완료) */
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
  /** 아이콘 크기 (반응형) */
  const iconSize = scaleSize(24);

  return (
    <View style={styles.wrapper}>
      {/* 1행: 유형/상태 + 금액/아이콘 */}
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
          {/* 상태 추가 대비: cancelled 등의 확장을 고려 */}
          {status === 'cancelled' && (
            <Typo style={styles.cancelledText}>거절</Typo>
          )}
        </View>

        <View style={styles.amountContainer}>
          <Typo style={styles.amountText}>{amount}</Typo>
          {assetType === 'point' ? (
            <PointIcon width={iconSize} height={iconSize} />
          ) : (
            <CashGrayIcon width={iconSize} height={iconSize} />
          )}
        </View>
      </View>

      {/* 2행: 날짜 + 잔액 */}
      <View style={styles.secondRow}>
        <View style={styles.dateContainer}>
          <CalendarIcon width={iconSize} height={iconSize} />
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
    borderRadius: scaleSize(10),
  },
  firstRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: scaleSize(20),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167, 169, 176, 0.15)',
  },
  typeStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleSize(10),
  },
  pendingText: {
    fontSize: scaleFontSize(14),
    fontWeight: 500,
    color: '#283042',
    fontFamily: 'Pretendard-Bold',
  },
  completedText: {
    fontSize: scaleFontSize(14),
    fontWeight: 500,
    color: '#283042',
    fontFamily: 'Pretendard-Bold',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleSize(10),
  },
  amountText: {
    fontSize: scaleFontSize(isSmallDevice ? 15 : 17),
    fontWeight: 500,
    color: '#283042',
    fontFamily: 'GmarketSansTTFBold',
  },
  secondRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: scaleSize(20),
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleSize(10),
  },
  dateText: {
    fontSize: scaleFontSize(14),
    fontWeight: 500,
    color: '#A7A9B0',
    fontFamily: 'Pretendard-Medium',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleSize(20),
  },
  balanceTitle: {
    fontSize: scaleFontSize(14),
    fontWeight: 600,
    color: '#283042',
    fontFamily: 'Pretendard-Bold',
  },
  balanceText: {
    fontSize: scaleFontSize(14),
    fontWeight: 500,
    color: '#6F717D',
    fontFamily: 'Pretendard-Medium',
  },
  typeText: {
    fontSize: scaleFontSize(14),
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
