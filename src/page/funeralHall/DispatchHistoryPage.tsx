import {Platform, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import DispatchCard from '../../components/funeralHall/DispatchCard';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';

const DispatchHistoryPage = () => {
  // StatusBar 설정
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#3287F8');
        StatusBar.setBarStyle('dark-content');
      } else {
        StatusBar.setBarStyle('dark-content');
      }
      return () => {
        // 화면 포커스 해제 시 필요하다면 초기화 작업
        // 예: StatusBar.setStyle('default')
      };
    }, []),
  );

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const goToDispatchDetail = (name: string) => {
    // console.log('Dispatch Detail');
    navigation.navigate('DispatchDetail', {
      name: name,
    });
  };
  return (
    <FuneralLayout
      headerTitle="지난 출동 내역"
      backButtonVisible={true}
      homeButton={true}
      color="#FFFFFF"
      homeRouteName="FuneralMain"
      top={true}
      headerShown={true}>
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {[
            {
              name: '김철수',
              date: '2025.04.01',
            },
            {
              name: '김영희',
              date: '2025.04.01',
            },
            {
              name: '홍길동',
              date: '2025.04.01',
            },
          ].map((item, index) => (
            <DispatchCard
              key={index}
              name={item.name}
              date={item.date}
              index={index}
              onPress={() => goToDispatchDetail(item.name)}
            />
          ))}
        </ScrollView>
      </View>
    </FuneralLayout>
  );
};

export default DispatchHistoryPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F6F8',
    paddingHorizontal: 10,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
});
