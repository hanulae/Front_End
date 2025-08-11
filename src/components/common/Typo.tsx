import React from 'react';
import {StyleSheet, Text, TextProps} from 'react-native';

/**
 * 공통 텍스트 컴포넌트
 *
 * 목적:
 * - Text 공통 스타일과 prop 기반(color, fontSize) 스타일을 병합해 사용
 * - 모든 화면에서 일관된 타이포 스타일 사용을 유도
 *
 * 관리하는 상태값들:
 * - 없음 (표시 전용)
 */
interface TypoProps extends TextProps {
  /** 글자색 */
  color?: string;
  /** 폰트 크기 */
  fontSize?: number;
}

const Typo: React.FC<TypoProps> = ({
  color,
  fontSize,
  style,
  children,
  ...props
}) => {
  return (
    <Text style={[{color, fontSize}, style, styles.typo]} {...props}>
      {children}
    </Text>
  );
};

export default Typo;

const styles = StyleSheet.create({
  // 공통 텍스트 스타일(필요 시 해제)
  // typo: {
  //   color: '#283042',
  //   // fontSize: 16,
  // },
});
