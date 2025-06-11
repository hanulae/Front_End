import React from 'react';
import {StyleSheet, Text, TextProps} from 'react-native';

interface TypoProps extends TextProps {
  color?: string;
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
  // typo: {
  //   color: '#283042',
  //   // fontSize: 16,
  // },
});
