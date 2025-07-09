import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Typo from '../common/Typo';
import CheckActiveIcon from '../../assets/Check/Check01=Check01_Active.svg';
import CheckinActiveIcon from '../../assets/Check/Check01=Check01_default.svg';

interface IFuneralQuoteCardProps {
  id: string;
  handleSelect: (id: string) => void;
  selected: boolean;
  name: string;
  address: string;
  _completed: boolean;
  status: string;
  selectable: boolean;
  managerFormId: string;
}

const FuneralQuoteCard = ({
  id,
  handleSelect,
  selected,
  name,
  address,
  _completed,
  status,
  selectable,
}: IFuneralQuoteCardProps) => {

  const getStatusStyle = (status: string) => {
    switch (status) {
      case '입찰대기':
        return {
          borderColor: '#9E9E9E',
          textColor: '#616161',
          backgroundColor: '#e3e5ee',
        };
      case '입찰완료':
        return {
          borderColor: '#2196F3',
          textColor: '#2196F3',
          backgroundColor: '#E2F2FF',
        };
      case '출동신청':
        return {
          borderColor: '#9C27B0',
          textColor: '#7B1FA2',
          backgroundColor: '#F3E0FF',
        };
      case '출동승인':
        return {
          borderColor: '#2196F3',
          textColor: '#2196F3',
          backgroundColor: '#E2F2FF',
        };
      case '입찰실패':
        return {
          borderColor: '#F44336',
          textColor: '#D32F2F',
          backgroundColor: '#FFF3E0',
        };
      case '입찰만료':
        return {
          borderColor: '#F44336',
          textColor: '#D32F2F',
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
  };

  const statusStyle = getStatusStyle(status);

  // ✅ 입찰만료나 입찰실패인지 확인
  const isExpiredOrFailed = status === '입찰만료' || status === '입찰실패';

  return (
    <TouchableOpacity
      key={id}
      activeOpacity={0.8}
      style={[
        styles.card,
        selected ? styles.cardSelected : styles.cardUnselected,
        // ✅ 입찰만료/실패시 흐리게 처리
        isExpiredOrFailed && styles.cardDisabled,
      ]}
      onPress={() => handleSelect(id)}
      disabled={!selectable || isExpiredOrFailed}>
      <View style={styles.row}>
        <View style={styles.firstRow}>
          <Typo style={[
            styles.nameText, 
            selected && styles.selectedText,
            // ✅ 입찰만료/실패시 텍스트도 흐리게
            isExpiredOrFailed && styles.disabledText,
          ]}>
            {name}
          </Typo>
          {selected ? (
            <CheckActiveIcon width={24} height={24} />
          ) : (
            <CheckinActiveIcon width={24} height={24} />
          )}
        </View>
        <View style={styles.secondRow}>
          <Typo 
            style={[
              styles.addressText,
              // ✅ 입찰만료/실패시 주소 텍스트도 흐리게
              isExpiredOrFailed && styles.disabledText,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {address}
          </Typo>
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
      </View>
    </TouchableOpacity>
  );
};

export default FuneralQuoteCard;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
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
    alignSelf: 'stretch',
    gap: 12,
  },
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
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(111, 113, 125, 0.75)',
    fontFamily: 'Pretendard-Medium',
  },
  statusButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#ddd',
    flexShrink: 0,
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Pretendard-Bold',
  },
  cardDisabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#999',
  },
});
