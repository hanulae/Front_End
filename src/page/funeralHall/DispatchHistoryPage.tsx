import {ScrollView, StyleSheet, View} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import DispatchCard from '../../components/funeralHall/DispatchCard';

const DispatchHistoryPage = () => {
  const goToDispatchDetail = () => {
    // console.log('Dispatch Detail');
    // navigation.navigate('DispatchDetail');
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
              onPress={goToDispatchDetail}
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
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
});
