import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Typo from '../common/Typo';
import RequestIcon from '../../assets/Contents/Contents_Request.svg';
import SendIcon from '../../assets/Contents/Contents_Send.svg';
import {scaleFontSize, scaleSize} from '../../utils/responsive';

interface IQuoteCard {
  id: string;
  name: string;
  date: string;
  status: string;
  requestedAt: string;
  sentAt: string;
  onPress: () => void;
}

const QuoteCard = ({
  id: _id,
  name,
  date,
  status,
  requestedAt,
  sentAt,
  onPress,
}: IQuoteCard) => {
  // 상태에 따른 스타일 반환 함수
  const getStatusStyle = (status: string) => {
    switch (status) {
      case '입찰 요청':
        return styles.statusPending;
      case '입찰 제출':
        return styles.statusSubmitted;
      case '입찰 성공':
        return styles.statusSelected;
      case '거래 진행중':
        return styles.statusProgress;
      case '거래 완료': // 거래 완료
        return styles.statusCompleted;
      case '입찰 실패':
        return styles.statusRejected;
      case '입찰 마감':
        return styles.statusExpired;
      default:
        return styles.statusDefault;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <View style={styles.topRowName}>
          <Typo style={styles.name}>{name}</Typo>
          <Typo style={styles.divider}>|</Typo>
          <Typo style={styles.date}>{date}</Typo>
        </View>
        <View style={[styles.topRowStatus, getStatusStyle(status)]}>
          <Typo style={styles.status}>{status}</Typo>
        </View>
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.requestBox}>
          <View style={styles.requestTitle}>
            <Typo style={styles.bottomText}>요청시각</Typo>
            <RequestIcon width={20} height={20} />
          </View>
          <Typo style={styles.requestDate}>{requestedAt}</Typo>
        </View>
        <View style={styles.sendBox}>
          <View style={styles.sendTitle}>
            <Typo style={styles.bottomText}>발송시각</Typo>
            <SendIcon width={20} height={20} />
          </View>
          <Typo style={styles.sendDate}>{sentAt}</Typo>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default QuoteCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: scaleSize(15),
    backgroundColor: '#FFFFFF',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: scaleSize(23),
    paddingHorizontal: scaleSize(20),
    alignItems: 'center',
  },
  topRowName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleSize(15),
  },
  name: {
    fontSize: scaleFontSize(16),
    fontWeight: '600',
    color: '#1C212A',
    fontFamily: 'Pretendard-Bold',
    lineHeight: scaleFontSize(20),
  },
  divider: {
    fontSize: scaleFontSize(16),
    fontWeight: '600',
    color: 'rgba(175, 179, 187, 0.25)',
    fontFamily: 'Pretendard-Black',
    lineHeight: scaleFontSize(20),
  },
  date: {
    fontSize: scaleFontSize(14),
    fontWeight: '500',
    color: '#8990A0',
    fontFamily: 'Pretendard-Bold',
    lineHeight: scaleFontSize(20),
  },
  topRowStatus: {
    borderRadius: scaleSize(100),
    paddingHorizontal: scaleSize(10),
  },
  status: {
    fontSize: scaleFontSize(12),
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: scaleFontSize(30),
    fontFamily: 'Pretendard-Black',
  },
  statusPending: {
    backgroundColor: '#CDD1D7', // 회색 - 입찰 대기
  },
  statusSubmitted: {
    backgroundColor: '#3287F8', // 파란색 - 입찰 완료
  },
  statusSelected: {
    backgroundColor: '#10B981', // 초록색 - 입찰 선택됨
  },
  statusProgress: {
    backgroundColor: '#F59E0B', // 주황색 - 진행중
  },
  statusCompleted: {
    backgroundColor: '#283042', // 검정색 - 거래 완료
  },
  statusRejected: {
    backgroundColor: '#EF4444', // 빨간색 - 거절됨
  },
  statusExpired: {
    backgroundColor: '#EF4444', // 회색 - 만료됨
  },
  statusDefault: {
    backgroundColor: '#6B7280', // 기본 회색 - 상태 불명
  },
  bottomRow: {
    flexDirection: 'row',
    paddingVertical: scaleSize(16),
    paddingHorizontal: scaleSize(20),
  },
  requestBox: {
    flex: 1,
    paddingVertical: scaleSize(10),
    paddingHorizontal: scaleSize(16),
    backgroundColor: 'rgba(231, 232, 242, 0.2)',
    borderTopLeftRadius: scaleSize(10),
    borderBottomLeftRadius: scaleSize(10),
    minHeight: scaleSize(60),
    justifyContent: 'center',
  },
  requestTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleSize(4),
  },
  requestDate: {
    fontSize: scaleFontSize(12),
    fontWeight: '500',
    lineHeight: scaleFontSize(20),
    color: '#4B99FE',
    fontFamily: 'Pretendard-Bold',
    textAlign: 'center',
  },
  sendBox: {
    flex: 1,
    paddingVertical: scaleSize(10),
    paddingHorizontal: scaleSize(16),
    backgroundColor: 'rgba(231, 232, 242, 0.2)',
    borderTopRightRadius: scaleSize(10),
    borderBottomRightRadius: scaleSize(10),
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(90, 90, 90, 0.2)',
    minHeight: scaleSize(60),
    justifyContent: 'center',
  },
  sendTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleSize(4),
  },
  sendDate: {
    fontSize: scaleFontSize(12),
    fontWeight: '500',
    lineHeight: scaleFontSize(20),
    color: '#4B99FE',
    fontFamily: 'Pretendard-Bold',
    textAlign: 'center',
  },
  bottomText: {
    fontSize: scaleFontSize(12),
    fontWeight: '700',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
    lineHeight: scaleFontSize(20),
  },
});
