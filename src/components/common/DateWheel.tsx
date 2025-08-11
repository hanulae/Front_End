import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  StyleSheet,
} from 'react-native';

// 화면 높이 상수 - 바텀시트 애니메이션 계산에 사용
const screenHeight = Dimensions.get('window').height;
// 휠 각 아이템의 고정 높이 - 스크롤 스냅과 레이아웃 계산에 사용
const ITEM_HEIGHT = 40;

/**
 * 시작점부터 끝점까지의 숫자 배열을 생성하는 유틸리티 함수
 * @param start - 시작 숫자 (number)
 * @param end - 끝 숫자 (number, 포함)
 * @returns 연속된 숫자 배열
 * 목적: 년도(2025-2055), 월(1-12), 일(1-31) 범위 생성에 사용
 */
const generateRange = (start: number, end: number) =>
  Array.from({length: end - start + 1}, (_, i) => start + i);

/**
 * Date 객체를 받아 한국어 요일 문자열로 변환하는 함수
 * @param date - 변환할 Date 객체
 * @returns 한국어 요일 문자열 ('일', '월', '화', '수', '목', '금', '토')
 * 목적: 선택된 날짜의 요일을 사용자에게 직관적으로 표시
 */
const getKoreanWeekday = (date: Date) => {
  const map = ['일', '월', '화', '수', '목', '금', '토'];
  return map[date.getDay()];
};

/**
 * 년, 월, 일을 받아 한국어 형식의 날짜 문자열로 포맷팅하는 함수
 * @param year - 년도 (number)
 * @param month - 월 (number, 1-12)
 * @param day - 일 (number)
 * @returns 포맷팅된 날짜 문자열
 * 목적: "2024년 03월 15일 (금)" 형식으로 사용자에게 선택된 날짜를 표시
 * 예시: formatKoreanDate(2024, 3, 15) → "2024년 03월 15일 (금)"
 */
const formatKoreanDate = (year: number, month: number, day: number) => {
  const date = new Date(year, month - 1, day);
  return `${year}년 ${String(month).padStart(2, '0')}월 ${String(day).padStart(
    2,
    '0',
  )}일 (${getKoreanWeekday(date)})`;
};

/**
 * 특정 년도와 월의 마지막 날짜를 계산하는 함수
 * @param year - 년도 (number)
 * @param month - 월 (number, 1-12)
 * @returns 해당 월의 마지막 날 (number)
 * 목적: 월별 일수 차이 및 윤년을 고려하여 올바른 날짜 범위 제공
 * 주의: month는 1-based이지만 Date 생성자는 0-based이므로 조정 필요
 */
const getLastDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate(); // 주의: month는 1-based로 넣고 -1 하지 않음
};

/**
 * 개별 날짜 휠 컴포넌트 (년/월/일 중 하나)
 *
 * Props:
 * - data: 휠에 표시할 숫자 배열
 * - value: 현재 선택된 값
 * - onChange: 값 변경 시 호출되는 콜백
 *
 * 주요 기능:
 * - FlatList 기반의 세로 스크롤 휠
 * - 스크롤 스냅으로 정확한 선택 보장
 * - 선택된 값의 시각적 강조 (볼드체)
 * - 부드러운 스크롤 애니메이션
 */
const Wheel = ({data, value, onChange}: any) => {
  // FlatList 참조 - 프로그래밍적 스크롤 제어용
  const ref = useRef<FlatList>(null);

  /**
   * value 변경 시 해당 인덱스로 스크롤하는 useEffect 훅
   * 목적: 외부에서 값이 변경되었을 때 휠을 해당 위치로 자동 스크롤
   * setTimeout: 컴포넌트 마운트 후 스크롤이 정상 작동하도록 지연 처리
   */
  useEffect(() => {
    const index = data.indexOf(value);
    if (index >= 0) {
      setTimeout(() => {
        ref.current?.scrollToIndex({index, animated: true});
      }, 50);
    }
  }, [value]);

  return (
    <FlatList
      ref={ref}
      data={data}
      style={{height: ITEM_HEIGHT}}
      keyExtractor={item => item.toString()}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      contentContainerStyle={styles.wheelContent}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      // 스크롤 완료 시 선택된 값 계산 및 콜백 호출
      onMomentumScrollEnd={e => {
        const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
        onChange(data[index]);
      }}
      renderItem={({item}) => (
        <View style={styles.wheelItem}>
          <Text
            style={[
              styles.wheelText,
              item === value && styles.selectedWheelText,
            ]}>
            {String(item).padStart(2, '0')}
          </Text>
        </View>
      )}
    />
  );
};

