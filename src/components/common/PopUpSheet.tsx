import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useEffect, useRef} from 'react';
import {Animated, Dimensions, Pressable, StyleSheet} from 'react-native';

/**
 * 중앙 팝업형 바텀시트
 *
 * 목적:
 * - 화면 하단에서 슬라이드 인/아웃 하는 간단한 팝업 시트
 * - 외부에서 children으로 콘텐츠를 주입
 *
 * 관리하는 상태값들:
 * - 없음 (Animated.Value는 ref로 관리)
 *
 * 애니메이션:
 * - translateY 값을 이용해 표시/숨김 전환 (기본 300ms)
 */
interface IPopUpSheetProps {
  /** 표시 여부 */
  visible: boolean;
  /** 닫기 콜백 (백드롭 클릭 포함) */
  onClose: () => void;
  /** 네비게이션 객체 (필요 시 사용) */
  navigation: NativeStackNavigationProp<any>;
  /** 팝업 내부에 렌더링할 요소 */
  children: React.ReactNode;
}

/** 화면 높이 */
const screenHeight = Dimensions.get('window').height;

const PopUpSheet = ({
  visible,
  onClose,
  navigation,
  children,
}: IPopUpSheetProps) => {
  /** 슬라이드 애니메이션 값 */
  const tranlateY = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    Animated.timing(tranlateY, {
      toValue: visible ? 0 : screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  // 표시되지 않을 때는 렌더링 생략
  if (!visible) {
    return null;
  }

  return (
    <>
      {/* 백드롭 */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* 시트 컨테이너 (translateY 적용 예정 위치) */}
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
