import {pick} from '@react-native-documents/picker';
import {getLocalFileCopies, LocalFile} from '../../util/file';
import {
  Animated,
  Button,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useEffect, useRef} from 'react';

/**
 * FilePicker Props 인터페이스
 * @param onPick - 파일 선택 완료 시 `LocalFile[]` 전달
 * @param onClose - 모달 닫기 콜백
 * @param visible - 모달 표시 여부 (optional)
 */
interface IFilePickerProps {
  onPick: (files: LocalFile[]) => void;
  onClose: () => void;
  visible?: boolean;
}

// 화면 높이 - 슬라이드 애니메이션 시작/끝 위치 계산
const {height} = Dimensions.get('window');

/**
 * 문서 파일 선택 바텀시트 모달
 *
 * 주요 기능:
 * - `@react-native-documents/picker`를 사용한 다중 파일 선택
 * - 선택된 파일을 앱 내부 로컬 경로로 복사하여 반환 (`getLocalFileCopies`)
 * - 바텀시트 슬라이드 애니메이션
 */
const FilePicker = ({onPick, onClose, visible}: IFilePickerProps) => {
  // 바텀시트 슬라이드 애니메이션 값 (화면 하단 밖에서 시작)
  const translateY = useRef(new Animated.Value(height)).current;

  /**
   * 모달 표시/숨김 시 슬라이드 애니메이션 처리
   * visible: true → 위로 슬라이드업, false → 아래로 슬라이드다운
   */
  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  /**
   * 파일 선택 핸들러
   * 목적:
   * - 문서 피커로부터 다중 선택 결과 수신
   * - 파일을 앱이 접근 가능한 로컬 파일로 복사
   * - 부모 콜백으로 결과 전달
   */
  const handlePickFiles = async () => {
    try {
      const picked = await pick({allowMultiSelection: true});

      const inputFiles = picked.map(file => ({
        uri: file.uri,
        fileName: file.name ?? '이름없는파일',
      }));

      const localFiles = await getLocalFileCopies(inputFiles);

      onPick(localFiles); // 여러 개 전달
    } catch (err) {
      console.warn('파일 선택 실패:', err);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{translateY: translateY}],
            },
          ]}>
          {/* 파일 선택 트리거 버튼 */}
          <Button title="파일 선택하기" onPress={handlePickFiles} />
          {/* 닫기 버튼 */}
          <Button title="닫기" onPress={onClose} />
        </Animated.View>
      </View>
    </Modal>
  );
};

export default FilePicker;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});
