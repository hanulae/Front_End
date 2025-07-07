import React, {useRef, useState} from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';

interface ImageCarouselProps {
  images: {imageUrl: string}[];
  height?: number;
}

const {width} = Dimensions.get('window');

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  height = 300,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewRef = useRef(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});

  return (
    <View style={{width: '100%', height}}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({item}) => (
          <Image
            source={{uri: item.imageUrl}}
            style={{width, height, resizeMode: 'contain'}}
          />
        )}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />
      {/* Dot Indicator */}
      {/* <View style={styles.dotContainer}>
        {images.map((_, idx) => (
          <View
            key={idx}
            style={[styles.dot, currentIndex === idx && styles.activeDot]}
          />
        ))}
      </View> */}
      {/* 하단 우측 현재/전체 인덱스 */}
      <View style={styles.indexBadgeContainer}>
        <View style={styles.indexBadge}>
          <Text style={styles.indexBadgeText}>
            {images.length > 0
              ? `${currentIndex + 1} / ${images.length}`
              : '0 / 0'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dotContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#2D81F1',
    width: 10,
    height: 10,
  },
  indexBadgeContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 20,
  },
  indexBadge: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ImageCarousel;
