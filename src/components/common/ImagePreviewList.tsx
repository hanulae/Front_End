import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import DeleteIcon from '../../assets/Icon/Icon_BtnClose03.svg';

/**
 * 선택된 이미지를 미리보기하는 리스트 컴포넌트
 *
 * 목적:
 * - 가로 스크롤 가능한 썸네일 리스트 표시
 * - 각 이미지에 삭제 버튼 제공
 *
 * 주요 포인트:
 * - FlatList horizontal 구성
 * - 외부에서 onDelete 콜백으로 삭제 처리
 */
export interface IImage {
  /** 이미지 URI */
  uri: string;
  /** 파일명 */
  name: string;
  /** MIME 타입 */
  type: string;
  /** 원본 File 객체 (플랫폼/환경에 따라 다를 수 있음) */
  file: File;
}

/**
 * ImagePreviewList Props
 * @param images - 미리볼 이미지 배열
 * @param onDelete - 삭제 버튼 클릭 시 index를 전달
 * @param scrollEnabled - 스크롤 활성 여부 (기본값: true)
 */
interface IImagePreviewListProps {
  images: IImage[];
  onDelete: (index: number) => void;
  scrollEnabled?: boolean;
}

const ImagePreviewList = ({
  images,
  onDelete,
  scrollEnabled = true,
}: IImagePreviewListProps) => {
  return (
    <FlatList
      data={images}
      style={styles.flatList}
      horizontal={true}
      scrollEnabled={scrollEnabled}
      showsHorizontalScrollIndicator={scrollEnabled}
      contentContainerStyle={styles.container}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({item, index}) => (
        <View style={styles.imageWrapper}>
          <Image source={{uri: item.uri}} style={styles.image} />
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(index)}>
            <DeleteIcon width={18} height={18} />
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

export default ImagePreviewList;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    minWidth: '100%',
  },
  imageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 10,
    padding: 2,
  },
  flatList: {
    height: 140,
    paddingVertical: 10,
    paddingHorizontal: 4,
    minWidth: '100%',
  },
});
