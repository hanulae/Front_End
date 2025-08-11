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

const screenHeight = Dimensions.get('window').height;
const ITEM_HEIGHT = 40;
// const VISIBLE_ITEMS = 1;

// 년도 범위 생성
const generateRange = (start: number, end: number) =>
  Array.from({length: end - start + 1}, (_, i) => start + i);

// 요일 변환
const getKoreanWeekday = (date: Date) => {
  const map = ['일', '월', '화', '수', '목', '금', '토'];
  return map[date.getDay()];
};

// 날짜 포맷팅
const formatKoreanDate = (year: number, month: number, day: number) => {
  const date = new Date(year, month - 1, day);
  return `${year}년 ${String(month).padStart(2, '0')}월 ${String(day).padStart(
    2,
    '0',
  )}일 (${getKoreanWeekday(date)})`;
};

// 월의 마지막 날짜 계산
const getLastDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate(); // 주의: month는 1-based로 넣고 -1 하지 않음
};

// 날짜 휠 컴포넌트
const Wheel = ({data, value, onChange}: any) => {
  const ref = useRef<FlatList>(null);

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

const DateWheelBottomSheet = ({
  visible,
  onConfirm,
  onClose,
  initialDate,
}: {
  visible: boolean;
  onConfirm: (date: Date) => void;
  onClose: () => void;
  initialDate?: Date;
}) => {
  const translateY = useRef(new Animated.Value(screenHeight)).current;

  // 기본값을 현재 날짜로 설정
  const defaultDate = initialDate || new Date();

  const [year, setYear] = useState(defaultDate.getFullYear());
  const [month, setMonth] = useState(defaultDate.getMonth() + 1);
  const [day, setDay] = useState(defaultDate.getDate());

  // visible이 true가 되거나 initialDate가 변경될 때마다 상태 업데이트
  useEffect(() => {
    if (visible) {
      const dateToUse = initialDate || new Date();
      setYear(dateToUse.getFullYear());
      setMonth(dateToUse.getMonth() + 1);
      setDay(dateToUse.getDate());
    }
  }, [visible]); // initialDate는 key로 처리되므로 의존성에서 제거

  // day 보정 로직
  useEffect(() => {
    const lastDay = getLastDayOfMonth(year, month);
    if (day > lastDay) {
      setDay(lastDay);
    }
  }, [year, month]);

  // 년도 변경 함수
  const handleYearChange = (direction: 'up' | 'down') => {
    if (direction === 'up' && year < 2055) {
      setYear(year + 1);
    } else if (direction === 'down' && year > 2025) {
      setYear(year - 1);
    }
  };

  // 월 변경 함수
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

  // 일 변경 함수
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

  const confirmAndClose = () => {
    onConfirm(new Date(year, month - 1, day));
    onClose();
  };

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <>
      <Pressable style={styles.backdrop} onPress={confirmAndClose} />

      <Animated.View
        style={[styles.sheetContainer, {transform: [{translateY}]}]}>
        <Text style={styles.dateLabel}>
          {formatKoreanDate(year, month, day)}
        </Text>

        <View style={styles.wheelWrapper}>
          {/* year */}
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

          {/* month */}
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

          {/* day */}
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
