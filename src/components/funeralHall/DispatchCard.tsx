import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Typo from '../common/Typo';
import DateIcon from '../../assets/Contents/Content_Time.svg';
import CustomButton from '../common/CustomButton';
interface IDispatchCardProps {
  name: string;
  date: string;
  // count: number;
  index: number;
  onPress: () => void; // 카드 전체 클릭
  onBidDetailPress?: () => void; // 입찰 상세 정보 버튼 클릭
}

/**
 * 입찰 카드
 *
 * DispatchCard Props 인터페이스
 * @param name - 고객명
 * @param date - 날짜
 * @param index - 인덱스
 * @param onPress - 카드 전체 클릭 콜백
 * @param onBidDetailPress - 입찰 상세 정보 버튼 클릭 콜백
 *
 * 목적:
 * - 입찰 정보를 카드 형태로 표시
 * - 고객명, 날짜, 입찰 상세 정보 버튼 제공
 *
 * 관리하는 상태값들:
 * - 없음 (완전 표시용 컴포넌트)
 *
 * 반응형:
 * - scaleSize/scaleFontSize 유틸로 디바이스 크기에 대응
 */

const DispatchCard = ({
  name,
  date,
  // count,
  index,
  onPress,
  onBidDetailPress,
}: IDispatchCardProps) => {
  return (
    <TouchableOpacity key={index} style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <Typo style={styles.clientName}>{name}</Typo>
        <Typo style={styles.clientDesc}>고객님</Typo>
        <View style={styles.timeContainer}>
          <DateIcon width={14} height={14} />
          <Typo style={styles.dateText}>{date}</Typo>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.leftInfo}>
          <CustomButton
            style={styles.detailButton}
            onPress={() => {
              if (onBidDetailPress) {
                onBidDetailPress();
              } else {
                onPress(); // 폴백으로 기본 onPress 사용
              }
            }}>
            <Typo style={styles.detailButtonText}>입찰 상세 정보</Typo>
          </CustomButton>
        </View>
        {/* <View style={styles.countContainer}>
          <Typo style={styles.countText}>{count}</Typo>
          <Typo style={styles.countDesc}>건</Typo>
        </View> */}
      </View>
    </TouchableOpacity>
  );
};

export default DispatchCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    // padding: 16,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 30,
    justifyContent: 'flex-start',
    // alignContent: 'center',
    // alignItems: 'center',
    // borderWidth: 1,
  },
  clientName: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },
  clientDesc: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: '#283042',
    fontFamily: 'Pretendard-Medium',
    marginLeft: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A7A9B0',
    marginLeft: 8,
    fontFamily: 'Pretendard-Medium',
  },
  detailButton: {
    paddingVertical: 8,
  },
  detailButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6F717D',
    fontFamily: 'Pretendard-Medium',
    textDecorationLine: 'underline',
  },
});
