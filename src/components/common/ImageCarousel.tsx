import React, {useRef, useState} from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';

/**
 * 이미지 캐러셀 컴포넌트
 *
 * 목적:
 * - 가로 스와이프 가능한 이미지 캐러셀 표시
 * - 현재 인덱스/전체 개수를 우측 하단 배지로 표기
 *
 * 관리하는 상태값들:
 * - currentIndex: 현재 보고 있는 아이템의 인덱스
 *
 * 주요 포인트:
 * - FlatList + pagingEnabled를 이용한 페이지네이션 스크롤
 * - onViewableItemsChanged로 현재 인덱스 추적
 * - 화면 너비(Dimensions)를 이용해 이미지 폭에 맞춤
 */
interface ImageCarouselProps {
  /** 표시할 이미지 목록 (각 항목은 imageUrl 포함) */
  images: {imageUrl: string}[];
  /** 뷰 높이 (기본값: 300) */
  height?: number;
}

/** 화면 너비 */
const {width} = Dimensions.get('window');

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  height = 300,
}) => {
  /** 현재 보고 있는 아이템의 인덱스 */
  const [currentIndex, setCurrentIndex] = useState(0);

  /** FlatList ref (향후 필요 시 스크롤 제어 등에 사용) */
  const flatListRef = useRef<FlatList>(null);

  /**
   * 뷰어블 아이템 변경 콜백
   * 목적: 현재 화면에 가장 먼저 보이는 아이템의 index를 currentIndex에 반영
   */
  const onViewRef = useRef(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  /** 뷰어빌리티 설정 (아이템의 50% 이상 보일 때 변경) */
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
      {/* Dot Indicator (필요 시 활성화 가능)
          - images.map 으로 현재 인덱스와 비교하여 활성/비활성 표기 */}
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