/**
 * DateWheelBottomSheet Props 인터페이스
 * @param visible - 바텀시트 표시 여부 (boolean)
 * @param onConfirm - 날짜 선택 완료 시 Date 객체를 전달받는 콜백 함수
 * @param onClose - 바텀시트 닫기 콜백 함수
 * @param initialDate - 초기 선택 날짜 (Date, optional, 기본값: 현재 날짜)
 */
interface DateWheelBottomSheetProps {
  visible: boolean;
  onConfirm: (date: Date) => void;
  onClose: () => void;
  initialDate?: Date;
}

/**
 * 날짜 선택을 위한 휠 방식 바텀시트 컴포넌트
 *
 * 관리하는 상태값들:
 * - translateY: 바텀시트 슬라이드 애니메이션을 위한 Animated.Value
 * - year: 현재 선택된 년도 (2025-2055)
 * - month: 현재 선택된 월 (1-12)
 * - day: 현재 선택된 일 (1-해당월마지막일)
 *
 * 주요 기능:
 * - 3개의 독립적인 휠로 년/월/일 선택
 * - 상하 화살표 버튼으로 값 조정 가능
 * - 월 변경 시 일자 자동 보정 (예: 2월 30일 → 2월 28일)
 * - 한국어 형식의 날짜 미리보기
 * - 부드러운 슬라이드 애니메이션
 */
