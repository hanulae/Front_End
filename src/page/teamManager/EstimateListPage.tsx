import {Platform, ScrollView, StatusBar, StyleSheet} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import EstimateCard from '../../components/manager/EstimateCard';
import {useCallback} from 'react';

const EstimateListPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();

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

  const goToClientEstimate = () => {
    navigation.navigate('ClientEstimate', {clientId: 1});
  };
  return (
    <DefaultLayout
      headerShown={true}
      headerTitle="견적내역"
      homeButton={true}
      homeRouteName="ManagerMain"
      logoutButton={false}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        {[
          {name: '김철수', date: '2025.04.01', count: 14},
          {name: '김영희', date: '2025.04.01', count: 8},
          {name: '홍길동', date: '2025.04.01', count: 7},
          {name: '금잔디', date: '2025.04.01', count: 18},
          {name: '김철수', date: '2025.04.01', count: 2},
        ].map((item, index) => (
          <EstimateCard
            key={index}
            name={item.name}
            date={item.date}
            count={item.count}
            index={index}
            onPress={goToClientEstimate}
          />
        ))}
      </ScrollView>
    </DefaultLayout>
  );
};

export default EstimateListPage;

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tag: {
    backgroundColor: '#eee',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F7CFF',
  },
});
