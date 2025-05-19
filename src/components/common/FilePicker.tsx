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

interface IFilePickerProps {
  onPick: (files: LocalFile[]) => void;
  onClose: () => void;
  visible?: boolean;
}

const {height} = Dimensions.get('window');
const FilePicker = ({onPick, onClose, visible}: IFilePickerProps) => {
  const translateY = useRef(new Animated.Value(height)).current;

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
          <Button title="파일 선택하기" onPress={handlePickFiles} />
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
