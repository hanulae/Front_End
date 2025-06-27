import {FlatList, Platform, StatusBar, StyleSheet, View, Animated, Easing} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
// import {funeralHomeDummyData} from '../../state/local_state/dummy';
import FuneralCard from '../../components/common/FuneralCard';
import {useCallback, useEffect, useState, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationProp, useFocusEffect} from '@react-navigation/native';
import CustomButton from '../../components/common/CustomButton';
import Typo from '../../components/common/Typo';
import ManagerLayout from '../../layout/ManagerLayout';
import RequestIcon from '../../assets/Button/Button_RequestQuote.svg';
import MoveIcon from '../../assets/Button/Button_MoveTransparent.svg';
import {useManagerCart} from '../../hooks/useManagerCart';
import Toast from 'react-native-toast-message';

interface ICartPageProps {
  navigation: NavigationProp<any>;
}

// ✅ 장바구니 아이템 타입 정의
interface CartItem {
  managerCartId: string;
  managerId: string;
  funeralListId: string;
  createdAt: string;
  updatedAt: string;
  funeralList: {
    funeralListId: string;
    funeralId: string | null;
    funeralName: string;
    funeralAddress: string;
    funeralRegion: string;
    funeralCity: string;
    funeralScale: string;
    funeralTotalRooms: number;
    funeralOperationType: string;
    funeralStyle: string;
    funeralParkingLot: boolean;
    funeralStore: boolean;
    funeralFamilyWaitingRoom: boolean;
    funeralDisabledFacility: boolean;
    funeralIsJoin: boolean;
    funeralSearchKeywords: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
}

const CartPage = ({navigation}: ICartPageProps) => {
  // ✅ 단일 선택 → 다중 선택으로 변경
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // 배열로 변경
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // ✅ 각 아이템별 애니메이션 값을 개별적으로 관리
  const animatedValues = useRef<{[key: string]: Animated.Value}>({}).current;

  const {
    getCartList,
    deleteFromCart,
    loading: cartLoading,
    error: cartError,
  } = useManagerCart();

  // ✅ 장바구니 데이터 불러오기 함수 - AsyncStorage 기반으로 수정
  const fetchCartList = useCallback(async () => {
    try {
      const result = await getCartList();
      console.log('🛒 장바구니 조회 결과:', result);
      
      if (result && Array.isArray(result)) {
        // ✅ 로컬 서비스는 직접 배열을 반환하므로 서버 구조로 변환
        const cartData = result.map((item) => ({
          managerCartId: item.funeralListId, // funeralListId를 ID로 사용
          managerId: 'local', // 로컬 저장이므로 고정값
          funeralListId: item.funeralListId,
          createdAt: item.addedAt,
          updatedAt: item.addedAt,
          funeralList: {
            funeralListId: item.funeralListId,
            funeralId: item.funeralId,
            funeralName: item.funeralName,
            funeralAddress: item.funeralAddress,
            funeralRegion: '',
            funeralCity: '',
            funeralScale: '',
            funeralTotalRooms: 0,
            funeralOperationType: '',
            funeralStyle: '',
            funeralParkingLot: false,
            funeralStore: false,
            funeralFamilyWaitingRoom: false,
            funeralDisabledFacility: false,
            funeralIsJoin: false,
            funeralSearchKeywords: '',
            createdAt: item.addedAt,
            updatedAt: item.addedAt,
            deletedAt: null,
          }
        }));
        
        console.log('🛒 변환된 장바구니 데이터:', cartData);
        setCartItems(cartData);
        
        // ✅ 새로운 아이템들에 대한 애니메이션 값 초기화
        cartData.forEach((item) => {
          if (!animatedValues[item.funeralListId]) {
            animatedValues[item.funeralListId] = new Animated.Value(0);
          }
        });
      } else {
        console.error('장바구니 불러오기 실패: 잘못된 데이터 형식');
        setCartItems([]);
      }
    } catch (error) {
      console.error('장바구니 불러오기 실패', error);
      setCartItems([]);
    }
  }, [getCartList, animatedValues]);

  useEffect(() => {
    fetchCartList();
  }, [fetchCartList]);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#3287F8');
        StatusBar.setBarStyle('dark-content');
      } else {
        StatusBar.setBarStyle('dark-content');
      }

      // ✅ 페이지 포커스 시 장바구니 새로고침
      fetchCartList();

