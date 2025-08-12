/**
 * 장례식장 검색 페이지 컴포넌트
 * - 장례식장 검색, 지역별 필터링, 장바구니 추가 및 선택 기능 제공
 * - props: 없음 (route params로 variant 받음)
 * - 주요 라이브러리: @react-navigation/native, react-native-toast-message, jotai
 */
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
} from 'react-native';
import {useInputBase} from '../../hooks/input/useInputBase';
import Typo from '../../components/common/Typo';
import {useEffect, useState, useCallback, useMemo} from 'react';
import {scaleFontSize, scaleSize} from '../../utils/responsive';
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
import {userInfoAtom} from '../../state/local_state/userinfoAtom';

const FuneralSearchPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  // 반응형 스타일 계산 - 화면 크기에 따른 폰트, 패딩 등 스타일 최적화
  const responsiveStyles = useMemo(() => {
    return {
      // 패딩과 마진
      containerPadding: scaleSize(16),
      wrapperPadding: {
        horizontal: scaleSize(16),
        vertical: scaleSize(12),
      },
      searchSpacing: scaleSize(8),
      buttonPadding: {
        vertical: scaleSize(16),
        horizontal: scaleSize(24),
      },

      // 폰트 크기
      searchInputSize: scaleFontSize(14),
      locationButtonSize: scaleFontSize(14),
      resultTextSize: scaleFontSize(10),
      errorTextSize: scaleFontSize(14),
      loadingTextSize: scaleFontSize(16),
      emptyTextSize: scaleFontSize(16),
      footerTextSize: scaleFontSize(14),
      buttonTextSize: scaleFontSize(16),

      // 크기
      borderRadius: scaleSize(10),
      iconSize: scaleSize(18),
      buttonHeight: scaleSize(56),
      bottomPadding: Platform.OS === 'ios' ? scaleSize(34) : scaleSize(16),
    };
  }, []);

  // 로그인 상태 체크
  const [userInfo] = useAtom(userInfoAtom);
  const isLoggedIn = userInfo.isLogin;

  const [_showLocationModal, _setShowLocationModal] = useState(false);
  const [_location, _setLocation] = useState<string>('');
  const [_selectedSido, _setSelectedSido] = useState<string>('');
  const [_selectedSigungu, _setSelectedSigungu] = useState<string>('');
  const [showFindCityBottomSheet, setShowFindCityBottomSheet] = useState(false);
  const [showGuBottomSheet, setShowGuBottomSheet] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('시 / 도');
  const [selectedGu, setSelectedGu] = useState<string>('시 / 군 / 구');

  // 시/도 선택 핸들러 - 시/도 선택 시 자동으로 해당 지역의 장례식장 검색 실행
  const handleSelectCity = (region: string) => {
    setSelectedCity(region);
    setSelectedGu('시 / 군 / 구'); // 시/도가 변경되면 군/구 초기화
    setShowFindCityBottomSheet(false);

    //시/도 선택 시 자동 검색 실행
    setTimeout(() => {
      searchFunerals({
        keyword: hallName.value.trim() || undefined,
        sido: region === '시 / 도' ? undefined : region,
        sigungu: undefined, // 시/도 변경 시 시/군/구는 초기화
        page: 1,
        limit: 20,
      });
    }, 100); // 상태 업데이트 후 검색 실행
  };

  // 시/군/구 선택 핸들러 - 시/군/구 선택 시 자동으로 해당 지역의 장례식장 검색 실행
  const handleSelectGu = (gu: string) => {
    setSelectedGu(gu);
    setShowGuBottomSheet(false);

    //시/군/구 선택 시 자동 검색 실행
    setTimeout(() => {
      searchFunerals({
        keyword: hallName.value.trim() || undefined,
        sido: selectedCity === '시 / 도' ? undefined : selectedCity,
        sigungu: gu === '시 / 군 / 구' ? undefined : gu,
        page: 1,
        limit: 20,
      });
    }, 100); // 상태 업데이트 후 검색 실행
  };

  // StatusBar 설정 - 화면 진입 시 플랫폼별 StatusBar 스타일 적용
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
  console.log('funerals 검색 결과', funerals);
  // funerals 검색 결과는 객체로 이루어진 배열
  // 객체의 정보는 아래와 같음.
  // funeralAddress: string;
  // funeralId: string | null; -> 가입된 장례식장만 string 타입이고, 가입되어 있지 않다면 null
  // funeralListId: string;
  // funeralName: string;
  const {addToCart} = useManagerCart();

  const [selectedItems, setSelectedItems] = useState<FuneralData[]>([]);

  const [_signupInfo, setSignupInfo] = useAtom(signupAtom);

  // variant에 따른 모드 분기 - signup: 회원가입용, main: 메인 검색용
  const isSignup = variant === 'signup';
  const isManagerEstimate = variant === 'main' && isLoggedIn;

  // 초기 데이터 로드 (전체 목록) - 화면 진입 시 전체 장례식장 목록 조회
  useEffect(() => {
    if (searchFunerals) {
      searchFunerals({page: 1, limit: 20});
    }
  }, [searchFunerals]);

  // 검색 버튼 클릭 시에만 실행되는 검색 함수 - 키워드와 지역 필터를 적용한 장례식장 검색
  const handleSearch = useCallback(() => {
    searchFunerals({
      keyword: hallName.value.trim() || undefined,
      sido: selectedCity === '시 / 도' ? undefined : selectedCity,
      sigungu: selectedGu === '시 / 군 / 구' ? undefined : selectedGu,
      page: 1,
      limit: 20,
    });
  }, [hallName.value, selectedCity, selectedGu, searchFunerals]);

  // 장례식장 선택/해제 핸들러 - variant에 따라 단일 선택(회원가입) 또는 다중 선택(일반) 처리
  const handleSelect = (item: FuneralData) => {
    if (variant === 'signup') {
      // 회원가입 시에는 단일 선택만 가능
      setSelectedItems(prevSelected => {
        const exists = prevSelected.find(
          selected => selected.funeralListId === item.funeralListId,
        );
        if (exists) {
          // 이미 선택된 항목을 다시 클릭하면 선택 해제
          return [];
        } else {
          // 새로운 항목 선택 (기존 선택 모두 해제하고 새로 선택)
          return [item];
        }
      });
    } else {
      // 일반 모드에서는 다중 선택 가능
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
    }
  };

  // 장바구니 추가 함수 - 선택된 장례식장들을 장바구니에 추가
  const handleAddToCart = useCallback(async () => {
    // 로그인 체크 - 로그인되지 않은 경우 로그인 유도
    if (!isLoggedIn) {
      Alert.alert(
        '로그인 필요',
        '장바구니 기능을 사용하려면 로그인이 필요합니다.',
        [
          {text: '취소', style: 'cancel'},
          {
            text: '로그인',
            onPress: () => navigation.navigate('Login', {userType: 'manager'}),
          },
        ],
      );
      return;
    }

    if (selectedItems.length === 0) {
      Alert.alert('알림', '선택된 장례식장이 없습니다.');
      return;
    }

    try {
      /**
       * API 연동: POST 장바구니 추가
       * - 선택된 장례식장 목록을 서버의 장바구니에 추가
       */
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
  }, [addToCart, selectedItems, isLoggedIn, navigation]);

  // 회원가입용 장례식장 선택 - 선택된 장례식장을 signupAtom에 저장
  const selectFuneral = async () => {
    if (selectedItems.length === 0) {
      Alert.alert('알림', '선택된 장례식장이 없습니다.');
      return;
    }

    // 회원가입 시에는 단일 선택이므로 첫 번째(유일한) 항목 사용
    const selectedFuneral = selectedItems[0];
    console.log('🚀 ~ selectFuneral ~ selectedFuneral:', selectedFuneral);

    // 선택된 장례식장 ID를 signupAtom에 저장
    setSignupInfo(prev => ({
      ...prev,
      selectedFuneral: {
        funeralId: selectedFuneral.funeralId,
        funeralListId: selectedFuneral.funeralListId,
        funeralName: selectedFuneral.funeralName,
        funeralAddress: selectedFuneral.funeralAddress,
      },
    }));

    Toast.show({
      type: 'success',
      text1: `${selectedFuneral.funeralName}이(가) 선택되었습니다.`,
      position: 'top',
    });

    // 이전 화면으로 돌아가기
    navigation.goBack();
  };

  // FlatList 끝에 도달했을 때 호출 - 무한 스크롤을 위한 추가 데이터 로드
  const handleEndReached = useCallback(() => {
    if (pageInfo?.hasNext && !loadingMore && !loading) {
      loadMoreFunerals();
    }
  }, [pageInfo?.hasNext, loadingMore, loading, loadMoreFunerals]);

  // Footer 컴포넌트 (로딩 스피너) - 추가 데이터 로딩 중일 때 표시
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
      <View style={styles.container}>
        <View
          style={[
            styles.wrapper,
            {
              paddingHorizontal: responsiveStyles.wrapperPadding.horizontal,
              paddingVertical: responsiveStyles.wrapperPadding.vertical,
            },
          ]}>
          {/* 에러 메시지 표시 */}
          {error && (
            <View style={styles.errorContainer}>
              <Typo
                style={[
                  styles.errorText,
                  {fontSize: responsiveStyles.errorTextSize},
                ]}>
                ❌ {error}
              </Typo>
            </View>
          )}

          <View
            style={[
              styles.searchContainer,
              {gap: responsiveStyles.searchSpacing},
            ]}>
            {/* 검색 입력 영역 - 돋보기 아이콘 내장 */}
            <View
              style={[
                styles.searchInputContainer,
                {borderRadius: responsiveStyles.borderRadius},
              ]}>
              <TextInput
                style={[
                  styles.searchInput,
                  {fontSize: responsiveStyles.searchInputSize},
                ]}
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
                <Typo
                  style={[
                    styles.searchIcon,
                    {fontSize: responsiveStyles.iconSize},
                  ]}>
                  🔍
                </Typo>
              </TouchableOpacity>
            </View>

            {/* 위치 선택 영역 - 아이콘 내장 */}
            <View
              style={[
                styles.locationContainer,
                {gap: responsiveStyles.searchSpacing},
              ]}>
              <CustomButton
                onPress={() => setShowFindCityBottomSheet(true)}
                style={[
                  styles.locationButton,
                  {
                    borderRadius: responsiveStyles.borderRadius,
                    paddingVertical: responsiveStyles.buttonPadding.vertical,
                    paddingHorizontal:
                      responsiveStyles.buttonPadding.horizontal,
                  },
                ]}>
                <Typo
                  style={[
                    styles.locationButtonText,
                    {fontSize: responsiveStyles.locationButtonSize},
                  ]}>
                  {selectedCity}
                </Typo>
              </CustomButton>
              <CustomButton
                onPress={() => setShowGuBottomSheet(true)}
                style={[
                  styles.locationButton,
                  {
                    borderRadius: responsiveStyles.borderRadius,
                    paddingVertical: responsiveStyles.buttonPadding.vertical,
                    paddingHorizontal:
                      responsiveStyles.buttonPadding.horizontal,
                  },
                ]}>
                <Typo
                  style={[
                    styles.locationButtonText,
                    {fontSize: responsiveStyles.locationButtonSize},
                  ]}>
                  {selectedGu}
                </Typo>
              </CustomButton>
            </View>

            {/* 검색 결과 헤더 - pageInfo가 있을 때만 표시 */}
            {pageInfo && (
              <View style={styles.resultHeader}>
                <Typo
                  style={[
                    styles.resultText,
                    {fontSize: responsiveStyles.resultTextSize},
                  ]}>
                  총 {pageInfo.totalItems} / {funerals.length}
                </Typo>
              </View>
            )}
          </View>

          <View style={styles.listContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2D81F1" />
                <Typo
                  style={[
                    styles.loadingText,
                    {fontSize: responsiveStyles.loadingTextSize},
                  ]}>
                  검색 중...
                </Typo>
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
                        selected =>
                          selected.funeralListId === item.funeralListId,
                      )
                    }
                    // 카드 비활성화 조건 - 회원가입용과 일반용에 따른 카드 상태 제어
                    cardDisabled={
                      (isSignup && item.funeralId !== null) ||
                      (isManagerEstimate && item.funeralId === null)
                    }
                    // 체크박스 표시 조건 - 선택 가능한 카드에만 체크박스 표시
                    showCheckbox={
                      (isSignup && item.funeralId === null) ||
                      (isManagerEstimate && item.funeralId !== null)
                    }
                    onPressCheck={() => {
                      if (
                        (isSignup && item.funeralId === null) ||
                        (isManagerEstimate && item.funeralId !== null)
                      ) {
                        handleSelect(item);
                      }
                    }}
                    onPressCard={() => {
                      // 카드 클릭 비활성화 조건 - 선택 불가능한 카드는 상세보기 불가
                      if (
                        (isSignup && item.funeralId !== null) ||
                        (isManagerEstimate && item.funeralId === null)
                      ) {
                        return;
                      }
                      navigation.navigate('FuneralDetail', {
                        funeralListId: item.funeralListId,
                        funeralId: item.funeralId,
                        variant: variant,
                      });
                    }}
                  />
                )}
                // 페이지네이션 관련 props
                onEndReached={handleEndReached} // 끝에 도달했을 때
                onEndReachedThreshold={0.1} // 90% 스크롤 시 트리거
                ListFooterComponent={renderFooter} // 하단 로딩 표시
                ListEmptyComponent={
                  !loading ? (
                    <View style={styles.emptyContainer}>
                      <Typo
                        style={[
                          styles.emptyText,
                          {fontSize: responsiveStyles.emptyTextSize},
                        ]}>
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
                // 성능 최적화
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={50}
                initialNumToRender={10}
                windowSize={10}
                contentContainerStyle={[
                  styles.flatListContent,
                  {
                    paddingBottom: responsiveStyles.containerPadding,
                  },
                ]}
              />
            )}
          </View>
        </View>

        {/* 고정 버튼 영역 - 로그인된 사용자 또는 회원가입 모드에서만 표시 */}
        {((variant === 'main' && isLoggedIn) || variant === 'signup') && (
          <View
            style={[
              styles.fixedButtonContainer,
              {
                paddingHorizontal: responsiveStyles.containerPadding,
                paddingVertical: scaleSize(8),
                paddingBottom: responsiveStyles.bottomPadding,
              },
            ]}>
            <CustomButton
              onPress={variant === 'main' ? handleAddToCart : selectFuneral}
              style={[
                styles.button,
                {
                  height: responsiveStyles.buttonHeight,
                  borderRadius: responsiveStyles.borderRadius,
                  paddingHorizontal: responsiveStyles.buttonPadding.horizontal,
                },
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
                    {fontSize: responsiveStyles.buttonTextSize},
                    selectedItems.length === 0 && styles.buttonTextDisabled,
                  ]}>
                  {variant === 'main'
                    ? `장바구니 담기 (${selectedItems.length})`
                    : selectedItems.length === 0
                    ? '장례식장을 선택해주세요'
                    : '선택 완료'}
                </Typo>
              </View>
              <MoveIcon width={24} height={24} />
            </CustomButton>
          </View>
        )}

        {/* Bottom Sheets */}
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
  // 전체 컨테이너
  container: {
    flex: 1,
    position: 'relative',
  },
  wrapper: {
    flex: 1,
    paddingBottom: scaleSize(80), // 하단 버튼 영역만큼 여백 추가
  },
  searchContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  // 검색 입력창 - 돋보기 아이콘 내장
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 2,
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
    paddingRight: 40, // 돋보기 아이콘 공간 확보
    color: '#333',
  },
  searchIconContainer: {
    position: 'absolute',
    right: 12,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2d82f100',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  searchIcon: {
    fontSize: 18,
    color: '#2D81F1',
  },

  // 위치 선택창 - 위치 아이콘 내장
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
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
  },
  // FlatList 컨텐츠 스타일
  flatListContent: {
    paddingBottom: 16,
  },
  // 고정된 버튼 컨테이너
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E0E0E0',
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  button: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#2D81F1',
    justifyContent: 'space-between',
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
    marginLeft: 8,
    marginBottom: 4,
    // padding: 10,
    // borderBottomColor: '#dedede',
    // borderTopWidth: 1,
    // borderTopColor: '#dedede',
  },
  resultText: {
    color: '#666',
    fontSize: 10,
    fontWeight: '400',
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
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  locationButtonText: {
    color: '#2D81F1',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Pretendard-Bold',
  },
  // 비활성화된 버튼 스타일
  buttonDisabled: {
    backgroundColor: '#E0E0E0', // 회색 배경
    opacity: 0.8, // 투명도
  },
  // 비활성화된 텍스트 스타일
  buttonTextDisabled: {
    color: '#999999', // 회색 텍스트
  },
});
