import React from 'react';
import {Text, TextProps} from 'react-native';

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
    <Text style={[{color, fontSize}, style]} {...props}>
      {children}
    </Text>
  );
};

export default Typo;
