import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Typo from './Typo';
import CheckCircleOffIcon from '../../assets/Check/Check01=Check01_default.svg';
import CheckCircleOnIcon from '../../assets/Check/Check01=Check01_Active.svg';
interface IConvenienceSelectorProps {
  data: {
    funeral_parking_lot: boolean; // 주차장
    funeral_store: boolean; // 매점
    funeral_family_waiting_room: boolean; // 가족 대기실
    funeral_disabled_facility: boolean; // 장애인 시설
  };
  onToggle: (key: keyof IConvenienceSelectorProps['data']) => void;
}

const CONVENIENCE_LABELS: {
  label: string;
  key: keyof IConvenienceSelectorProps['data'];
}[] = [
  {label: '주차장', key: 'funeral_parking_lot'},
  {label: '매점', key: 'funeral_store'},
  {label: '가족 대기실', key: 'funeral_family_waiting_room'},
  {label: '장애인 시설', key: 'funeral_disabled_facility'},
];

const ConvenienceSelector = ({data, onToggle}: IConvenienceSelectorProps) => {
  return (
    <View style={styles.container}>
      {Array.from({length: 2}).map((_, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {CONVENIENCE_LABELS.slice(rowIndex * 2, rowIndex * 2 + 2).map(
            ({label, key}) => (
              <TouchableOpacity
                key={key}
                style={styles.button}
                onPress={() => onToggle(key)}>
                <View style={styles.contentWrapper}>
                  {data[key] ? (
                    <CheckCircleOnIcon
                      width={18}
                      height={18}
                      style={styles.icon}
                    />
                  ) : (
                    <CheckCircleOffIcon
                      width={18}
                      height={18}
                      style={styles.icon}
                    />
                  )}
                  <Typo style={styles.labelText}>{label}</Typo>
                </View>
              </TouchableOpacity>
            ),
          )}
        </View>
      ))}
    </View>
  );
};

export default ConvenienceSelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginTop: 20,
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 좌우 정렬
    marginBottom: 16,
    paddingHorizontal: 20, // 화면 가로 여백 고려
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  labelText: {
    fontSize: 16,
    color: '#283042', // 선택/비선택 모두 동일
    fontWeight: '600',
    fontFamily: 'Pretendard-Medium',
  },
  icon: {
    marginRight: 8,
  },
  buttonActive: {
    backgroundColor: '#2D81F1',
  },
  buttonInactive: {
    backgroundColor: '#E6EAF3',
  },
});
