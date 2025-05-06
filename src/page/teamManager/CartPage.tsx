import {FlatList, StyleSheet, View} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
// import {funeralHomeDummyData} from '../../state/local_state/dummy';
import FuneralCard from '../../components/common/FuneralCard';
import {useCallback, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationProp, useFocusEffect} from '@react-navigation/native';
import CustomButton from '../../components/common/CustomButton';
import Typo from '../../components/common/Typo';

interface ICartPageProps {
  navigation: NavigationProp<any>;
}

const CartPage = ({navigation}: ICartPageProps) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const requestEstimate = () => {
    navigation.navigate('EstimateForm', {
      funeralHallId: selectedId,
    });
  };
  useFocusEffect(
    useCallback(() => {
      const loadCartItems = async () => {
        try {
          const stored = await AsyncStorage.getItem('funeralCart');
          if (stored) {
            const parsed = JSON.parse(stored);
            setCartItems(parsed);
          }
        } catch (error) {
          console.error('장바구니 불러오기 실패', error);
        }
      };

      loadCartItems();
    }, []),
  );

  const handleSelect = (id: number) => {
    setSelectedId(prevSelected => {
      if (prevSelected === id) {
        // 이미 선택되어 있으면 해제
        return null;
      } else {
        // 선택 안되어 있으면 추가
        return id;
      }
    });
  };

  const handleDelete = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    AsyncStorage.setItem(
      'funeralCart',
      JSON.stringify(cartItems.filter(item => item.id !== id)),
    );
  };

  return (
    <DefaultLayout
      headerShown={false}
      headerTitle="장례식장"
      homeButton={true}
      logoutButton={false}
      // homeRouteName="Main"
    >
      <View style={styles.wrapper}>
        <View style={styles.cartContainer}>
          <FlatList
            data={cartItems}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <FuneralCard
                item={item}
                selected={selectedId === item.id}
                onPressCheck={() => handleSelect(item.id)}
                onPressCard={() => {
                  console.log('상세 페이지 이동: ', item.name);
                }}
                onPressDelete={() => handleDelete(item.id)} // 삭제 버튼 클릭 시
              />
            )}
          />
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton onPress={requestEstimate} style={styles.button}>
            <Typo fontSize={14} color="white">
              견적요청
            </Typo>
          </CustomButton>
        </View>
      </View>
    </DefaultLayout>
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
    // flex: 9,
    flexDirection: 'column',
  },
  specLocation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 18,
    marginTop: 16,
  },
  specLocationText: {
    fontWeight: '700',
    color: '#000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#5b86ea',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
});
