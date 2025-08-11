import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Typo from './Typo';

/**
 * 단계 표시 인디케이터
 *
 * 목적:
 * - 1~3 단계 중 현재 단계에 스타일 강조 표시
 * - 단계 사이 라인을 이용해 흐름 시각화
 *
 * 관리하는 상태값들:
 * - 없음 (표시 전용)
 */
interface IStepIndicatorProps {
  /** 현재 단계 (1~3) */
  currentStep: number;
}

/** 화면 너비 (라인 길이 계산용) */
const {width} = Dimensions.get('window');

const StepIndicator = ({currentStep}: IStepIndicatorProps) => {
  /** 고정 단계 배열 (1,2,3) */
  const steps = [1, 2, 3];

  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <View style={styles.stepContainer}>
            <View
              style={[
                styles.circle,
                currentStep === step && styles.circleActive,
              ]}>
              <Typo
                style={[
                  styles.number,
                  currentStep === step && styles.numberActive,
                ]}>
                {`0${step}`}
              </Typo>
            </View>
          </View>
          {index < steps.length - 1 && <View style={styles.line} />}
        </React.Fragment>
      ))}
    </View>
  );
};

export default StepIndicator;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    paddingHorizontal: 20,
  },
  stepContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: {
    borderColor: '#397CFF',
    backgroundColor: '#FFF',
  },
  number: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  numberActive: {
    color: '#397CFF',
  },
  line: {
    width: width * 0.32,
    height: 2,
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
});
