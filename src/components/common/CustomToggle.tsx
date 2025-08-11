import React from 'react';
import {StyleSheet, TouchableOpacity, Animated} from 'react-native';

/**
 * CustomToggle Props 인터페이스
 * @param isOn - 토글 켜짐/꺼짐 상태 (boolean)
 * @param onToggle - 토글 클릭 시 실행되는 콜백 함수
 * @param activeColor - 활성화 상태 시 배경색 (string, optional, 기본값: '#3287F8')
 * @param inactiveColor - 비활성화 상태 시 배경색 (string, optional, 기본값: '#E6EAF3')
 * @param thumbColor - 토글 thumb(원형 버튼) 색상 (string, optional, 기본값: '#FFFFFF')
 * @param size - 토글 크기 ('small' | 'medium' | 'large', optional, 기본값: 'medium')
 */
interface ICustomToggleProps {
  isOn: boolean;
  onToggle: () => void;
  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * 커스텀 토글 스위치 컴포넌트
 *
 * 관리하는 상태값들:
 * - animatedValue: 토글 애니메이션을 위한 Animated.Value (0: OFF, 1: ON)
 *
 * 주요 기능:
 * - 부드러운 슬라이드 및 색상 변경 애니메이션
 * - 크기별 설정 지원 (small, medium, large)
 * - 커스터마이징 가능한 색상 옵션
 * - 네이티브 드라이버를 사용하지 않는 색상 애니메이션
 */
const CustomToggle = ({
  isOn,
  onToggle,
  activeColor = '#3287F8',
  inactiveColor = '#E6EAF3',
  thumbColor = '#FFFFFF',
  size = 'medium',
}: ICustomToggleProps) => {
  // 토글 애니메이션을 위한 Animated.Value를 참조하는 useRef 훅 (0: OFF, 1: ON)
  const animatedValue = React.useRef(new Animated.Value(isOn ? 1 : 0)).current;

  /**
   * isOn 상태 변화를 감지하여 토글 애니메이션을 처리하는 useEffect 훅
   * isOn이 true일 때: animatedValue를 1로 애니메이션 (활성화)
   * isOn이 false일 때: animatedValue를 0으로 애니메이션 (비활성화)
   * useNativeDriver: false - 색상 변경을 위해 네이티브 드라이버 사용하지 않음
   */
  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isOn ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isOn, animatedValue]);

  /**
   * 토글 크기별 설정 상수 객체
   * 목적: size prop에 따라 토글의 전체 크기, thumb 크기, 패딩을 동적으로 결정
   * - width/height: 토글 전체 크기
   * - thumbSize: 내부 원형 버튼 크기
   * - padding: 토글 트랙과 thumb 사이의 여백
   */
  const sizeConfig = {
    small: {
      width: 44,
      height: 26,
      thumbSize: 22,
      padding: 2,
    },
    medium: {
      width: 51,
      height: 31,
      thumbSize: 27,
      padding: 2,
    },
    large: {
      width: 60,
      height: 36,
      thumbSize: 32,
      padding: 2,
    },
  };

  // 현재 선택된 크기에 해당하는 설정 객체
  const config = sizeConfig[size];

  /**
   * 토글 트랙 배경색 애니메이션 계산
   * 목적: animatedValue 변화에 따라 비활성화 색상에서 활성화 색상으로 부드럽게 전환
   * inputRange [0, 1]: OFF(0) 상태에서 ON(1) 상태로의 변화 범위
   * outputRange: 비활성화 색상 → 활성화 색상으로 보간
   */
  const trackColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  });

  /**
   * 토글 thumb 위치 애니메이션 계산
   * 목적: animatedValue 변화에 따라 thumb를 왼쪽에서 오른쪽으로 슬라이드
   * inputRange [0, 1]: OFF(0) 상태에서 ON(1) 상태로의 변화 범위
   * outputRange: 왼쪽 패딩 위치 → 오른쪽 끝 위치로 이동
   */
  const thumbPosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      config.padding,
      config.width - config.thumbSize - config.padding,
    ],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onToggle}
      style={[
        styles.container,
        {
          width: config.width,
          height: config.height,
        },
      ]}>
      {/* 토글 트랙 (배경) - 색상 애니메이션 적용 */}
      <Animated.View
        style={[
          styles.track,
          {
            backgroundColor: trackColor,
            width: config.width,
            height: config.height,
            borderRadius: config.height / 2,
          },
        ]}>
        {/* 토글 thumb (원형 버튼) - 위치 애니메이션 적용 */}
        <Animated.View
          style={[
            styles.thumb,
            {
              backgroundColor: thumbColor,
              width: config.thumbSize,
              height: config.thumbSize,
              borderRadius: config.thumbSize / 2,
              transform: [{translateX: thumbPosition}],
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default CustomToggle;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  track: {
    justifyContent: 'center',
    position: 'relative',
  },
  thumb: {
    position: 'absolute',
  },
});
