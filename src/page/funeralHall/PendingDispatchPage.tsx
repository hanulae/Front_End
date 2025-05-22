import {Platform, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useCallback} from 'react';
import PendingDispatchCard from '../../components/funeralHall/PendingDispatchCard';

const DummyData = [
  {
    id: 1,
    name: '김철수',
    status: '출동요청',
  },
  {
    id: 2,
    name: '김영희',
    status: '출동중',
  },
];

const PendingDispatchPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
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

  // handle navigation to Dispatch Detail
  const goToDispatchDetail = (id: number, status: string) => {
    if (status === '출동요청') {
      navigation.navigate('DispatchRequestDetail');
    } else if (status === '출동중') {
      console.log('Dispatching');
    }
  };

  return (
    <FuneralLayout
      top={true}
      headerShown={true}
      headerTitle="출동 대기 내역"
      backButtonVisible={true}
      homeButton={true}
      homeRouteName="FuneralMain"
      color="white">
      <ScrollView
        contentContainerStyle={styles.scrollView}
        style={styles.wrapper}>
        {DummyData.map((item, index) => (
          <PendingDispatchCard
            key={index}
            name={item.name}
            index={index}
            status={item.status}
            onPress={() => {
              goToDispatchDetail(item.id, item.status);
            }}
          />
        ))}
      </ScrollView>
    </FuneralLayout>
  );
};

export default PendingDispatchPage;

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  wrapper: {
    backgroundColor: '#F5F6F8',
    padding: 20,
  },
});
