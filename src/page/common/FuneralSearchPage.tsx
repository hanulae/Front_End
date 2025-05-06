import {FlatList, StyleSheet, View} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import {useInputBase} from '../../hooks/input/useInputBase';
import {Input} from '../../components/common/input/Input';
import Typo from '../../components/common/Typo';
import {funeralHomeDummyData} from '../../state/local_state/dummy';
import {useState} from 'react';
import FuneralCard from '../../components/common/FuneralCard';
import CustomButton from '../../components/common/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface IFuneralSearchPageProps {
  variant: 'main' | 'signup';
}

const FuneralSearchPage = () => {
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
    <DefaultLayout
      headerShown={true}
      headerTitle="장례식장 검색"
      homeButton={false}
      logoutButton={false}>
      <View style={styles.wrapper}>
        <View style={styles.searchContainer}>
          <Input input={hallName} placeholder="검색" />
          <View style={styles.specLocation}>
            <Typo fontSize={14} style={styles.specLocationText}>
              시 / 도
            </Typo>
            <Typo fontSize={14} style={styles.specLocationText}>
              군 / 구
            </Typo>
          </View>
        </View>
        <View>
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
          <CustomButton style={styles.button} onPress={handleAddToCart}>
            <Typo fontSize={14} color="white">
              장바구니 담기
            </Typo>
          </CustomButton>
        </View>
      </View>
    </DefaultLayout>
  );
};

export default FuneralSearchPage;

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
  },
  searchContainer: {
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
