import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Typo from '../common/Typo';
import DateIcon from '../../assets/Contents/Content_Time.svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface IEstimateCardProps {
  name: string;
  date: string;
  count: number;
  status: string;
  index: number;
  onPress: () => void;
  data: any;
}

const EstimateCard = ({
  name,
  date,
  count,
  status,
  index,
  onPress,
  data,
}: IEstimateCardProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case '견적 발송':
        return {
          borderColor: '#aed2ff', // 연한 파란색 - 대기 상태
          textColor: '#aed2ff',
        };
      case '입찰 요청':
        return {
          borderColor: '#3B82F6', // 진한 파란색 - 진행 중
          textColor: '#3B82F6',
        };
      case '출동 신청':
        return {
          borderColor: '#F59E0B', // 주황색 - 신청 상태 (활동적)
          textColor: '#F59E0B',
        };
      case '출동 승인':
        return {
          borderColor: '#10B981', // 초록색 - 승인됨 (성공)
          textColor: '#10B981',
        };
      case '거래 취소':
        return {
          borderColor: '#DC2626', // 빨간색 - 취소됨 (실패)
          textColor: '#DC2626',
        };
      default:
        return {
          borderColor: '#9CA3AF', // 연한 회색 - 기본 상태
          textColor: '#6B7280',
        };
    }
  };

  const statusStyle = getStatusStyle(status);

  const goToClientDetail = () => {
    navigation.navigate('ClientDetail', {data: data});
  };

  return (
    <TouchableOpacity key={index} style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <Typo style={styles.clientName}>{name} 고객님</Typo>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={goToClientDetail}>
            <Typo style={styles.detailText}>견적 상세</Typo>
          </TouchableOpacity>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.leftInfo}>
          <View style={[
            styles.tag,
            {
              backgroundColor: '#F8F9FA',
              borderColor: statusStyle.borderColor,
            }
          ]}>
            <Typo style={[
              styles.tagText,
              { color: statusStyle.textColor }
            ]}>
              {status}
            </Typo>
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
    justifyContent: 'space-between',
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
  detailButton: {
    paddingVertical: 4,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3A83E3',
    textDecorationLine: 'underline',
    textDecorationColor: '#3A83E3',
    fontFamily: 'Pretendard-Bold',
  },
});
