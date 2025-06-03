import {
  Alert,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {useInputBase} from '../../hooks/input/useInputBase';
import {Input} from '../../components/common/input/Input';
import Typo from '../../components/common/Typo';
import {useEffect, useState} from 'react';
import FuneralCard from '../../components/common/FuneralCard';
import CustomButton from '../../components/common/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute} from '@react-navigation/native';
import ManagerLayout from '../../layout/ManagerLayout';
import MoveIcon from '../../assets/Button/Button_MoveTransparent.svg';
import CartIcon from '../../assets/Button/Button_Cart.svg';
import FindCityBottomSheet from '../../components/funeralHall/FindLocation/FindCityBottomSheet';
import FindGuBottomSheet from '../../components/funeralHall/FindLocation/FindGuBottomSheet';
import api from '../../api/config';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAtomValue, useSetAtom} from 'jotai';
import {myFuneralAtom} from '../../state/local_state/myFuneralAtom';
import {userInfoAtom} from '../../state/local_state/userinfoAtom';

// const {height} = Dimensions.get('window');

interface FuneralItem {
  id: string;
  name: string;
  address: string;
  phone: string;
  image?: string;
}

const FuneralSearchPage = () => {
  const [showFindCityBottomSheet, setShowFindCityBottomSheet] = useState(false);
  const [showGuBottomSheet, setShowGuBottomSheet] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('시 / 도');
  const [selectedGu, setSelectedGu] = useState<string>('군 / 구');
  const [funeralList, setFuneralList] = useState<FuneralItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isLogin = useAtomValue(userInfoAtom);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const setMyFuneral = useSetAtom(myFuneralAtom);

  const handleSelectCity = (region: string) => {
    setSelectedCity(region);
    setSelectedGu('군 / 구'); // 시/도가 변경되면 군/구 초기화
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
    // 초기 로드 시 전체 리스트 조회
    searchFunerals();
  }, []);

  const route = useRoute();
  const params = route.params;
  const {variant} = params as {variant: string};

  const hallName = useInputBase();
  const [selectedItems, setSelectedItems] = useState<FuneralItem[]>([]);

  // 장례식장 검색 API 호출
  const searchFunerals = async () => {
    setIsLoading(true);
    try {
      const searchParams: any = {
        page: 1,
        limit: 20,
      };

      // 검색어가 있으면 추가
      if (hallName.value.trim()) {
        searchParams.keyword = hallName.value.trim();
      }

      // 시/도가 선택되었으면 추가
      if (selectedCity && selectedCity !== '시 / 도') {
        searchParams.sido = selectedCity;
      }

      // 군/구가 선택되었으면 추가
      if (selectedGu && selectedGu !== '군 / 구') {
        searchParams.sigungu = selectedGu;
      }

      const response = await api.get('/manager/funeral/search', {
        params: searchParams,
      });

      console.log('검색결과 콘솔 출력값', response.data.data);

      // API 응답을 FuneralItem 형태로 변환 (이미지는 고정값)
      const transformedData: FuneralItem[] = response.data.data.map(
        (item: any, index: number) => ({
          id: item.funeralListId || item.id || index.toString(),
          name: item.funeralName || '장례식장 이름',
          address: item.funeralAddress || '주소 정보 없음',
          phone: item.phone || '전화번호 없음',
          image: require('../../assets/dummyHall.png'), // 고정 이미지
        }),
      );

      setFuneralList(transformedData);
    } catch (error) {
      console.error('장례식장 검색 실패:', error);
      setFuneralList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (item: FuneralItem) => {
    setSelectedItems(prevSelected => {
      const exists = prevSelected.find(selected => selected.id === item.id);
      if (exists) {
        return prevSelected.filter(selected => selected.id !== item.id);
      } else {
        return [...prevSelected, item];
      }
    });
  };

  const handleAddToCart = async () => {
    try {
      // 선택된 항목이 없는 경우 처리
      if (selectedItems.length === 0) {
        Alert.alert('알림', '장바구니에 담을 장례식장을 선택해주세요.');
        return;
      }

      // 기존 장바구니 데이터 확인
      const existingCart = await AsyncStorage.getItem('funeralCart');
      let cartItems = existingCart ? JSON.parse(existingCart) : [];

      // 중복 항목 체크 및 새 항목 추가
      const newCartItems = selectedItems.filter(
        newItem =>
          !cartItems.some(
            (existingItem: any) => existingItem.id === newItem.id,
          ),
      );

      if (newCartItems.length === 0) {
        Alert.alert('알림', '이미 장바구니에 담긴 장례식장입니다.');
        return;
      }

      // 새로운 항목 추가
      cartItems = [...cartItems, ...newCartItems];
      await AsyncStorage.setItem('funeralCart', JSON.stringify(cartItems));

      Alert.alert('성공', '장바구니에 추가되었습니다.');

      // 선택 초기화
      setSelectedItems([]);
    } catch (error) {
      console.error('장바구니 저장 실패:', error);
      Alert.alert('오류', '장바구니 저장에 실패했습니다.');
    }
  };

  const selectFuneral = async () => {
    try {
      // 하나의 항목만 선택되었는지 확인
      if (selectedItems.length === 0) {
        Alert.alert('알림', '장례식장을 선택해주세요.');
        return;
      }

      if (selectedItems.length > 1) {
        Alert.alert('알림', '하나의 장례식장만 선택해주세요.');
        return;
      }

      const selectedFuneral = selectedItems[0];

      // myFuneralAtom 업데이트
      setMyFuneral({
        funeralName: selectedFuneral.name,
        funeralAddress: selectedFuneral.address,
      });

      // 선택 완료 후 처리 (예: 이전 페이지로 이동)
      navigation.goBack();
    } catch (error) {
      console.error('장례식장 선택 실패:', error);
      Alert.alert('오류', '장례식장 선택에 실패했습니다.');
    }
  };

  return (
    <ManagerLayout
      headerShown={true}
      headerTitle="장례식장 검색"
      color="white"
      homeButton={true}
      logoutButton={false}>
      <View style={styles.wrapper}>
        <FlatList
          data={funeralList}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.flatListContainer}
          style={styles.flatList}
          ListHeaderComponent={
            <View style={styles.searchContainer}>
              <View style={styles.searchBarContainer}>
                <Input input={hallName} placeholder="장례식장을 검색하세요." />
                <CustomButton
                  style={styles.searchButton}
                  onPress={searchFunerals}>
                  <Typo style={styles.searchButtonText}>검색</Typo>
                </CustomButton>
              </View>
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
            </View>
          }
          renderItem={({item}) => (
            <FuneralCard
              item={item}
              selected={
                !!selectedItems.find(selected => selected.id === item.id)
              }
              onPressCheck={() => handleSelect(item)}
              onPressCard={() => {
                console.log('상세 페이지 이동: ', item.name);
              }}
            />
          )}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.loadingContainer}>
                <Typo>검색 중...</Typo>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Typo>검색 결과가 없습니다.</Typo>
              </View>
            )
          }
        />

        {/* 하단 고정 버튼 */}
        <View style={styles.fixedButtonContainer}>
          {variant === 'main' && isLogin.isLogin && (
            <CustomButton onPress={handleAddToCart} style={styles.button}>
              <View style={styles.buttonIcon}>
                <CartIcon width={24} height={24} />
                <Typo style={styles.buttonText}>장바구니 담기</Typo>
              </View>
              <MoveIcon width={24} height={24} />
            </CustomButton>
          )}
          {variant === 'signup' && (
            <CustomButton onPress={selectFuneral} style={styles.button}>
              <View style={styles.buttonIcon}>
                <Typo style={styles.buttonText}>선택</Typo>
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
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
    marginBottom: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  searchButton: {
    backgroundColor: '#283042',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
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
  flatList: {
    flex: 1,
  },
  flatListContainer: {
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  fixedButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#dedede',
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
});
