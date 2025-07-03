import {StyleSheet, TextInput, View} from 'react-native';
import Typo from './Typo';

interface IInfoTableProps {
  editable: boolean;
  data: {
    규모: string;
    빈소: string;
    운영: string;
    형태: string;
  };
  onChange?: (key: keyof IInfoTableProps['data'], value: string) => void;
}
// Labels spec
// '규모' = funeral_scale
// '빈소' = funeral_total_rooms
// '운영' = funeral_operation_type
// '형태' = funeral_style
const LABELS = ['규모', '빈소', '운영', '형태'];

const InfoTable = ({editable, data, onChange}: IInfoTableProps) => {
  console.log('🏁 data:', data);
  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.row1}>
        {LABELS.map(label => (
          <Typo key={label} style={styles.headerText}>
            {label}
          </Typo>
        ))}
      </View>
      {/* 값 or 입력 */}
      <View style={styles.row2}>
        {LABELS.map(label => (
          <View key={label} style={styles.cell}>
            {editable ? (
              <TextInput
                style={styles.input}
                value={data[label as keyof typeof data]}
                onChangeText={text =>
                  onChange?.(label as keyof typeof data, text)
                }
              />
            ) : (
              <Typo style={styles.valueText}>
                {data[label as keyof typeof data]}
              </Typo>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default InfoTable;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FB',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(40, 48, 66, 0.1)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FB',
    justifyContent: 'space-around',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerText: {
    // flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#2D81F1',
    fontWeight: '600',
    fontFamily: 'Pretendard-Medium',
  },
  cell: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // 👈 중요: 세로 중앙 정렬
    minHeight: 40, // 👈 필수: 높이 확보
  },
  input: {
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'Pretendard-Medium',
    // paddingVertical: 4,
    color: '#283042', // 👈 혹시 몰라서 명시
    fontSize: 14, // 👈 너무 작지 않게
  },
  valueText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#000',
  },
});
