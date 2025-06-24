import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Typo from '../common/Typo';
import CheckActiveIcon from '../../assets/Check/Check01=Check01_Active.svg';
import CheckinActiveIcon from '../../assets/Check/Check01=Check01_default.svg';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

interface IFuneralQuoteCardProps {
  id: string;
  handleSelect: (id: string) => void;
  selected: boolean;
  name: string;
  address: string;
  completed: boolean;
  status: string;
  selectable: boolean;
}

const FuneralQuoteCard = ({
  id,
  handleSelect,
  selected,
  name,
  address,
  completed,
  status,
  selectable,
}: IFuneralQuoteCardProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case '입찰대기':
        return {
          borderColor: '#A7A9B0',
          textColor: '#FFFFFF',
          backgroundColor: '#A7A9B0',
        };
      case '입찰완료':
        return {
          borderColor: '#2D81F1',
          textColor: '#1565C0',
          backgroundColor: '#E2F2FF',
        };
      case '입찰실패':
        return {
          borderColor: '#FF6F00',
          textColor: '#E65100',
          backgroundColor: '#FFF3E0',
        };
      case '입찰만료':
        return {
          borderColor: '#FF6F00',
          textColor: '#E65100',
          backgroundColor: '#FFF3E0',
        };
      case '거래완료':
        return {
          borderColor: '#00C853',
          textColor: '#00695C',
          backgroundColor: '#E8F8F5',
        };
      default:
        return {
          borderColor: '#A7A9B0',
          textColor: '#666666',
          backgroundColor: '#F8F9FA',
        };
    }
  }

  const statusStyle = getStatusStyle(status);

  const goToClientDetail = () => {
    navigation.navigate('ClientDetail', {clientId: id});
  };

  return (
    <TouchableOpacity
      key={id}
      activeOpacity={0.8}
      style={[
        styles.card,
        selected ? styles.cardSelected : styles.cardUnselected,
      ]}
      onPress={() => handleSelect(id)}
      disabled={!selectable}>
      <View style={styles.row}>
        <View style={styles.firstRow}>
          <Typo style={[styles.nameText, selected && styles.selectedText]}>
            {name}
          </Typo>
          {selected ? (
            <CheckActiveIcon width={24} height={24} />
          ) : (
            <CheckinActiveIcon width={24} height={24} />
          )}
          {/* <Typo style={styles.addressText}>{address}</Typo> */}
        </View>
        <View style={styles.secondRow}>
          <Typo style={styles.addressText}>{address}</Typo>
          <View style={[styles.statusButton, {borderColor: statusStyle.borderColor, backgroundColor: statusStyle.backgroundColor}]}>
            <Typo
              style={[
                styles.statusButtonText,
                {color: statusStyle.textColor},
              ]}>
              {status}
            </Typo>
          </View>
        </View>
        <View style={styles.thirdRow}>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={goToClientDetail}>
            <Typo style={styles.detailText}>상세보기</Typo>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.checkWrapper}>
          <View
            style={[
              styles.checkCircle,
              selected
                ? styles.checkCircleSelected
                : completed
                ? styles.checkCircleCompletedOnly
                : styles.checkCircleUnselected,
            ]}
          />
        </View> */}
      </View>

      {/* <View style={styles.bottomRow}>
        <View style={styles.statusButton}>
          <Typo
            style={[
              styles.statusButtonText,
              completed ? styles.statusComplete : styles.statusPending,
            ]}>
            {status}
          </Typo>
        </View>
      </View> */}
    </TouchableOpacity>
  );
};

export default FuneralQuoteCard;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    // padding: 16,
    marginBottom: 16,
  },
  cardSelected: {
    borderColor: '#4F7CFF',
    backgroundColor: '#eef3ff',
  },
  cardUnselected: {
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  row: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 12,
  },
  firstRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  secondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  thirdRow: {},
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#283042',
    marginBottom: 6,
    fontFamily: 'Pretendard-Bold',
  },
  selectedText: {
    color: '#4F7CFF',
  },
  addressText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(111, 113, 125, 0.75)',
    fontFamily: 'Pretendard-Medium',
    // lineHeight: 22,
  },
  checkWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  checkCircleSelected: {
    borderColor: '#4F7CFF',
    backgroundColor: '#4F7CFF',
  },
  checkCircleCompletedOnly: {
    borderColor: '#4F7CFF',
    backgroundColor: '#ffffff',
  },
  checkCircleUnselected: {
    borderColor: '#ccc',
    backgroundColor: '#eee',
  },
  statusButton: {
    // marginTop: 12,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#ddd',
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Pretendard-Bold',
  },
  statusComplete: {
    color: '#2D81F1',
  },
  statusPending: {
    color: '#999',
  },
  bottomRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  detailButton: {
    // paddingVertical: 4,
    // paddingHorizontal: 8,
  },

  detailText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3A83E3',
    textDecorationLine: 'underline',
    textDecorationColor: '#3A83E3',
    fontFamily: 'Pretendard-Bold',
  },
  completedButton: {
    backgroundColor: '#E2F2FF',
  },
});
