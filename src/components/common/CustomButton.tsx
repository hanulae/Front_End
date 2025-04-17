import React, {JSX} from 'react';
import {Pressable, View} from 'react-native';

interface ICustomButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  hitSlop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  disabled?: boolean;
  style?: View['props']['style'];
}

const CustomButton = ({
  onPress,
  children,
  hitSlop = {top: 0, bottom: 0, left: 0, right: 0},
  disabled,
  style,
}: ICustomButtonProps): JSX.Element => {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={hitSlop}
      disabled={disabled}
      style={style}>
      {children}
    </Pressable>
  );
};

export default CustomButton;
