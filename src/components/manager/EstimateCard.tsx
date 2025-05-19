import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Typo from '../common/Typo';
import DateIcon from '../../assets/Contents/Content_Time.svg';
interface IEstimateCardProps {
  name: string;
  date: string;
  count: number;
  index: number;
  onPress: () => void;
}

const EstimateCard = ({
  name,
  date,
  count,
  index,
  onPress,
}: IEstimateCardProps) => {
  return (
    <TouchableOpacity key={index} style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <Typo style={styles.clientName}>{name}</Typo>
        <Typo style={styles.clientDesc}>고객님</Typo>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.leftInfo}>
          <View style={styles.tag}>
            <Typo style={styles.tagText}>견적요청</Typo>
          </View>
          <View style={styles.timeContainer}>
            <DateIcon width={14} height={14} />
            <Typo style={styles.dateText}>{date}</Typo>
          </View>
        </View>
        <View style={styles.countContainer}>
          <Typo style={styles.countText}>{count}</Typo>
          <Typo style={styles.countDesc}>건</Typo>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EstimateCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9f9',
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
    fontWeight: '700',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },
  clientDesc: {
    fontSize: 18,
    fontWeight: '600',
    color: '#283042',
    fontFamily: 'Pretendard-Medium',
    marginLeft: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  tag: {
    backgroundColor: 'white',
    borderColor: '#A7A9B0',
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 100,
  },
  tagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A7A9B0',
    marginLeft: 8,
    fontFamily: 'Pretendard-Medium',
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  countText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D81F1',
    fontFamily: 'GMarketSansTTFMedium',
  },
  countDesc: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8890A0',
    fontFamily: 'Pretendard-Medium',
  },
});
