import {
  Alert,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import {useInputBase} from '../../hooks/input/useInputBase';
import Typo from '../../components/common/Typo';
import {useEffect, useState, useCallback} from 'react';
import FuneralCard from '../../components/common/FuneralCard';
import CustomButton from '../../components/common/CustomButton';
import {useRoute, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ManagerLayout from '../../layout/ManagerLayout';
import MoveIcon from '../../assets/Button/Button_MoveTransparent.svg';
import CartIcon from '../../assets/Button/Button_Cart.svg';
import {useFuneralSearch} from '../../hooks/useFuneralSearch';
import {FuneralData} from '../../services/api/funeralService';
import {useManagerCart} from '../../hooks/useManagerCart';
import FindCityBottomSheet from '../../components/funeralHall/FindLocation/FindCityBottomSheet';
import FindGuBottomSheet from '../../components/funeralHall/FindLocation/FindGuBottomSheet';
import Toast from 'react-native-toast-message';
import {useAtom} from 'jotai';
import {signupAtom} from '../../state/local_state/signupAtom';

const {height} = Dimensions.get('window');

const FuneralSearchPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [_showLocationModal, _setShowLocationModal] = useState(false);
  const [_location, _setLocation] = useState<string>('');
  const [_selectedSido, _setSelectedSido] = useState<string>('');
  const [_selectedSigungu, _setSelectedSigungu] = useState<string>('');
  const [showFindCityBottomSheet, setShowFindCityBottomSheet] = useState(false);
  const [showGuBottomSheet, setShowGuBottomSheet] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('시 / 도');
  const [selectedGu, setSelectedGu] = useState<string>('시 / 군 / 구');

  const handleSelectCity = (region: string) => {
    setSelectedCity(region);
    setSelectedGu('시 / 군 / 구'); // 시/도가 변경되면 군/구 초기화
    setShowFindCityBottomSheet(false);
  };

  const handleSelectGu = (gu: string) => {
    setSelectedGu(gu);
    setShowGuBottomSheet(false);
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#3287F8');
      StatusBar.setBarStyle('dark-content');
    } else {
      StatusBar.setBarStyle('dark-content');
    }
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

  const {addToCart} = useManagerCart();

  const [selectedItems, setSelectedItems] = useState<FuneralData[]>([]);

  const [signupInfo, setSignupInfo] = useAtom(signupAtom);

  // ✅ 초기 데이터 로드 (전체 목록)
  useEffect(() => {
    if (searchFunerals) {
      searchFunerals({page: 1, limit: 20});
    }
  }, [searchFunerals]);

  // ✅ 검색 버튼 클릭 시에만 실행되는 검색 함수
  const handleSearch = useCallback(() => {
    searchFunerals({
      keyword: hallName.value.trim() || undefined,
      sido: selectedCity === '시 / 도' ? undefined : selectedCity,
      sigungu: selectedGu === '시 / 군 / 구' ? undefined : selectedGu,
      page: 1,
      limit: 20,
    });
  }, [hallName.value, selectedCity, selectedGu, searchFunerals]);

  const handleSelect = (item: FuneralData) => {
    setSelectedItems(prevSelected => {
      const exists = prevSelected.find(
        selected => selected.funeralListId === item.funeralListId,
      );
      if (exists) {
        return prevSelected.filter(
          selected => selected.funeralListId !== item.funeralListId,
        );
      } else {
        return [...prevSelected, item];
      }
    });
  };

  // ✅ 장바구니 추가 함수
  const handleAddToCart = useCallback(async () => {
    if (selectedItems.length === 0) {
      Alert.alert('알림', '선택된 장례식장이 없습니다.');
      return;
    }

    try {
      const result = await addToCart(selectedItems);
      if (result) {
        let message = `${result.addedCount}개 항목이 장바구니에 추가되었습니다.`;
        if (result.alreadyExistsCount && result.alreadyExistsCount > 0) {
          message += ` (${result.alreadyExistsCount}개는 이미 존재)`;
        }

        Toast.show({
          type: 'success',
          text1: message,
          position: 'top',
          topOffset: -150,
          visibilityTime: 2000,
        });
      }

      // 선택 항목 초기화
      setSelectedItems([]);
    } catch (err) {
      console.error('장바구니 추가 실패', err);
      Toast.show({
        type: 'error',
        text1: '장바구니 추가 실패',
        text2: '잠시 후 다시 시도해주세요.',
        position: 'top',
        topOffset: -150,
        visibilityTime: 2000,
      });
    }
  }, [addToCart, selectedItems]);

  const selectFuneral = async () => {
    if (selectedItems.length === 0) {
      Alert.alert('알림', '선택된 장례식장이 없습니다.');
      return;
    }
    console.log('🚀 ~ selectFuneral ~ selectedItems:', selectedItems);

    // 선택된 장례식장 ID를 signupAtom에 저장
    setSignupInfo(prev => ({
      ...prev,
      selectedFuneral: {
        funeralId: selectedItems[0].funeralId,
        funeralListId: selectedItems[0].funeralListId,
        funeralName: selectedItems[0].funeralName,
        funeralAddress: selectedItems[0].funeralAddress,
      },
    }));

    Toast.show({
      type: 'success',
      text1: '장례식장이 선택되었습니다.',
      position: 'top',
    });

    // 이전 화면으로 돌아가기
    navigation.goBack();
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
          <View style={styles.locationContainer}>
            <CustomButton
              onPress={() => setShowFindCityBottomSheet(true)}
              style={styles.locationButton}>
              <Typo style={styles.locationButtonText}>{selectedCity}</Typo>
            </CustomButton>
            <CustomButton
              onPress={() => setShowGuBottomSheet(true)}
              style={styles.locationButton}>
              <Typo style={styles.locationButtonText}>{selectedGu}</Typo>
            </CustomButton>
          </View>

          {/* 🆕 검색 결과 헤더 - pageInfo가 있을 때만 표시 */}
          {pageInfo && (
            <View style={styles.resultHeader}>
              <Typo style={styles.resultText}>
                📊 총 {pageInfo.totalItems}개의 장례식장을 찾았습니다. (페이지{' '}
                {pageInfo.currentPage}/{pageInfo.totalPages})
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
              renderItem={({item}) => (
                <FuneralCard
                  item={item}
                  selected={
                    !!selectedItems.find(
                      selected => selected.funeralListId === item.funeralListId,
                    )
                  }
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
              onEndReached={handleEndReached} // 끝에 도달했을 때
              onEndReachedThreshold={0.1} // 90% 스크롤 시 트리거
              ListFooterComponent={renderFooter} // 하단 로딩 표시
              ListEmptyComponent={
                !loading ? (
                  <View style={styles.emptyContainer}>
                    <Typo style={styles.emptyText}>
                      📭 검색 결과가 없습니다.
                    </Typo>
                  </View>
                ) : null
              }
              refreshing={loading}
              onRefresh={() => {
                console.log('🔄 새로고침 시작');
                setSelectedCity('시 / 도');
                setSelectedGu('시 / 군 / 구');
                hallName.onChangeText('');
                resetSearch();
                searchFunerals({page: 1, limit: 20});
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
            <CustomButton
              onPress={handleAddToCart}
              style={[
                styles.button,
                selectedItems.length === 0 && styles.buttonDisabled,
              ]}
              disabled={selectedItems.length === 0}>
              <View style={styles.buttonIcon}>
                <CartIcon
                  width={24}
                  height={24}
                  fill={selectedItems.length === 0 ? '#ffffff' : '#ffffff'}
                />
                <Typo
                  style={[
                    styles.buttonText,
                    selectedItems.length === 0 && styles.buttonTextDisabled,
                  ]}>
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
          </View>
        )}
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
      <Toast />
    </ManagerLayout>
  );
};

export default FuneralSearchPage;

const styles = StyleSheet.create({
  wrapper: {
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
    backgroundColor: '#2d82f100',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
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
    backgroundColor: '#2d82f100',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
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
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  locationButton: {
    flex: 1,
    borderColor: '#2D81F1',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  locationButtonText: {
    color: '#2D81F1',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Pretendard-Bold',
  },
  // ✅ 비활성화된 버튼 스타일
  buttonDisabled: {
    backgroundColor: '#E0E0E0', // 회색 배경
    opacity: 0.8, // 투명도
  },
  // ✅ 비활성화된 텍스트 스타일
  buttonTextDisabled: {
    color: '#999999', // 회색 텍스트
  },
});
