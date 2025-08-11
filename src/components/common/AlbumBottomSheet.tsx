import {useCallback, useEffect, useRef, useState} from 'react';
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
  ActivityIndicator,
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
const PHOTOS_PER_PAGE = 20; // 한 번에 로드할 사진 개수
const {height} = Dimensions.get('window');

// 사진 선택을 위한 앨범 바텀시트 컴포넌트
const AlbumBottomSheet = ({
  visible,
  onClose,
  onSelect,
}: IAlbumBottomSheetProps) => {
  const [albumPhotos, setAlbumPhotos] = useState<{uri: string}[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);

  const translateY = useRef(new Animated.Value(300)).current;
  console.log('AlbumBottomSheet', visible);

  useEffect(() => {
    if (visible) {
      // 초기화
      setAlbumPhotos([]);
      console.log('앨범 리스트 초기화 완료');
      setSelectedPhotos(new Set());
      setHasNextPage(true);
      setEndCursor(undefined);

      // 앨범 초기 사진 목록을 로드하는 함수
      const loadInitialPhotos = async () => {
        const hasPermission = await requestPhotoLibraryPermission();
        if (!hasPermission) {
          Alert.alert('사진 접근 권한이 거부되었습니다.');
          return;
        }

        setIsLoading(true);
        try {
          const photos = await CameraRoll.getPhotos({
            first: PHOTOS_PER_PAGE,
            assetType: 'Photos',
          });

          const newPhotos = photos.edges.map(edge => ({
            uri: edge.node.image.uri,
          }));

          console.log('newPhotos', newPhotos);

          setAlbumPhotos(newPhotos);
          setHasNextPage(photos.page_info.has_next_page);
          setEndCursor(photos.page_info.end_cursor);
        } catch (error) {
          console.error('사진을 불러오는 중 오류가 발생했습니다:', error);
          Alert.alert('사진을 불러오는 중 오류가 발생했습니다.');
        } finally {
          setIsLoading(false);
        }
      };

      loadInitialPhotos();

      Animated.timing(translateY, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      translateY.setValue(0);
      setSelectedPhotos(new Set());
    }
  }, [visible, translateY]);

  // 사진 선택/해제를 토글하는 함수
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

  // 선택 완료 버튼 클릭 시 실행되는 함수
  const handleDone = () => {
    const result = Array.from(selectedPhotos);
    console.log('Selected photos:', Array.from(selectedPhotos));
    onSelect(result);
    setTimeout(() => {
      onClose();
    }, 50);
  };

  // 카메라를 열어 사진을 촬영하는 함수
  const handleOpenCamera = async () => {
    const hasPermission = await requestCameraPermission();
    console.log('hasPermission', hasPermission);
    console.log('카메라 클릭됨.');
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

  // 스크롤 끝에서 추가 사진을 로드하는 함수
  const handleLoadMore = useCallback(async () => {
    console.log('handleLoadMore 호출됨');
    // 콘텐츠가 충분히 많지 않으면 호출하지 않도록
    if (!hasNextPage || isLoading || albumPhotos.length < PHOTOS_PER_PAGE) {
      return;
    }

    const hasPermission = await requestPhotoLibraryPermission();
    if (!hasPermission) {
      Alert.alert('사진 접근 권한이 거부되었습니다.');
      return;
    }

    setIsLoading(true);
    try {
      const photos = await CameraRoll.getPhotos({
        first: PHOTOS_PER_PAGE,
        assetType: 'Photos',
        after: endCursor,
      });

      const newPhotos = photos.edges.map(edge => ({
        uri: edge.node.image.uri,
      }));

      setAlbumPhotos(prev => [...prev, ...newPhotos]);
      setHasNextPage(photos.page_info.has_next_page);
      setEndCursor(photos.page_info.end_cursor);
    } catch (error) {
      console.error('사진을 불러오는 중 오류가 발생했습니다:', error);
      Alert.alert('사진을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [hasNextPage, isLoading, endCursor]);

  // FlatList의 각 아이템을 렌더링하는 함수
  const renderItem = ({item, index}: {item: {uri: string}; index: number}) => {
    console.log('renderItem', item, index);
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

  // FlatList 하단에 로딩 인디케이터를 렌더링하는 함수
  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#3287F8" />
        <Typo style={styles.loadingText}>사진을 불러오는 중...</Typo>
      </View>
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
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.8}
            ListFooterComponent={renderFooter}
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
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
});
