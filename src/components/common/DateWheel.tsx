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

const generateRange = (start: number, end: number) =>
  Array.from({length: end - start + 1}, (_, i) => start + i);

const getKoreanWeekday = (date: Date) => {
  const map = ['일', '월', '화', '수', '목', '금', '토'];
  return map[date.getDay()];
};

const formatKoreanDate = (year: number, month: number, day: number) => {
  const date = new Date(year, month - 1, day);
  return `${year}년 ${String(month).padStart(2, '0')}월 ${String(day).padStart(
    2,
    '0',
  )}일 (${getKoreanWeekday(date)})`;
};

const getLastDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate(); // 주의: month는 1-based로 넣고 -1 하지 않음
};

const Wheel = ({data, value, onChange}: any) => {
  const ref = useRef<FlatList>(null);

  useEffect(() => {
    const index = data.indexOf(value);
    if (index >= 0) {
      setTimeout(() => {
        ref.current?.scrollToIndex({index, animated: false});
      }, 50);
    }
  }, []);

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

  const [year, setYear] = useState(initialDate!.getFullYear());
  const [month, setMonth] = useState(initialDate!.getMonth() + 1);
  const [day, setDay] = useState(initialDate!.getDate());

  useEffect(() => {
    if (visible) {
      setYear(initialDate!.getFullYear());
      setMonth(initialDate!.getMonth() + 1);
      setDay(initialDate!.getDate());
    }
  }, [visible, initialDate]);

  // day 보정 로직
  useEffect(() => {
    const lastDay = getLastDayOfMonth(year, month);
    if (day > lastDay) {
      setDay(lastDay);
    }
  }, [year, month]);

  const confirmAndClose = () => {
    onConfirm(new Date(year, month - 1, day));
    onClose();
  };

  // const formatSimpleDate = (date: Date) => {
  //   return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
  //     2,
  //     '0',
  //   )}.${String(date.getDate()).padStart(2, '0')}`;
  // };

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
            <Text style={styles.arrow}>▲</Text>
            <Wheel
              data={generateRange(2025, 2055)}
              value={year}
              onChange={setYear}
            />
            <Text style={styles.arrow}>▼</Text>
          </View>

          {/* month */}
          <View style={styles.wheelColumn}>
            <Text style={styles.arrow}>▲</Text>
            <Wheel
              data={generateRange(1, 12)}
              value={month}
              onChange={setMonth}
            />
            <Text style={styles.arrow}>▼</Text>
          </View>

          {/* day */}
          <View style={styles.wheelColumn}>
            <Text style={styles.arrow}>▲</Text>
            <Wheel
              data={generateRange(1, getLastDayOfMonth(year, month))}
              value={day}
              onChange={setDay}
            />
            <Text style={styles.arrow}>▼</Text>
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
  arrow: {
    color: '#aaa',
    fontSize: 18,
    marginVertical: 4,
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
  arrow: {
    color: '#aaa',
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
