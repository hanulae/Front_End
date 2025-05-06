import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import Typo from '../../components/common/Typo';
import {NavigationProp, useNavigation} from '@react-navigation/native';

const EstimateListPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
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
          {name: '김철수 고객님', date: '2025.04.01', count: 14},
          {name: '김영희 고객님', date: '2025.04.01', count: 8},
          {name: '홍길동 고객님', date: '2025.04.01', count: 7},
          {name: '금잔디 고객님', date: '2025.04.01', count: 18},
          {name: '김철수 고객님', date: '2025.04.01', count: 2},
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={goToClientEstimate}>
            <Typo>{item.name}</Typo>

            <View style={styles.bottomRow}>
              <View style={styles.leftInfo}>
                <View style={styles.tag}>
                  <Typo style={styles.tagText}>견적요청</Typo>
                </View>
                <Typo style={styles.dateText}>{item.date}</Typo>
              </View>

              <Typo style={styles.countText}>{item.count}건</Typo>
            </View>
          </TouchableOpacity>
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
