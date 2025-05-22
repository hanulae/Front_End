import {Platform, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import QuoteCard from '../../components/funeralHall/QuoteCard';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export interface IEstimate {
  id: number;
  name: string;
  date: string;
  status: string;
  requestedAt: string;
  sentAt: string;
}

const DummyData: IEstimate[] = [
  {
    id: 1,
    name: '김철수',
    date: '2025.04.01',
    status: '대기중',
    requestedAt: '2025.04.01 10:00',
    sentAt: '2025.04.01 12:00',
  },
  {
    id: 2,
    name: '김영희',
    date: '2025.04.02',
    status: '완료',
    requestedAt: '2025.04.02 11:00',
    sentAt: '2025.04.02 13:00',
  },
  {
    id: 3,
    name: '홍길동',
    date: '2025.04.03',
    status: '대기중',
    requestedAt: '2025.04.03 09:00',
    sentAt: '2025.04.03 11:00',
  },
];

const EstimateHistoryPage = () => {
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

  // handle Quote Card Press
  const handleQuoteCardPress = (id: number, status: string) => {
    navigation.navigate('QuoteProposal', {
      id: id,
      status: status,
    });
  };

  return (
    <FuneralLayout
      top={true}
      headerShown={true}
      headerTitle="견적 내역"
      color="#FFFFFF"
      backButtonVisible={true}
      homeButton={true}
      homeRouteName="FuneralMain">
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {DummyData.map((item, index) => (
            <QuoteCard
              key={index}
              name={item.name}
              date={item.date}
              status={item.status}
              requestedAt={item.requestedAt}
              sentAt={item.sentAt}
              id={item.id}
              onPress={() => handleQuoteCardPress(item.id, item.status)}
            />
          ))}
        </ScrollView>
      </View>
    </FuneralLayout>
  );
};

export default EstimateHistoryPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F6F8',
    paddingHorizontal: 20,
  },
  scrollView: {
    flexGrow: 1,
    gap: 10,
    paddingTop: 20,
  },
});
