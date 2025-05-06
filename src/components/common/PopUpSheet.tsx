import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useEffect, useRef} from 'react';
import {Animated, Dimensions, Pressable, StyleSheet} from 'react-native';

interface IPopUpSheetProps {
  visible: boolean;
  onClose: () => void;
  navigation: NativeStackNavigationProp<any>;
  children: React.ReactNode;
}
const screenHeight = Dimensions.get('window').height;
const PopUpSheet = ({
  visible,
  onClose,
  navigation,
  children,
}: IPopUpSheetProps) => {
  const tranlateY = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    Animated.timing(tranlateY, {
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
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View
        style={[styles.sheetContainer, {transform: [{translateY: 0}]}]}>
        {children}
      </Animated.View>
    </>
  );
};

export default PopUpSheet;

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 360, // 바텀시트 높이 (추후 조정 가능)
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
