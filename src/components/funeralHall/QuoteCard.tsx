import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Typo from '../common/Typo';
import RequestIcon from '../../assets/Contents/Contents_Request.svg';
import SendIcon from '../../assets/Contents/Contents_Send.svg';

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
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <View style={styles.topRowName}>
          <Typo style={styles.name}>{name}</Typo>
          <Typo style={styles.divider}>|</Typo>
          <Typo style={styles.date}>{date}</Typo>
        </View>
        <View
          style={[
            styles.topRowStatus,
            status === '대기중' && styles.statusPending,
            status === '완료' && styles.statusComplete,
          ]}>
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
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 23,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  topRowName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C212A',
    fontFamily: 'Pretendard-Bold',
    lineHeight: 20,
  },
  divider: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(175, 179, 187, 0.25)',
    fontFamily: 'Pretendard-Black',
    lineHeight: 20,
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8990A0',
    fontFamily: 'Pretendard-Bold',
    lineHeight: 20,
  },
  topRowStatus: {
    borderRadius: 100,
    paddingHorizontal: 10,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 30,
    fontFamily: 'Pretendard-Black',
  },
  statusPending: {
    backgroundColor: '#CDD1D7',
  },
  statusComplete: {
    backgroundColor: '#283042',
  },
  bottomRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    justifyContent: 'center',
  },
  requestBox: {
    paddingVertical: 10,
    paddingHorizontal: 35,
    backgroundColor: 'rgba(231, 232, 242, 0.2)',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  requestTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestDate: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 24,
    color: '#4B99FE',
    fontFamily: 'Pretendard-Bold',
  },
  sendBox: {
    paddingVertical: 10,
    paddingHorizontal: 35,
    backgroundColor: 'rgba(231, 232, 242, 0.2)',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(90, 90, 90, 0.2)',
  },
  sendTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sendDate: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 20,
    color: '#4B99FE',
    fontFamily: 'Pretendard-Bold',
  },
  bottomText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
    lineHeight: 20,
  },
});
