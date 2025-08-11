import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Typo from './Typo';
import CheckCircleOffIcon from '../../assets/Check/Check01=Check01_default.svg';
import CheckCircleOnIcon from '../../assets/Check/Check01=Check01_Active.svg';

/**
 * ConvenienceSelector Props 인터페이스
 * @param data - 편의시설 선택 상태 집합
 *   - funeral_parking_lot: 주차장 보유 여부
 *   - funeral_store: 매점 보유 여부
 *   - funeral_family_waiting_room: 가족 대기실 보유 여부
 *   - funeral_disabled_facility: 장애인 시설 보유 여부
 * @param onToggle - 특정 편의시설 항목을 토글하는 콜백 (키를 전달)
 */
interface IConvenienceSelectorProps {
  data: {
    funeral_parking_lot: boolean; // 주차장
    funeral_store: boolean; // 매점
    funeral_family_waiting_room: boolean; // 가족 대기실
    funeral_disabled_facility: boolean; // 장애인 시설
  };
  onToggle: (key: keyof IConvenienceSelectorProps['data']) => void;
}

/**
 * UI 표시용 라벨-키 매핑 상수
 *
 * 목적:
 * - 렌더링 로직에서 라벨과 실제 데이터 키를 결합하여 반복 렌더링을 단순화
 * - 2행 x 2열 구성에 맞춰 순서대로 슬라이스하여 사용
 */
const CONVENIENCE_LABELS: {
  label: string;
  key: keyof IConvenienceSelectorProps['data'];
}[] = [
  {label: '주차장', key: 'funeral_parking_lot'},
  {label: '매점', key: 'funeral_store'},
  {label: '가족 대기실', key: 'funeral_family_waiting_room'},
  {label: '장애인 시설', key: 'funeral_disabled_facility'},
];

/**
 * 편의시설 선택 토글 컴포넌트
 *
 * 동작 개요:
 * - 2행 x 2열 그리드로 편의시설 항목을 표시
 * - 각 항목을 터치하면 onToggle을 호출하여 외부 상태(data)를 토글
 * - 선택 여부에 따라 체크 아이콘(활성/비활성)을 시각적으로 변경
 *
 * 상태 관리:
 * - 내부 상태는 없으며, 부모가 전달한 data/onToggle만 사용 (완전 제어 컴포넌트)
 */
const ConvenienceSelector = ({data, onToggle}: IConvenienceSelectorProps) => {
  return (
    <View style={styles.container}>
      {/* 총 2행을 렌더링 */}
      {Array.from({length: 2}).map((_, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {/* 각 행에 2개 항목씩 슬라이스하여 배치 */}
          {CONVENIENCE_LABELS.slice(rowIndex * 2, rowIndex * 2 + 2).map(
            ({label, key}) => (
              <TouchableOpacity
                key={key}
                style={styles.button}
                // 버튼 터치 시 해당 키를 부모 콜백으로 전달하여 토글
                onPress={() => onToggle(key)}>
                <View style={styles.contentWrapper}>
                  {/* 선택 상태에 따라 체크 아이콘 분기 렌더링 */}
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
                  {/* 항목 라벨 텍스트 */}
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
