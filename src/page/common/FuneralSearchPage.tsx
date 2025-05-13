import {
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {useInputBase} from '../../hooks/input/useInputBase';
import {Input} from '../../components/common/input/Input';
import Typo from '../../components/common/Typo';
import {funeralHomeDummyData} from '../../state/local_state/dummy';
import {useEffect, useState} from 'react';
import FuneralCard from '../../components/common/FuneralCard';
import CustomButton from '../../components/common/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
import ManagerLayout from '../../layout/ManagerLayout';
import MoveIcon from '../../assets/Button/Button_MoveTransparent.svg';
import CartIcon from '../../assets/Button/Button_Cart.svg';

const {height} = Dimensions.get('window');
const FuneralSearchPage = () => {
  const [location, setLocation] = useState<string>('');

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
  console.log('variant', variant);
  const hallName = useInputBase();
  // const [selectedIds, setSelectedIds] = useState<number[]>([]); // 수정: 배열로 관리
  const [selectedItems, setSelectedItems] = useState<
    typeof funeralHomeDummyData
  >([]);

  const handleSelect = (item: (typeof funeralHomeDummyData)[number]) => {
    setSelectedItems(prevSelected => {
      const exists = prevSelected.find(selected => selected.id === item.id);
      if (exists) {
        // 이미 선택되어 있으면 제거
        return prevSelected.filter(selected => selected.id !== item.id);
      } else {
        // 없으면 추가
        return [...prevSelected, item];
      }
    });
  };

  const handleAddToCart = async () => {
    try {
      await AsyncStorage.setItem('funeralCart', JSON.stringify(selectedItems));
      console.log('장바구니 저장 완료', selectedItems);
    } catch (error) {
      console.error('장바구니 저장 실패', error);
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
        <View style={styles.searchContainer}>
          <Input input={hallName} placeholder="검색" />
          <View style={styles.locationContainer}>
            <TextInput editable={false} value={location} style={styles.input} />
            <CustomButton
              onPress={() => console.log('위치 선택')}
              style={styles.locationButton}>
              <Typo style={styles.locationButtonText}>위치 선택</Typo>
            </CustomButton>

            {/* <Typo fontSize={14} style={styles.specLocationText}>
              시 / 도
            </Typo>
            <Typo fontSize={14} style={styles.specLocationText}>
              군 / 구
            </Typo> */}
          </View>
        </View>
        <View style={styles.listContainer}>
          <FlatList
            data={funeralHomeDummyData}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <FuneralCard
                item={item}
                selected={
                  !!selectedItems.find(selected => selected.id === item.id)
                }
                onPressCheck={() => handleSelect(item)}
                onPressCard={() => {
                  console.log('상세 페이지 이동: ', item.name);
                  // TODO: navigation.navigate('FuneralDetailPage', { id: item.id })
                }}
              />
            )}
          />
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton onPress={handleAddToCart} style={styles.button}>
            <View style={styles.buttonIcon}>
              <CartIcon width={24} height={24} />
              <Typo style={styles.buttonText}>장바구니 담기</Typo>
            </View>
            <MoveIcon width={24} height={24} />
          </CustomButton>
        </View>
      </View>
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
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
    marginBottom: 16,
    gap: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  input: {
    flex: 8,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 14,
    backgroundColor: '#dedede',
  },
  locationButton: {
    flex: 2,
    backgroundColor: '#2D81F1',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    // marginLeft: 16,
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
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
  listContainer: {
    // flex: 1,
    maxHeight: height * 0.54,
    // marginTop: 16,
    // marginBottom: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
  },
  buttonContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
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
    // marginLeft: 16,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Black',
  },
});
