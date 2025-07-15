import React, {useState, useRef} from 'react';
import {View, Pressable, StyleSheet, Animated, Dimensions, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scaleSize, scaleFontSize, isSmallDevice, isMediumDevice, isLargeDevice} from '../../utils/responsive';
import Typo from './Typo';
import FuneralIcon from '../../assets/User/User_FuneralDisable.svg';
import ManagerIcon from '../../assets/User/User_ManagerDisable.svg';
import CheckIcon from '../../assets/User/User_Check.svg';

interface ISelectSheetProps {
  onClose: () => void;
  targetScreen: 'Login' | 'Signup';
}

const {height} = Dimensions.get('window');

const UserSelectSheet = ({onClose, targetScreen}: ISelectSheetProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [selected, setSelected] = useState<'manager' | 'funeral'>('manager');
  const translateY = useRef(new Animated.Value(300)).current;
  const insets = useSafeAreaInsets();
  
  // Android 네비게이션 바 높이 고려한 bottom padding 계산
  const getBottomPadding = () => {
    if (Platform.OS === 'android') {
      return Math.max(insets.bottom, scaleSize(20));
    }
    return Math.max(insets.bottom, scaleSize(10));
  };

  // 반응형 높이 계산
  const getSheetHeight = () => {
    if (isSmallDevice) return height * 0.35;
    if (isMediumDevice) return height * 0.32;
    return height * 0.3;
  };

  // 반응형 패딩 계산
  const getResponsivePadding = () => {
    if (isSmallDevice) return scaleSize(16);
    if (isMediumDevice) return scaleSize(20);
    return scaleSize(25);
  };

  // 반응형 간격 계산
  const getResponsiveGap = () => {
    if (isSmallDevice) return scaleSize(8);
    if (isMediumDevice) return scaleSize(10);
    return scaleSize(12);
  };

  React.useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [translateY]);

  const handleSelect = (type: 'manager' | 'funeral') => {
    setSelected(type);
    setTimeout(() => {
      onClose(); // BottomSheet 닫기
      navigation.navigate(targetScreen, {userType: type});
    }, 150);
  };

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <Animated.View 
        style={[
          styles.sheet, 
          {
            transform: [{translateY}], 
            paddingBottom: getBottomPadding(),
            height: getSheetHeight(),
            paddingHorizontal: getResponsivePadding(),
          }
        ]}>
        <View style={styles.titleContainer}>
          <Typo style={styles.title}>회원유형을 선택해 주세요.</Typo>
        </View>
        <View style={[styles.optionContainer, {gap: getResponsiveGap()}]}>
          {['manager', 'funeral'].map(type => (
            <Pressable
              key={type}
              style={[
                styles.optionBox,
                selected === type && styles.optionSelected,
              ]}
              onPress={() => handleSelect(type as 'manager' | 'funeral')}>
              <Typo
                style={[
                  styles.optionText,
                  selected === type && styles.optionTextSelected,
                ]}>
                {type === 'manager' ? '상조팀장' : '장례식장'}
              </Typo>
              <View style={styles.buttonContainer}>
                {type === 'manager' ? (
                  <ManagerIcon width={scaleSize(25)} height={scaleSize(25)} />
                ) : (
                  <FuneralIcon width={scaleSize(25)} height={scaleSize(25)} />
                )}
                <CheckIcon height={scaleSize(20)} />
              </View>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default UserSelectSheet;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: 'white',
    paddingTop: scaleSize(30),
    borderTopLeftRadius: scaleSize(20),
    borderTopRightRadius: scaleSize(20),
  },
  titleContainer: {
    paddingBottom: scaleSize(30),
  },
  title: {
    fontSize: scaleFontSize(20),
    fontWeight: '600',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  optionBox: {
    flex: 1,
    gap: scaleSize(10),
    borderWidth: 1,
    borderColor: '#ccc',
    paddingLeft: scaleSize(25),
    paddingVertical: scaleSize(25),
    height: scaleSize(160),
    width: scaleSize(150),
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: scaleSize(12),
  },
  optionSelected: {
    borderColor: '#397CFF',
    backgroundColor: '#E6F0FF',
  },
  optionText: {
    fontSize: scaleFontSize(20),
    fontWeight: '600',
    fontFamily: 'Pretendard-Medium',
    textAlign: 'left',
    color: '#000',
  },
  optionTextSelected: {
    color: '#397CFF',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingRight: scaleSize(25),
    justifyContent: 'space-between',
  },
});