const DateWheelBottomSheet = ({
  visible,
  onConfirm,
  onClose,
  initialDate,
}: DateWheelBottomSheetProps) => {
  // 바텀시트 슬라이드 애니메이션을 위한 Animated.Value (화면 높이에서 시작)
  const translateY = useRef(new Animated.Value(screenHeight)).current;

  // 초기 날짜 설정 - initialDate가 없으면 현재 날짜 사용
  const defaultDate = initialDate || new Date();

  // 년, 월, 일 상태 관리
  const [year, setYear] = useState(defaultDate.getFullYear());
  const [month, setMonth] = useState(defaultDate.getMonth() + 1);
  const [day, setDay] = useState(defaultDate.getDate());

  /**
   * 바텀시트가 표시될 때 초기 날짜로 상태 초기화하는 useEffect 훅
   * 목적: 바텀시트가 열릴 때마다 initialDate 또는 현재 날짜로 리셋
   * visible이 true가 될 때만 실행하여 불필요한 상태 업데이트 방지
   */
  useEffect(() => {
    if (visible) {
      const dateToUse = initialDate || new Date();
      setYear(dateToUse.getFullYear());
      setMonth(dateToUse.getMonth() + 1);
      setDay(dateToUse.getDate());
    }
  }, [visible]);

  /**
   * 년도나 월이 변경될 때 일자를 해당 월의 마지막 날로 보정하는 useEffect 훅
   * 목적: 존재하지 않는 날짜 방지 (예: 2월 30일 → 2월 28일)
   * 예시: 1월 31일에서 2월로 변경하면 2월 28일(또는 29일)로 자동 조정
   */
  useEffect(() => {
    const lastDay = getLastDayOfMonth(year, month);
    if (day > lastDay) {
      setDay(lastDay);
    }
  }, [year, month]);

  /**
   * 년도 증감 처리 함수
   * @param direction - 증가('up') 또는 감소('down') 방향
   * 목적: 화살표 버튼 클릭 시 년도를 안전한 범위(2025-2055) 내에서 조정
   * 범위 제한으로 유효하지 않은 년도 입력 방지
   */
  const handleYearChange = (direction: 'up' | 'down') => {
    if (direction === 'up' && year < 2055) {
      setYear(year + 1);
    } else if (direction === 'down' && year > 2025) {
      setYear(year - 1);
    }
  };

  /**
   * 월 증감 처리 함수 (년도 넘김 포함)
   * @param direction - 증가('up') 또는 감소('down') 방향
   * 목적: 월 경계에서 년도 자동 변경 및 순환 처리
   * - 12월 다음: 다음해 1월
   * - 1월 이전: 이전해 12월
   * - 년도 범위 체크로 안전성 보장
   */
  const handleMonthChange = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      if (month < 12) {
        setMonth(month + 1);
      } else {
        setMonth(1);
        if (year < 2055) setYear(year + 1);
      }
    } else if (direction === 'down') {
      if (month > 1) {
        setMonth(month - 1);
      } else {
        setMonth(12);
        if (year > 2025) setYear(year - 1);
      }
    }
  };

  /**
   * 일 증감 처리 함수 (월 넘김 포함)
   * @param direction - 증가('up') 또는 감소('down') 방향
   * 목적: 일자 경계에서 월 자동 변경 및 순환 처리
   * - 월 마지막일 다음: 다음달 1일
   * - 월 첫째일 이전: 이전달 마지막일
   * - 각 월의 실제 마지막 날짜 계산하여 정확한 날짜 설정
   */
  const handleDayChange = (direction: 'up' | 'down') => {
    const lastDay = getLastDayOfMonth(year, month);

    if (direction === 'up') {
      if (day < lastDay) {
        setDay(day + 1);
      } else {
        setDay(1);
        handleMonthChange('up');
      }
    } else if (direction === 'down') {
      if (day > 1) {
        setDay(day - 1);
      } else {
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;
        const prevLastDay = getLastDayOfMonth(prevYear, prevMonth);
        setDay(prevLastDay);
        handleMonthChange('down');
      }
    }
  };

  /**
   * 날짜 확인 및 바텀시트 닫기 함수
   * 목적: 선택된 년/월/일로 Date 객체를 생성하여 부모 컴포넌트에 전달 후 닫기
   * Date 생성자의 month는 0-based이므로 month - 1로 조정
   */
  const confirmAndClose = () => {
    onConfirm(new Date(year, month - 1, day));
    onClose();
  };

  /**
   * 바텀시트 표시/숨김 상태에 따른 슬라이드 애니메이션 처리 useEffect 훅
   * visible이 true일 때: 화면 하단에서 위로 슬라이드업 (translateY: 0)
   * visible이 false일 때: 화면 하단으로 슬라이드다운 (translateY: screenHeight)
   */
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  // 바텀시트가 보이지 않을 때는 렌더링하지 않음
  if (!visible) {
    return null;
  }

  return (
    <>
      {/* 바텀시트 외부 영역 터치 시 확인 및 닫기 처리를 위한 배경 오버레이 */}
      <Pressable style={styles.backdrop} onPress={confirmAndClose} />

      {/* 애니메이션이 적용된 바텀시트 컨테이너 */}
      <Animated.View
        style={[styles.sheetContainer, {transform: [{translateY}]}]}>
        {/* 현재 선택된 날짜를 한국어 형식으로 표시하는 라벨 */}
        <Text style={styles.dateLabel}>
          {formatKoreanDate(year, month, day)}
        </Text>

        {/* 3개의 휠(년/월/일)을 가로로 배치하는 컨테이너 */}
        <View style={styles.wheelWrapper}>
          {/* 년도 선택 휠 */}
          <View style={styles.wheelColumn}>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() => handleYearChange('up')}
              activeOpacity={0.7}>
              <Text style={styles.arrow}>▲</Text>
            </TouchableOpacity>
            <Wheel
              data={generateRange(2025, 2055)}
              value={year}
              onChange={setYear}
            />
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() => handleYearChange('down')}
              activeOpacity={0.7}>
              <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* 월 선택 휠 */}
          <View style={styles.wheelColumn}>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() => handleMonthChange('up')}
              activeOpacity={0.7}>
              <Text style={styles.arrow}>▲</Text>
            </TouchableOpacity>
            <Wheel
              data={generateRange(1, 12)}
              value={month}
              onChange={setMonth}
            />
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() => handleMonthChange('down')}
              activeOpacity={0.7}>
              <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* 일 선택 휠 */}
          <View style={styles.wheelColumn}>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() => handleDayChange('up')}
              activeOpacity={0.7}>
              <Text style={styles.arrow}>▲</Text>
            </TouchableOpacity>
            <Wheel
              data={generateRange(1, getLastDayOfMonth(year, month))}
              value={day}
              onChange={setDay}
            />
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() => handleDayChange('down')}
              activeOpacity={0.7}>
              <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 날짜 선택 확인 버튼 */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={confirmAndClose}>
          <Text style={styles.confirmText}>확인</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

export default DateWheelBottomSheet;

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  wheelWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center', // ✅ 세로 정중앙 정렬
    width: '100%',
  },
  wheelColumn: {
    flexDirection: 'column',
    alignItems: 'center', // ✅ 가로 중앙 정렬
    justifyContent: 'center',
  },
  arrowButton: {
    padding: 8,
    minHeight: 32,
    minWidth: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    color: '#2D81F1',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 240,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 16,
    color: '#888',
    marginBottom: 12,
  },
  arrowRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 4,
  },
  wheelRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  wheelContent: {
    paddingVertical: 0, // 중앙 하나만 보이게
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelText: {
    fontSize: 18,
    color: '#333',
  },
  selectedWheelText: {
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#4F7CFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
