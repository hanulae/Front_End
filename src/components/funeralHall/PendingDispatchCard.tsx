import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Typo from '../common/Typo';
import CustomButton from '../common/CustomButton';
import {scaleFontSize, scaleSize} from '../../utils/responsive';

interface IPendingDispatchCardProps {
  index: number;
  onPress: () => void; // 카드 전체 클릭
  onBidDetailPress?: () => void; // 입찰 상세 보기 버튼 클릭
  status: string;
  name: string;
}

const PendingDispatchCard = ({
  index,
  onPress,
  onBidDetailPress,
  status,
  name,
}: IPendingDispatchCardProps) => {
  return (
    <TouchableOpacity style={styles.card} key={index} onPress={onPress}>
      <View style={styles.topRow}>
        <Typo style={styles.clientName}>{name}</Typo>
        <Typo style={styles.clientDesc}>고객님</Typo>
      </View>
      <View style={styles.bottomRow}>
        <View
          style={[
            styles.statusTag,
            status === '출동 요청' && styles.requestDispatchTag,
            status === '출동 승인' && styles.approvedTag,
            status === '출동 거절' && styles.rejectedTag,
            status === '출동 취소' && styles.cancelledTag,
          ]}>
          <Typo
            style={[
              styles.statusText,
              status === '출동 요청' && styles.requestDispatchText,
              status === '출동 승인' && styles.approvedText,
              status === '출동 거절' && styles.rejectedText,
              status === '출동 취소' && styles.cancelledText,
            ]}>
            {status}
          </Typo>
        </View>
        <CustomButton 
          style={styles.detailButton} 
          onPress={() => {
            if (onBidDetailPress) {
              onBidDetailPress();
            } else {
              onPress(); // 폴백으로 기본 onPress 사용
            }
          }}>
          <Typo style={styles.detailButtonText}>입찰 상세 보기</Typo>
        </CustomButton>
      </View>
    </TouchableOpacity>
  );
};

export default PendingDispatchCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: scaleSize(12),
    marginBottom: scaleSize(16),
  },
  topRow: {
    flexDirection: 'row',
    borderTopLeftRadius: scaleSize(15),
    borderTopRightRadius: scaleSize(15),
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingVertical: scaleSize(10),
    paddingHorizontal: scaleSize(30),
    justifyContent: 'flex-start',
  },
  clientName: {
    fontSize: scaleFontSize(18),
    lineHeight: scaleFontSize(24),
    fontWeight: '700',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },
  clientDesc: {
    fontSize: scaleFontSize(18),
    lineHeight: scaleFontSize(24),
    fontWeight: '600',
    color: '#283042',
    fontFamily: 'Pretendard-Medium',
    marginLeft: scaleSize(8),
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: scaleSize(15),
    borderBottomRightRadius: scaleSize(15),
    paddingVertical: scaleSize(10),
    paddingHorizontal: scaleSize(30),
  },
  detailButton: {
    paddingVertical: scaleSize(8),
  },
  detailButtonText: {
    fontSize: scaleFontSize(14),
    fontWeight: '500',
    color: '#6F717D',
    fontFamily: 'Pretendard-Medium',
    textDecorationLine: 'underline',
  },
  statusTag: {
    borderRadius: scaleSize(100),
    paddingHorizontal: scaleSize(10),
    paddingVertical: scaleSize(5),
    backgroundColor: '#FFFFFF',
  },
  requestDispatchTag: {
    borderWidth: 1,
    borderColor: 'rgba(45, 129, 241, 0.25)',
  },
  approvedTag: {
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  rejectedTag: {
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  cancelledTag: {
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  completedTag: {
    borderWidth: 1,
    borderColor: 'rgba(40, 48, 66, 0.25)',
  },
  statusText: {
    fontSize: scaleFontSize(14),
    fontWeight: '500',
    fontFamily: 'Pretendard-Black',
  },
  requestDispatchText: {
    color: '#2D81F1',
  },
  approvedText: {
    color: '#10B981',
  },
  completedText: {
    color: '#283042',
  },
  rejectedText: {
    color: '#EF4444',
  },
  cancelledText: {
    color: '#EF4444',
  },
});
