import {StyleSheet, View, TouchableOpacity} from 'react-native';
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

// 선택 옵션 정의
const SELECT_OPTIONS = {
  규모: ['소형', '중형', '대형'],
  운영: ['공설', '사설'],
  형태: ['병원', '전문'],
};

const InfoTable = ({editable, data, onChange}: IInfoTableProps) => {
  console.log('🏁 data:', data);

  const renderRow = (label: string) => {
    const value = data[label as keyof typeof data];

    if (label === '빈소') {
      // 빈소는 항상 읽기 전용
      return (
        <View style={styles.row}>
          <View style={styles.labelContainer}>
            <Typo style={styles.labelText}>{label}</Typo>
          </View>
          <View style={styles.valueContainer}>
            <Typo style={styles.valueText}>{value}</Typo>
          </View>
        </View>
      );
    }

    if (!editable) {
      // 편집 모드가 아닐 때는 모든 필드 읽기 전용
      return (
        <View style={styles.row}>
          <View style={styles.labelContainer}>
            <Typo style={styles.labelText}>{label}</Typo>
          </View>
          <View style={styles.valueContainer}>
            <Typo style={styles.valueText}>{value}</Typo>
          </View>
        </View>
      );
    }

    // 편집 모드에서 규모, 운영, 형태는 선택 옵션
    if (SELECT_OPTIONS[label as keyof typeof SELECT_OPTIONS]) {
      const options = SELECT_OPTIONS[label as keyof typeof SELECT_OPTIONS];
      return (
        <View style={styles.row}>
          <View style={styles.labelContainer}>
            <Typo style={styles.labelText}>{label}</Typo>
          </View>
          <View style={styles.optionsContainer}>
            {options.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  value === option && styles.selectedOption,
                ]}
                onPress={() => onChange?.(label as keyof typeof data, option)}>
                <Typo
                  style={[
                    styles.optionText,
                    value === option && styles.selectedOptionText,
                  ]}>
                  {option}
                </Typo>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {renderRow('규모')}
      {renderRow('빈소')}
      {renderRow('운영')}
      {renderRow('형태')}
    </View>
  );
};

export default InfoTable;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#F8F9FB',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(40, 48, 66, 0.1)',
  },
  labelContainer: {
    width: 60,
    alignItems: 'center',
  },
  labelText: {
    fontSize: 14,
    color: '#2D81F1',
    fontWeight: '600',
    fontFamily: 'Pretendard-Medium',
  },
  valueContainer: {
    flex: 1,
    alignItems: 'center',
  },
  valueText: {
    fontSize: 14,
    color: '#283042',
    fontWeight: '500',
    fontFamily: 'Pretendard-Medium',
  },
  optionsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E1E4F5',
    backgroundColor: '#FFFFFF',
  },
  selectedOption: {
    backgroundColor: '#2D81F1',
    borderColor: '#2D81F1',
  },
  optionText: {
    fontSize: 12,
    color: '#6F717D',
    fontWeight: '500',
    fontFamily: 'Pretendard-Medium',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
});
