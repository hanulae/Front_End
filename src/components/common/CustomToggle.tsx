import React from 'react';
import {StyleSheet, TouchableOpacity, Animated} from 'react-native';

interface ICustomToggleProps {
  isOn: boolean;
  onToggle: () => void;
  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
  size?: 'small' | 'medium' | 'large';
}

const CustomToggle = ({
  isOn,
  onToggle,
  activeColor = '#3287F8',
  inactiveColor = '#E6EAF3',
  thumbColor = '#FFFFFF',
  size = 'medium',
}: ICustomToggleProps) => {
  const animatedValue = React.useRef(new Animated.Value(isOn ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isOn ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isOn, animatedValue]);

  // 크기별 설정
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

  const config = sizeConfig[size];

  // 애니메이션 계산
  const trackColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  });

  // 트랙 색상 변경
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
