import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

/**
 * EmailSelectBottomSheet Props 인터페이스
 * @param visible - 바텀시트 표시 여부 (boolean)
 * @param onClose - 바텀시트 닫기 콜백 함수
 * @param onSelect - 이메일 도메인 선택 완료 시 선택된 도메인 문자열을 전달받는 콜백 함수
 * @param domainList - 표시할 이메일 도메인 목록 배열 (string[])
 */
interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  domainList: string[];
}

/**
 * 이메일 도메인 선택을 위한 바텀시트 컴포넌트
 *
 * 관리하는 상태값들:
 * - translateY: 바텀시트 슬라이드 애니메이션을 위한 Animated.Value
 *
 * 주요 기능:
 * - 동적 도메인 목록 지원 (props로 전달받은 domainList 사용)
 * - 부드러운 슬라이드 애니메이션 효과
 * - 외부 영역 터치 시 닫기 기능
 * - 도메인 선택 시 자동 닫기
 *
 * 사용 목적:
 * - 이메일 입력 시 도메인 자동완성 기능 제공
 * - 일반적인 도메인(naver.com, gmail.com 등) 및 직접입력 옵션 지원
 * - 사용자 편의성 향상을 위한 빠른 도메인 선택
 */
const EmailSelectBottomSheet = ({
  visible,
  onClose,
  onSelect,
  domainList,
}: Props) => {
  // 바텀시트 슬라이드 애니메이션을 위한 Animated.Value를 참조하는 useRef 훅
  const translateY = useRef(new Animated.Value(300)).current;

  /**
   * 바텀시트 표시/숨김 상태 변화를 감지하여 슬라이드 애니메이션을 처리하는 useEffect 훅
   * visible 상태가 true일 때: 바텀시트를 아래에서 위로 슬라이드업 (0 위치로 이동)
   * visible 상태가 false일 때: 바텀시트를 위에서 아래로 슬라이드다운 (300 위치로 이동)
   * 애니메이션 속도: 나타날 때(250ms), 사라질 때(200ms)로 차별화
   */
  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none">
      {/* 바텀시트 외부 영역 터치 시 닫기 처리를 위한 반투명 배경 오버레이 */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* 애니메이션이 적용된 바텀시트 컨테이너 */}
      <Animated.View style={[styles.sheet, {transform: [{translateY}]}]}>
        {/* 도메인 목록을 세로로 나열하여 렌더링 */}
        {domainList.map(option => (
          <TouchableOpacity
            key={option}
            style={styles.option}
            onPress={() => {
              onSelect(option);
              onClose();
            }}>
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </Modal>
  );
};

export default EmailSelectBottomSheet;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#00000055',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 20,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 16,
    color: '#222',
  },
});
