import {Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import {IEstimate} from '../../page/funeralHall/EstimateHistoryPage';
import Typo from '../common/Typo';
import RequestIcon from '../../assets/Contents/Contents_Request.svg';
import SendIcon from '../../assets/Contents/Contents_Send.svg';

interface IQuoteCard extends IEstimate {
  onPress: () => void;
}

const QuoteCard = ({
  id,
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
            <RequestIcon width={24} height={24} />
          </View>
          <Typo style={styles.requestDate}>{requestedAt}</Typo>
        </View>
        <View style={styles.sendBox}>
          <View style={styles.sendTitle}>
            <Typo style={styles.bottomText}>발송시각</Typo>
            <SendIcon width={24} height={24} />
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
    fontFamily: 'Pretendard-Black',
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
    fontFamily: 'Pretendard-Black',
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
    // borderBottomLeftRadius: 15,
    // borderBottomRightRadius: 15,
    paddingBottom: 23,
    paddingTop: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  requestBox: {
    paddingVertical: 10,
    paddingHorizontal: 35,
    backgroundColor: 'rgba(231, 232, 242, 0.2)',
  },
  requestTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestDate: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 20,
    color: '#4B99FE',
    fontFamily: 'Pretendard-Black',
  },
  sendBox: {
    paddingVertical: 10,
    paddingHorizontal: 35,
    backgroundColor: 'rgba(231, 232, 242, 0.2)',
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
    fontFamily: 'Pretendard-Black',
  },
  bottomText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
    lineHeight: 20,
  },
});
