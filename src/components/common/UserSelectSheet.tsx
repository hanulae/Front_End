import React, {useState, useRef} from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  scaleSize,
  scaleFontSize,
  isSmallDevice,
  isMediumDevice,
} from '../../utils/responsive';
import Typo from './Typo';
import FuneralIcon from '../../assets/User/User_FuneralDisable.svg';
import ManagerIcon from '../../assets/User/User_ManagerDisable.svg';
import CheckIcon from '../../assets/User/User_Check.svg';

/**
 * UserSelectSheet Props 인터페이스
 * @param onClose - 바텀시트 닫기 콜백 함수
 * @param targetScreen - 이동할 대상 스크린 식별자 ('Login' | 'Signup')
 */
interface ISelectSheetProps {
  onClose: () => void;
  targetScreen: 'Login' | 'Signup';
}

const {height} = Dimensions.get('window');

/**
 * 회원 유형(상조팀장/장례식장) 선택을 위한 바텀시트 컴포넌트
 *
 * 관리하는 상태값들:
 * - selected: 현재 선택된 회원 유형 ('manager' | 'funeral')
 * - translateY: 바텀시트 표시 애니메이션을 위한 Animated.Value
 * - insets: 안전영역(노치/홈 인디케이터 등) 정보를 제공하는 훅 값
 */
const UserSelectSheet = ({onClose, targetScreen}: ISelectSheetProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [selected, setSelected] = useState<'manager' | 'funeral'>('manager');
  const translateY = useRef(new Animated.Value(300)).current;
  const insets = useSafeAreaInsets();

  /**
   * Android 네비게이션 바 높이를 고려하여 하단 패딩을 계산
   * iOS는 홈 인디케이터 영역을 고려함
   */
  const getBottomPadding = () => {
    if (Platform.OS === 'android') {
      return Math.max(insets.bottom, scaleSize(20));
    }
    return Math.max(insets.bottom, scaleSize(10));
  };

  /**
   * 디바이스 크기에 따른 바텀시트 높이 계산
   */
  const getSheetHeight = () => {
    if (isSmallDevice) return height * 0.35;
    if (isMediumDevice) return height * 0.32;
    return height * 0.3;
  };

  /**
   * 디바이스 크기에 따른 수평 패딩 계산
   */
  const getResponsivePadding = () => {
    if (isSmallDevice) return scaleSize(16);
    if (isMediumDevice) return scaleSize(20);
    return scaleSize(25);
  };

  /**
   * 디바이스 크기에 따른 옵션 간격 계산
   */
  const getResponsiveGap = () => {
    if (isSmallDevice) return scaleSize(8);
    if (isMediumDevice) return scaleSize(10);
    return scaleSize(12);
  };

  /**
   * 마운트 시 바텀시트가 아래에서 위로 슬라이드 인 되는 애니메이션 처리
   */
  React.useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [translateY]);

  /**
   * 회원 유형을 선택하고 바텀시트를 닫은 뒤 대상 스크린으로 네비게이션
   * @param type - 선택한 회원 유형 ('manager' | 'funeral')
   */
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
          },
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
