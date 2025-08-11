import React, {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, Pressable, StyleSheet, View} from 'react-native';
import Typo from './Typo';

/**
 * 유형/기간/정렬 선택 바텀시트
 *
 * 목적:
 * - 조회기간/거래유형/시간순 정렬을 선택하고 확인 버튼으로 확정
 * - 선택 중 시각적 피드백을 위해 Animated indicator 적용
 *
 * 관리하는 상태값들:
 * - 없음 (선택값은 외부 제어형으로 props를 통해 전달/수정)
 *
 * 애니메이션:
 * - translateY: 시트 오픈/닫힘
 * - indicator: 각 그룹의 선택 인덱스 이동 애니메이션
 */
const PERIODS = ['전체', '1개월', '3개월'];
const TYPES = ['전체', '적립', '환급'];
const ORDERS = ['최신순', '과거순'];
const screenHeight = Dimensions.get('window').height;

interface TypeBottomSheetProps {
  /** 표시 여부 */
  visible: boolean;
  /** 닫기 콜백 */
  onClose: () => void;
  /** 확인 콜백 (외부에서 선택값 사용) */
  onConfirm: () => void;
  /** 선택값 (기간) */
  selectedPeriod: string;
  /** 선택값 setter (기간) */
  setSelectedPeriod: (v: string) => void;
  /** 선택값 (유형) */
  selectedType: string;
  /** 선택값 setter (유형) */
  setSelectedType: (v: string) => void;
  /** 선택값 (정렬) */
  selectedOrder: string;
  /** 선택값 setter (정렬) */
  setSelectedOrder: (v: string) => void;
}

const TypeBottomSheet = ({
  visible,
  onClose,
  onConfirm,
  selectedPeriod,
  setSelectedPeriod,
  selectedType,
  setSelectedType,
  selectedOrder,
  setSelectedOrder,
}: TypeBottomSheetProps) => {
  /** 오픈/클로즈 애니메이션 값 */
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  /** 조회기간 indicator 애니메이션 값 */
  const indicatorAnimPeriod = useRef(new Animated.Value(0)).current;
  /** 거래유형 indicator 애니메이션 값 */
  const indicatorAnimType = useRef(new Animated.Value(0)).current;
  /** 시간순 indicator 애니메이션 값 */
  const indicatorAnimOrder = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  /** 조회기간 indicator 이동 */
  useEffect(() => {
    const idx = PERIODS.findIndex(p => p === selectedPeriod);
    Animated.timing(indicatorAnimPeriod, {
      toValue: idx === -1 ? 0 : idx,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [selectedPeriod]);

  /** 거래유형 indicator 이동 */
  useEffect(() => {
    const idx = TYPES.findIndex(t => t === selectedType);
    Animated.timing(indicatorAnimType, {
      toValue: idx === -1 ? 0 : idx,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [selectedType]);

  /** 시간순 indicator 이동 */
  useEffect(() => {
    const idx = ORDERS.findIndex(o => o === selectedOrder);
    Animated.timing(indicatorAnimOrder, {
      toValue: idx === -1 ? 0 : idx,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [selectedOrder]);

  // 표시되지 않을 때는 렌더링 생략 (성능 최적화)
  if (!visible) return null;

  // 버튼 개수에 따라 indicator width 계산
  const btnCountPeriod = PERIODS.length;
  const btnWidthPercentPeriod = 100 / btnCountPeriod;
  const btnCountType = TYPES.length;
  const btnWidthPercentType = 100 / btnCountType;
  const btnCountOrder = ORDERS.length;
  const btnWidthPercentOrder = 100 / btnCountOrder;

  return (
    <>
      {/* 백드롭 */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* 바텀시트 */}
      <Animated.View style={[styles.sheet, {transform: [{translateY}]}]}>
        <Typo style={styles.title}>검색 옵션</Typo>

        {/* 조회기간 */}
        <Typo style={styles.label}>조회기간</Typo>
        <View style={styles.buttonGroup}>
          {/* Animated indicator */}
          <Animated.View
            style={[
              styles.indicator,
              {
                width: `${btnWidthPercentPeriod}%`,
                left: indicatorAnimPeriod.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [
                    '0%',
                    `${btnWidthPercentPeriod}%`,
                    `${btnWidthPercentPeriod * 2}%`,
                  ],
                }),
              },
            ]}
          />
          {PERIODS.map((period, idx) => (
            <Pressable
              key={period}
              style={styles.optionButton}
              onPress={() => setSelectedPeriod(period)}>
              <Typo
                style={
                  selectedPeriod === period
                    ? styles.optionTextSelected
                    : styles.optionText
                }>
                {period}
              </Typo>
            </Pressable>
          ))}
        </View>

        {/* 거래유형 */}
        <Typo style={styles.label}>거래유형</Typo>
        <View style={styles.buttonGroup}>
          {/* Animated indicator */}
          <Animated.View
            style={[
              styles.indicator,
              {
                width: `${btnWidthPercentType}%`,
                left: indicatorAnimType.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [
                    '0%',
                    `${btnWidthPercentType}%`,
                    `${btnWidthPercentType * 2}%`,
                  ],
                }),
              },
            ]}
          />
          {TYPES.map((type, idx) => (
            <Pressable
              key={type}
              style={styles.optionButton}
              onPress={() => setSelectedType(type)}>
              <Typo
                style={
                  selectedType === type
                    ? styles.optionTextSelected
                    : styles.optionText
                }>
                {type}
              </Typo>
            </Pressable>
          ))}
        </View>

        {/* 시간순 */}
        <Typo style={styles.label}>시간순</Typo>
        <View style={styles.buttonGroup}>
          {/* Animated indicator */}
          <Animated.View
            style={[
              styles.indicator,
              {
                width: `${btnWidthPercentOrder}%`,
                left: indicatorAnimOrder.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', `${btnWidthPercentOrder}%`],
                }),
              },
            ]}
          />
          {ORDERS.map((order, idx) => (
            <Pressable
              key={order}
              style={styles.optionButton}
              onPress={() => setSelectedOrder(order)}>
              <Typo
                style={
                  selectedOrder === order
                    ? styles.optionTextSelected
                    : styles.optionText
                }>
                {order}
              </Typo>
            </Pressable>
          ))}
        </View>

        {/* 확인 버튼 */}
        <Pressable style={styles.confirmButton} onPress={onConfirm}>
          <Typo style={styles.confirmButtonText}>확인</Typo>
        </Pressable>
      </Animated.View>
    </>
  );
};

export default TypeBottomSheet;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F7F7F7',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    paddingBottom: 32,
    zIndex: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    color: '#000',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    color: '#222',
  },
  buttonGroup: {
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    padding: 4,
    marginBottom: 12,
    gap: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    zIndex: 1,
    marginVertical: 4,
    marginHorizontal: 4,
  },
  optionButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  optionButtonSelected: {
    backgroundColor: '#fff',
  },
  optionText: {
    color: '#222',
    fontWeight: '500',
    fontSize: 14,
  },
  optionTextSelected: {
    color: '#222',
    fontWeight: '700',
    fontSize: 14,
  },
  confirmButton: {
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
});
