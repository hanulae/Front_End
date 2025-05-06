import {StyleSheet, TouchableOpacity, View} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import Typo from '../../components/common/Typo';
import {NavigationProp, useNavigation} from '@react-navigation/native';

const EstimateDetailPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const goToCallFormPage = () => {
    navigation.navigate('CallForm');
  };
  return (
    <DefaultLayout
      headerShown={true}
      headerTitle="입찰 상세"
      homeButton={true}
      homeRouteName="ManagerMain"
      logoutButton={false}>
      <View style={styles.wrapper}>
        <Typo style={styles.title}>서울대학교병원 장례식장 입찰상세</Typo>

        <View style={styles.listContainer}>
          <View style={styles.listItem}>
            <Typo style={styles.label}>호실</Typo>
            <Typo style={styles.value}>1호실</Typo>
          </View>
          <View style={styles.listItem}>
            <Typo style={styles.label}>평수</Typo>
            <Typo style={styles.value}>70평</Typo>
          </View>
          <View style={styles.listItem}>
            <Typo style={styles.label}>수용인원</Typo>
            <Typo style={styles.value}>100명</Typo>
          </View>
          <View style={styles.listItem}>
            <Typo style={styles.label}>식장지불금액</Typo>
            <Typo style={styles.value}>100만원</Typo>
          </View>
          <View style={styles.listItem}>
            <Typo style={styles.label}>호실사용료</Typo>
            <Typo style={styles.value}>50만원</Typo>
          </View>
          <View style={styles.listItem}>
            <Typo style={styles.label}>제안가</Typo>
            <Typo style={styles.value}>120만원</Typo>
          </View>
          <View style={styles.listItem}>
            <Typo style={styles.label}>할인률</Typo>
            <Typo style={styles.discountValue}>20%</Typo>
          </View>
        </View>

        {/* 하단 버튼 */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={goToCallFormPage}>
          <Typo style={styles.submitButtonText}>출동신청</Typo>
        </TouchableOpacity>
      </View>
    </DefaultLayout>
  );
};

export default EstimateDetailPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 32,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  discountValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4F7CFF', // 파란색
  },
  submitButton: {
    marginTop: 'auto',
    backgroundColor: '#ccc',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