      return () => {
        // 화면 포커스 해제 시 필요하다면 초기화 작업
      };
    }, [fetchCartList]),
  );

  // ✅ 다중 선택 핸들러 - funeralListId 기준으로 변경
  const handleSelect = (funeralListId: string) => {
    console.log('🔍 선택된 funeralListId:', funeralListId);
    setSelectedIds(prevSelected => {
      const exists = prevSelected.includes(funeralListId);
      console.log('🔍 선택된 ID 존재 여부:', exists);
      if (exists) {
        // ✅ 이미 선택되어 있으면 제거
        return prevSelected.filter(selectedId => selectedId !== funeralListId);
      } else {
        // ✅ 선택되어 있지 않으면 추가
        return [...prevSelected, funeralListId];
      }
    });
  };

  const handleDelete = async (funeralListId: string) => {
    if (!animatedValues[funeralListId]) {
      animatedValues[funeralListId] = new Animated.Value(0);
    }

    Animated.timing(animatedValues[funeralListId], {
      toValue: -400,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(async () => {
      try {
        const result = await deleteFromCart([funeralListId]);
        
        if (result) {
          setCartItems(prevItems => 
            prevItems.filter(item => item.funeralListId !== funeralListId)
          );
          
          // ✅ 삭제된 아이템이 선택되어 있었다면 선택에서 제거
          setSelectedIds(prevSelected => 
            prevSelected.filter(id => id !== funeralListId)
          );
          
          delete animatedValues[funeralListId];
          
          Toast.show({
            type: 'success',
            text1: '장바구니에서 삭제되었습니다.',
            position: 'top',
            topOffset: -150,
          });
        }
      } catch (error) {
        console.error('장바구니 삭제 실패', error);
        
        Animated.timing(animatedValues[funeralListId], {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
        
        Toast.show({
          type: 'error',
          text1: '삭제에 실패했습니다.',
          position: 'top',
          topOffset: 100,
        });
      }
    });
  };

  // ✅ 견적요청 함수 - funeralListId 기준으로 변경
  const requestEstimate = () => {
    if (selectedIds.length === 0) {
      Toast.show({
        type: 'info',
        text1: '견적요청할 장례식장을 선택해주세요.',
        position: 'top',
        topOffset: -150,
      });
      return;
    }

    // ✅ 선택된 장례식장들의 정보 수집 - funeralListId 기준
    const selectedFunerals = cartItems.filter(item => 
      selectedIds.includes(item.funeralListId)
    );

    console.log('selectedFunerals', selectedFunerals);

    navigation.navigate('EstimateForm', {
      selectedFunerals: selectedFunerals, // 다중 선택된 장례식장들 전달
      funeralHallIds: selectedIds, // ID 배열도 함께 전달
    });
  };

  // ✅ 전체 선택/해제 함수 - funeralListId 기준으로 변경
  const handleSelectAll = () => {
    if (selectedIds.length === cartItems.length) {
      // 전체 선택되어 있으면 전체 해제
      setSelectedIds([]);
    } else {
      // 전체 선택 - funeralListId 기준
      setSelectedIds(cartItems.map(item => item.funeralListId));
    }
  };

  return (
    <ManagerLayout
      headerShown={true}
      headerTitle="장바구니"
      color="white"
      homeButton={true}
      logoutButton={false}
    >
      <View style={styles.wrapper}>
        {/* ✅ 전체 선택/해제 버튼 (선택사항) */}
        {(
          <View style={styles.selectAllContainer}>
            <CustomButton 
              onPress={handleSelectAll}
              style={[styles.selectAllButton, cartItems.length === 0 && {borderColor: '#727272'}]}
            >
              <Typo style={[styles.selectAllText, cartItems.length === 0 && {color: '#727272'}]}>
                {selectedIds.length === cartItems.length ? '전체 해제' : '전체 선택'}
                ({selectedIds.length}/{cartItems.length})
              </Typo>
            </CustomButton>
          </View>
        )}

        <View style={styles.cartContainer}>
          {cartLoading ? (
            <View style={styles.loadingContainer}>
              <Typo>장바구니를 불러오는 중...</Typo>
            </View>
          ) : (
            <FlatList
              data={cartItems}
              keyExtractor={item => item.funeralListId}
              renderItem={({item}) => {
                const slideValue = animatedValues[item.funeralListId] || new Animated.Value(0);
                
                return (
                  <Animated.View 
                    style={{
                      transform: [{ translateX: slideValue }],
                      opacity: slideValue.interpolate({
                        inputRange: [-400, 0],
                        outputRange: [0, 1],
                        extrapolate: 'clamp',
                      }),
                    }}
                  >
                    <FuneralCard
                      item={{
                        funeralListId: item.funeralList.funeralListId,
                        funeralId: item.funeralList.funeralId,
                        funeralName: item.funeralList.funeralName,
                        funeralAddress: item.funeralList.funeralAddress,
                        imageUrl: undefined,
                      }}
                      // ✅ funeralListId 기준으로 선택 확인
                      selected={selectedIds.includes(item.funeralListId)}
                      onPressCheck={() => handleSelect(item.funeralListId)}
                      onPressCard={() => {
                        console.log('상세 페이지 이동: ', item.funeralList.funeralName);
                        navigation.navigate('FuneralDetail', {
                          funeralListId: item.funeralList.funeralListId,
                          funeralId: item.funeralList.funeralId,
                        });
                      }}
                      onPressDelete={() => handleDelete(item.funeralListId)}
                    />
                  </Animated.View>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Typo style={styles.emptyText}>장바구니가 비어있습니다.</Typo>
                </View>
              }
            />
          )}
        </View>
        
        <View style={styles.buttonContainer}>
          <CustomButton 
            onPress={requestEstimate} 
            style={[
              styles.button,
              selectedIds.length === 0 && styles.buttonDisabled
            ]}
            disabled={selectedIds.length === 0}
          >
            <View style={styles.buttonIcon}>
              <RequestIcon width={24} height={24} />
              <Typo style={[
                styles.buttonText,
                selectedIds.length === 0 && styles.buttonTextDisabled
              ]}>
                {/* ✅ 선택된 개수 표시 */}
                견적요청 {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
              </Typo>
            </View>
            <MoveIcon width={24} height={24} />
          </CustomButton>
        </View>
      </View>
      <Toast />
    </ManagerLayout>
  );
};

export default CartPage;

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    justifyContent: 'space-between',
    flex: 1,
  },
  cartContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingHorizontal: 16,
    paddingTop: 8,
    borderTopWidth: 0.5,
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
  buttonDisabled: {
    backgroundColor: '#E0E0E0',
    opacity: 0.8,
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
  buttonTextDisabled: {
    color: '#999999',
  },
  selectAllContainer: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dedede',
    // marginBottom: 8,
  },
  selectAllButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2D81F1',
    borderRadius: 6,
  },
  selectAllText: {
    color: '#2D81F1',
    fontSize: 14,
    fontWeight: '500',
  },
});
