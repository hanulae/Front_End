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

/**
 * AlbumBottomSheet Props 인터페이스
 * @param visible - 바텀시트 표시 여부 (boolean, optional)
 * @param onClose - 바텀시트 닫기 콜백 함수
 * @param onSelect - 사진 선택 완료 시 선택된 사진 URI 배열을 전달받는 콜백 함수
 */
interface IAlbumBottomSheetProps {
  visible?: boolean;
  onClose: () => void;
  onSelect: (uris: string[]) => void;
}

const MAX_IMAGE_COUNT = 10;
const PHOTOS_PER_PAGE = 20; // 한 번에 로드할 사진 개수
const {height} = Dimensions.get('window');

/**
 * 사진 선택을 위한 앨범 바텀시트 컴포넌트
 *
 * 관리하는 상태값들:
 * - albumPhotos: 앨범에서 불러온 사진 목록 (uri를 가진 객체 배열)
 * - selectedPhotos: 사용자가 선택한 사진 URI들의 Set
 * - isLoading: 사진 로딩 중 여부
 * - hasNextPage: 추가로 로드할 사진이 있는지 여부
 * - endCursor: 페이지네이션을 위한 커서 위치
 */
const AlbumBottomSheet = ({
  visible,
  onClose,
  onSelect,
}: IAlbumBottomSheetProps) => {
  // 앨범에서 불러온 사진 목록을 저장하는 상태
  const [albumPhotos, setAlbumPhotos] = useState<{uri: string}[]>([]);
  // 사용자가 선택한 사진 URI들을 저장하는 Set 상태
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  // 사진 로딩 중 여부를 관리하는 상태
  const [isLoading, setIsLoading] = useState(false);
  // 추가로 로드할 사진이 있는지 여부를 관리하는 상태
  const [hasNextPage, setHasNextPage] = useState(true);
  // 페이지네이션을 위한 커서 위치를 저장하는 상태
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);

  // 바텀시트 애니메이션을 위한 Animated.Value를 참조하는 useRef 훅
  const translateY = useRef(new Animated.Value(300)).current;
  console.log('AlbumBottomSheet', visible);

  /**
   * 바텀시트 표시/숨김 상태 변화를 감지하여 초기화 및 애니메이션을 처리하는 useEffect 훅
   * visible 상태가 true일 때: 사진 목록 초기화, 권한 확인, 초기 사진 로드, 애니메이션 실행
   * visible 상태가 false일 때: 애니메이션 값 초기화, 선택된 사진 목록 초기화
   */
  useEffect(() => {
    if (visible) {
      // 초기화
      setAlbumPhotos([]);
      console.log('앨범 리스트 초기화 완료');
      setSelectedPhotos(new Set());
      setHasNextPage(true);
      setEndCursor(undefined);

      /**
       * 앨범 초기 사진 목록을 로드하는 비동기 함수
       * 사진 라이브러리 권한을 확인하고 첫 번째 페이지의 사진들을 불러옴
       */
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

  /**
   * 사진 선택/해제를 토글하는 함수
   * @param uri - 선택/해제할 사진의 URI (string)
   * 목적: 사진을 선택하거나 선택 해제하며, 최대 선택 개수(10개) 제한을 적용
   */
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

  /**
   * 선택 완료 버튼 클릭 시 실행되는 함수
   * 목적: 선택된 사진들을 배열로 변환하여 부모 컴포넌트에 전달하고 바텀시트를 닫음
   */
  const handleDone = () => {
    const result = Array.from(selectedPhotos);
    console.log('Selected photos:', Array.from(selectedPhotos));
    onSelect(result);
    setTimeout(() => {
      onClose();
    }, 50);
  };

  /**
   * 카메라를 열어 사진을 촬영하는 비동기 함수
   * 목적: 카메라 권한을 확인하고 카메라를 실행하여 새로운 사진을 촬영하고 자동으로 선택 처리
   */
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

  /**
   * 스크롤 끝에서 추가 사진을 로드하는 useCallback 훅으로 최적화된 함수
   * 목적: FlatList가 끝에 도달했을 때 다음 페이지의 사진들을 추가로 불러와 무한 스크롤 구현
   * 의존성: [hasNextPage, isLoading, endCursor] - 이 값들이 변경될 때만 함수 재생성
   */
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

  /**
   * FlatList의 각 아이템을 렌더링하는 함수
   * @param item - 렌더링할 아이템 객체 (uri 속성을 가진 객체)
   * @param index - 아이템의 인덱스 (number)
   * 목적: 첫 번째 아이템은 카메라 버튼으로, 나머지는 사진 이미지로 렌더링하며 선택 상태를 시각적으로 표시
   */
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

  /**
   * FlatList 하단에 로딩 인디케이터를 렌더링하는 함수
   * 목적: 추가 사진을 로드하는 중일 때 사용자에게 로딩 상태를 시각적으로 표시
   */
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
