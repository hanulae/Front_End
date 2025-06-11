import {StyleSheet, View} from 'react-native';
import ManagerLayout from '../../layout/ManagerLayout';
import Typo from '../../components/common/Typo';
import CommaIcon from '../../assets/Contents/Content_Comma.svg';
import {useRoute} from '@react-navigation/native';
import {useEffect, useState} from 'react';

const ClientDetailPage = () => {
  const route = useRoute();
  const {clientId} = route.params as {clientId: number};

  const [clientDetail, setClientDetail] = useState(null);

  useEffect(() => {
    const fetchClientDetail = async () => {};
  }, []);
  return (
    <ManagerLayout
      headerShown={true}
      headerTitle="견적 상세"
      homeButton={true}
      homeRouteName="ManagerMain"
      logoutButton={false}>
      <View style={styles.wrapper}>
        <View style={styles.titleContainer}>
          <Typo style={styles.title}>견적 상세</Typo>
        </View>

        <View style={styles.listContainer}>
          <View style={styles.listItem}>
            <View style={styles.labelContainer}>
              <CommaIcon width={6} height={6} />
              <Typo style={styles.label}>상주이름</Typo>
            </View>
            <Typo style={styles.value}>김철수</Typo>
          </View>
          <View style={styles.listItem}>
            <View style={styles.labelContainer}>
              <CommaIcon width={6} height={6} />
              <Typo style={styles.label}>조문객수</Typo>
            </View>
            <Typo style={styles.value}>150명</Typo>
          </View>
          <View style={styles.listItem}>
            <View style={styles.labelContainer}>
              <CommaIcon width={6} height={6} />
              <Typo style={styles.label}>입실일자</Typo>
            </View>
            <Typo style={styles.value}>2025.05.20</Typo>
          </View>
          <View style={styles.listItem}>
            <View style={styles.labelContainer}>
              <CommaIcon width={6} height={6} />
              <Typo style={styles.label}>퇴실일자</Typo>
            </View>
            <Typo style={styles.value}>2025.05.22</Typo>
          </View>
        </View>
      </View>
    </ManagerLayout>
  );
};

export default ClientDetailPage;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#F5F5F5', // 상단 회색 배경
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  titleContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 26,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    // marginBottom: 20,
    textAlign: 'center',
    color: '#283042',
    fontFamily: 'Pretendard-Bold',
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    // marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 22,
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#283042',
    fontWeight: '500',
    fontFamily: 'Pretendard-Regular',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#283042',
    fontFamily: 'Pretendard-Bold',
  },
});
