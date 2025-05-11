import {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  requestCameraPermission,
  requestPhotoLibraryPermission,
} from '../../util/permission';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {launchCamera} from 'react-native-image-picker';
import Typo from './Typo';

interface IAlbumBottomSheetProps {
  visible?: boolean;
  onClose: () => void;
  onSelect: (uris: string[]) => void;
}

const MAX_IMAGE_COUNT = 10;
const {height} = Dimensions.get('window');
const AlbumBottomSheet = ({
  visible,
  onClose,
  onSelect,
}: IAlbumBottomSheetProps) => {
  const [albumPhotos, setAlbumPhotos] = useState<{uri: string}[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());

  const translateY = useRef(new Animated.Value(300)).current;
  console.log('AlbumBottomSheet', visible);
  const fetchPhotos = async () => {
    const hasPermission = await requestPhotoLibraryPermission();
    if (!hasPermission) {
      Alert.alert('사진 접근 권한이 거부되었습니다.');
      return;
    }

    const photos = await CameraRoll.getPhotos({first: 50, assetType: 'Photos'});
    setAlbumPhotos(photos.edges.map(edge => ({uri: edge.node.image.uri})));
  };

  useEffect(() => {
    if (visible) {
      fetchPhotos();
      Animated.timing(translateY, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      translateY.setValue(0);
      setSelectedPhotos(new Set());
    }
  }, [visible]);

  const toggleSelect = (uri: string) => {
    setSelectedPhotos(prev => {
      const updated = new Set(prev);
      if (updated.has(uri)) {
        updated.delete(uri);
      } else if (updated.size < MAX_IMAGE_COUNT) {
        updated.add(uri);
      }
      return updated;
    });
  };

  const handleDone = () => {
    const result = Array.from(selectedPhotos);
    console.log('Selected photos:', Array.from(selectedPhotos));
    onSelect(result);
    setTimeout(() => {
      onClose();
    }, 50);
  };

  const handleOpenCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('카메라 권한이 필요합니다.');
      return;
    }

    launchCamera({mediaType: 'photo', saveToPhotos: true}, response => {
      if (response.assets && response.assets[0]) {
        const uri = response.assets[0].uri!;
        setAlbumPhotos(prev => [{uri}, ...prev]);
        toggleSelect(uri);
      }
    });
  };

  const renderItem = ({item, index}: {item: {uri: string}; index: number}) => {
    if (index === 0) {
      return (
        <TouchableOpacity onPress={handleOpenCamera} style={styles.photoBox}>
          <Typo>카메라</Typo>
        </TouchableOpacity>
      );
    }

    const isSelected = selectedPhotos.has(item.uri);
    return (
      <TouchableOpacity
        onPress={() => toggleSelect(item.uri)}
        style={[styles.photoBox, isSelected && styles.selected]}>
        <Image source={{uri: item.uri}} style={styles.image} />
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Animated.View style={[styles.overlay, {transform: [{translateY}]}]}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Typo style={styles.selectedText}>
              선택된 사진 {selectedPhotos.size}/10
            </Typo>
            <TouchableOpacity onPress={onClose}>
              <Typo style={{fontSize: 18}}>✕</Typo>
            </TouchableOpacity>
          </View>

          <FlatList
            data={[{uri: ''}, ...albumPhotos]}
            renderItem={renderItem}
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.grid}
          />

          <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
            <Typo style={{color: 'white', fontWeight: 'bold'}}>완료</Typo>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default AlbumBottomSheet;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    // marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    maxHeight: '100%',
    height: height * 0.95,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard-Light',
  },
  grid: {
    paddingBottom: 12,
  },
  photoBox: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.66%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  selected: {
    borderWidth: 3,
    borderColor: '#3287F8',
    opacity: 0.5,
  },
  doneButton: {
    marginTop: 10,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#3287F8',
    alignItems: 'center',
    borderRadius: 8,
  },
});
