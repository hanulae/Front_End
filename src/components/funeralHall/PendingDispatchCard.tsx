import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Typo from '../common/Typo';
import CustomButton from '../common/CustomButton';

interface IPendingDispatchCardProps {
  index: number;
  onPress: () => void;
  status: string;
  name: string;
}

const PendingDispatchCard = ({
  index,
  onPress,
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
            status === '출동요청' && styles.requestDispatchTag,
            status === '출동중' && styles.dispatchingTag,
          ]}>
          <Typo
            style={[
              styles.statusText,
              status === '출동요청' && styles.requestDispatchText,
              status === '출동중' && styles.dispatchingText,
            ]}>
            {status}
          </Typo>
        </View>
        <CustomButton style={styles.detailButton} onPress={onPress}>
          <Typo style={styles.detailButtonText}>상세보기</Typo>
        </CustomButton>
      </View>
    </TouchableOpacity>
  );
};

export default PendingDispatchCard;

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
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 30,
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
  statusTag: {
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
  },
  requestDispatchTag: {
    borderWidth: 1,
    borderColor: 'rgba(45, 129, 241, 0.25)',
  },
  dispatchingTag: {
    borderWidth: 1,
    borderColor: 'rgba(25, 172, 65, 0.25)',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Pretendard-Black',
  },
  requestDispatchText: {
    color: '#2D81F1',
  },
  dispatchingText: {
    color: '#19AC41',
  },
});
