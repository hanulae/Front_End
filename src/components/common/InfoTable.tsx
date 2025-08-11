import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Typo from './Typo';

/**
 * 정보 테이블 컴포넌트
 *
 * 목적:
 * - 장례식장 정보(규모/빈소/운영/형태)를 테이블 형태로 표시
 * - editable 모드일 때 일부 항목은 선택형으로 편집 가능
 *
 * 관리하는 상태값들:
 * - 없음 (완전 제어형 컴포넌트, 변경은 onChange 콜백으로 외부에 위임)
 *
 * 주요 포인트:
 * - '빈소'는 항상 읽기 전용
 * - '규모/운영/형태'는 editable 모드일 때 선택 버튼 제공
 */
interface IInfoTableProps {
  /** 편집 가능 여부 */
  editable: boolean;
  /** 표에 표시할 데이터 */
  data: {
    규모: string;
    빈소: string;
    운영: string;
    형태: string;
  };
  /** 값 변경 콜백 (편집 가능한 항목에 한해 호출) */
  onChange?: (key: keyof IInfoTableProps['data'], value: string) => void;
}

/** 선택 옵션 정의 (편집 모드에서만 사용) */
const SELECT_OPTIONS = {
  규모: ['소형', '중형', '대형'],
  운영: ['공설', '사설'],
  형태: ['병원', '전문'],
};

const InfoTable = ({editable, data, onChange}: IInfoTableProps) => {
  console.log('🏁 data:', data);

  /**
   * 각 행 렌더러
   * - label에 따라 읽기 전용/선택형 분기
   */
  const renderRow = (label: string) => {
    const value = data[label as keyof typeof data];

    // '빈소'는 항상 읽기 전용
    if (label === '빈소') {
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

    // 편집 모드가 아닐 때는 모든 필드 읽기 전용
    if (!editable) {
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

    // 편집 모드에서 규모, 운영, 형태는 선택 옵션 제공
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
