import {
  Alert,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useInputBase} from '../../hooks/input/useInputBase';
// import {Input} from '../../components/common/input/Input';
import Typo from '../../components/common/Typo';
import {useEffect, useState, useCallback} from 'react';
import FuneralCard from '../../components/common/FuneralCard';
import CustomButton from '../../components/common/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute, useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ManagerLayout from '../../layout/ManagerLayout';
import MoveIcon from '../../assets/Button/Button_MoveTransparent.svg';
import CartIcon from '../../assets/Button/Button_Cart.svg';
import FindLocationModal from '../../components/funeralHall/FindLocation';
import { useFuneralSearch } from '../../hooks/useFuneralSearch';
import { FuneralData } from '../../services/api/funeralService';
import { useManagerCart } from '../../hooks/useManagerCart';

const {height} = Dimensions.get('window');

const FuneralSearchPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [location, setLocation] = useState<string>('');
  const [selectedSido, setSelectedSido] = useState<string>('');
  const [selectedSigungu, setSelectedSigungu] = useState<string>('');

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#3287F8');
      StatusBar.setBarStyle('dark-content');
    } else {
      StatusBar.setBarStyle('dark-content');
    }
    // 초기 로드 시 전체 리스트 조회
    searchFunerals();
  }, []);

  const route = useRoute();
  const params = route.params;
  const {variant} = params as {variant: string};


  const hallName = useInputBase();
  const {
    funerals,
    loading,
    loadingMore,
    error,
    pageInfo,
    // currentPage,
    searchFunerals,
    loadMoreFunerals,
    resetSearch,
  } = useFuneralSearch();

  const {
    loading: cartLoading,
    error: cartError,
    addToCart,
    clearError,
  } = useManagerCart();

  const [selectedItems, setSelectedItems] = useState<FuneralData[]>([]);

  // ✅ 초기 데이터 로드 (전체 목록)
  useEffect(() => {
    if (searchFunerals) {
      searchFunerals({ page: 1, limit: 20 });
    }
  }, [searchFunerals]);

  // ✅ 검색 버튼 클릭 시에만 실행되는 검색 함수
  const handleSearch = useCallback(() => {
    searchFunerals({
      keyword: hallName.value.trim() || undefined,
      sido: selectedSido || undefined,
      sigungu: selectedSigungu || undefined,
      page: 1,
      limit: 20,
    });
  }, [hallName.value, selectedSido, selectedSigungu, searchFunerals]);


  // ✅ 위치 선택 완료 시 처리
  const handleLocationComplete = useCallback((selectedLocation: string, sido: string, sigungu: string) => {
    setLocation(selectedLocation);
    setSelectedSido(sido);
    setSelectedSigungu(sigungu);

    // 위치 선택 후에는 자동으로 검색하지 않음 (사용자가 검색 버튼 클릭해야 함)
  }, []);

  const handleSelect = (item: FuneralData) => {
    setSelectedItems(prevSelected => {
      const exists = prevSelected.find(selected => selected.funeralListId === item.funeralListId);
      if (exists) {
        return prevSelected.filter(selected => selected.funeralListId !== item.funeralListId);
      } else {
        return [...prevSelected, item];
      }
    });
  };

  // const handleAddToCart = async () => {
  //   try {
  //     await AsyncStorage.setItem('funeralCart', JSON.stringify(selectedItems));
  //   } catch (err) {
  //     console.error('장바구니 저장 실패', err);
  //   }
  // };

  const handleAddToCart = useCallback(async () => {
    if (selectedItems.length === 0) {
      Alert.alert('알림', '선택된 장례식장이 없습니다.');
      return;
    }

    try {
      const result = await addToCart(selectedItems, 'temp-manager-id');
      if (result) {
        // 성공 시 알림 및 선택 항목 초기화
        Alert.alert(
          '성공',
          `${result.addedCount || 0}개의 장례식장이 장바구니에 추가되었습니다.${
            result.alreadyExistsCount ? `\(이미 존재: ${result.alreadyExistsCount}개)` : ''
          }`,
          [
            {
              text: '확인',
              onPress: () => {
                // 성공 후 선택 항목 초기화
                setSelectedItems([]);
              },
            },
          ],
        );
      }
    } catch (err) {
      console.error('장바구니 추가 실패', err);
    }
  }, [addToCart, selectedItems]);

  const selectFuneral = async () => {
    try {
      const selectedFuneral = await AsyncStorage.getItem('funeralCart');
      if (selectedFuneral !== null) {
      }
    } catch (err) {
      console.error('장례식장 선택 실패', err);
    }
  };

  //FlatList 끝에 도달했을 때 호출
  const handleEndReached = useCallback(() => {
    if (pageInfo?.hasNext && !loadingMore && !loading) {
      loadMoreFunerals();
    }
  }, [pageInfo?.hasNext, loadingMore, loading, loadMoreFunerals]);

  //Footer 컴포넌트 (로딩 스피너)
  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator size="small" color="#2D81F1" />
        <Typo style={styles.footerLoadingText}>더 많은 데이터 로딩 중...</Typo>
      </View>
    );
  };

  return (
    <ManagerLayout
      headerShown={true}
      headerTitle="장례식장 검색"
      color="white"
      homeButton={true}
      logoutButton={false}>
      <View style={styles.wrapper}>
        {/* ❌ 에러 메시지 표시 */}
        {error && (
          <View style={styles.errorContainer}>
            <Typo style={styles.errorText}>❌ {error}</Typo>
          </View>
        )}

        <View style={styles.searchContainer}>
          {/* 🔍 검색 입력 영역 - 돋보기 아이콘 내장 */}
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="장례식장명을 입력하세요"
              value={hallName.value}
              onChangeText={hallName.onChangeText}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <TouchableOpacity
              style={styles.searchIconContainer}
              onPress={handleSearch}
              activeOpacity={0.7}>
              <Typo style={styles.searchIcon}>🔍</Typo>
            </TouchableOpacity>
          </View>

          {/* 📍 위치 선택 영역 - 아이콘 내장 */}
          <View style={styles.locationInputContainer}>
            <TextInput 
              editable={false}
              value={location}
              style={styles.locationInput}
              placeholder="위치를 선택해주세요"
            />
            <TouchableOpacity
              style={styles.locationIconContainer}
              onPress={() => setShowLocationModal(true)}
              activeOpacity={0.7}>
              <Typo style={styles.locationIcon}>📍</Typo>
            </TouchableOpacity>
          </View>
          {/* 🆕 검색 결과 헤더 - pageInfo가 있을 때만 표시 */}
          {pageInfo && (
            <View style={styles.resultHeader}>
              <Typo style={styles.resultText}>
                📊 총 {pageInfo.totalItems}개의 장례식장을 찾았습니다.
                (페이지 {pageInfo.currentPage}/{pageInfo.totalPages})
              </Typo>
              {/* 🆕 현재 표시 중인 데이터 수 */}
              <Typo style={styles.currentResultText}>
                현재 {funerals.length}개 표시 중
              </Typo>
            </View>
          )}
        </View>

        <View style={styles.listContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2D81F1" />
              <Typo style={styles.loadingText}>검색 중...</Typo>
            </View>
          ) : (
            <FlatList
              data={funerals}
              keyExtractor={item => item.funeralListId}
              renderItem={({ item }) => (
                <FuneralCard
                  item={item}
                  selected={!!selectedItems.find(selected => selected.funeralListId === item.funeralListId)}
                  onPressCheck={() => handleSelect(item)}
                  onPressCard={() => {
                    navigation.navigate('FuneralDetail', {
                      funeralListId: item.funeralListId,
                      funeralId: item.funeralId,
                    });
                  }}
                />
              )}

              // 🆕 페이지네이션 관련 props
              onEndReached={handleEndReached}           // 끝에 도달했을 때
              onEndReachedThreshold={0.1}               // 90% 스크롤 시 트리거
              ListFooterComponent={renderFooter}        // 하단 로딩 표시

              ListEmptyComponent={
                !loading ? (
                  <View style={styles.emptyContainer}>
                    <Typo style={styles.emptyText}>📭 검색 결과가 없습니다.</Typo>
                  </View>
                ) : null
              }
              refreshing={loading}
              onRefresh={() => {
                console.log('🔄 새로고침 시작');
                hallName.onChangeText('');
                resetSearch();
                searchFunerals({ page: 1, limit: 20 });
              }}

              // 🆕 성능 최적화
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={50}
              initialNumToRender={10}
              windowSize={10}
            />
          )}
        </View>

        {/* 버튼 영역 */}
        {variant === 'main' && (
          <View style={styles.buttonContainer}>
            <CustomButton onPress={handleAddToCart} style={styles.button}>
              <View style={styles.buttonIcon}>
                <CartIcon width={24} height={24} />
                <Typo style={styles.buttonText}>
                  장바구니 담기 ({selectedItems.length})
                </Typo>
              </View>
              <MoveIcon width={24} height={24} />
            </CustomButton>
          </View>
        )}

        {variant === 'signup' && (
          <View style={styles.buttonContainer}>
            <CustomButton onPress={selectFuneral} style={styles.button}>
              <View style={styles.buttonIcon}>
                <CartIcon width={24} height={24} />
                <Typo style={styles.buttonText}>
                  선택 ({selectedItems.length})
                </Typo>
              </View>
              <MoveIcon width={24} height={24} />
            </CustomButton>
          )}
        </View>

        {showFindCityBottomSheet && (
          <FindCityBottomSheet
            visible={showFindCityBottomSheet}
            onClose={() => setShowFindCityBottomSheet(false)}
            onSelect={handleSelectCity}
            selectedRegion={selectedCity}
          />
        )}
        {showGuBottomSheet && (
          <FindGuBottomSheet
            visible={showGuBottomSheet}
            onClose={() => setShowGuBottomSheet(false)}
            onSelect={handleSelectGu}
            selectedDistrict={selectedGu}
            selectedRegion={selectedCity}
          />
        )}
      </View>

      <FindLocationModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onComplete={handleLocationComplete} // 수정된 콜백 사용
      />
    </ManagerLayout>
  );
};

export default FuneralSearchPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'column',
    // paddingBottom: 10,
    // marginBottom: 8,
    gap: 10,
  },
  // ✅ 검색 입력창 - 돋보기 아이콘 내장
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 4,
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 12,
    paddingRight: 40, // 돋보기 아이콘 공간 확보
    color: '#333',
  },
  searchIconContainer: {
    position: 'absolute',
    right: 12,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 18,
    color: '#2D81F1',
  },

  // ✅ 위치 선택창 - 위치 아이콘 내장
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 4,
    position: 'relative',
  },
  locationInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 12,
    paddingRight: 40, // 위치 아이콘 공간 확보
    color: '#333',
  },
  locationIconContainer: {
    position: 'absolute',
    right: 12,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 18,
    color: '#2D81F1',
  },
  listContainer: {
    maxHeight: height * 0.52,
    // paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#2D81F1',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  buttonIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#2D81F1',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
  resultHeader: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
    borderTopWidth: 1,
    borderTopColor: '#dedede',
  },
  resultText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    fontWeight: '500',
  },
  footerLoading: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  footerLoadingText: {
    color: '#666',
    fontSize: 14,
  },
  currentResultText: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
});
