import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import DeleteIcon from '../../assets/Icon/Icon_BtnClose03.svg';
export interface IImage {
  uri: string;
  name: string;
  type: string;
  file: File;
}

interface IImagePreviewListProps {
  images: IImage[];
  onDelete: (index: number) => void;
}

const ImagePreviewList = ({images, onDelete}: IImagePreviewListProps) => {
  return (
    <FlatList
      data={images}
      style={styles.flatList}
      horizontal={true}
      scrollEnabled={true}
      showsHorizontalScrollIndicator={true}
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
