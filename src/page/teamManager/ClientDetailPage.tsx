import {StyleSheet, View} from 'react-native';
import ManagerLayout from '../../layout/ManagerLayout';
import Typo from '../../components/common/Typo';
import CommaIcon from '../../assets/Contents/Content_Comma.svg';
import {useRoute} from '@react-navigation/native';
import { scaleFontSize, scaleSize, isSmallDevice } from '../../utils/responsive';

const ClientDetailPage = () => {
  const route = useRoute();
  const {data} = route.params as {data: any};

  const formatDate = (dateString: string) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}년 ${month}월 ${day}일`;
  };

  const isDataEmpty = (value: any) => {
    return (
      value === null ||
      value === undefined ||
      value === '' ||
      value === '' ||
      value === 0
    );
  };

  const getValueStyle = (value: any) => {
    return isDataEmpty(value) ? styles.emptyValue : styles.value;
  };

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
            <Typo style={styles.value}>{data.chiefMournerName}</Typo>
          </View>
          <View style={styles.listItem}>
            <View style={styles.labelContainer}>
              <CommaIcon width={6} height={6} />
              <Typo style={styles.label}>고인이름</Typo>
            </View>
            <Typo style={getValueStyle(data.deceasedName)}>
              {isDataEmpty(data.deceasedName)
                ? '작성하지 않음'
                : data.deceasedName}
            </Typo>
          </View>
          <View style={styles.listItem}>
            <View style={styles.labelContainer}>
              <CommaIcon width={6} height={6} />
              <Typo style={styles.label}>평수</Typo>
            </View>
            <Typo style={getValueStyle(data.roomSize)}>
              {isDataEmpty(data.roomSize)
                ? '작성하지 않음'
                : `${data.roomSize}평`}
            </Typo>
          </View>
          <View style={styles.listItem}>
            <View style={styles.labelContainer}>
              <CommaIcon width={6} height={6} />
              <Typo style={styles.label}>조문객수</Typo>
            </View>
            <Typo style={styles.value}>{data.numberOfMourners}명</Typo>
          </View>
          <View style={styles.listItem}>
            <View style={styles.labelContainer}>
              <CommaIcon width={6} height={6} />
              <Typo style={styles.label}>입실일자</Typo>
            </View>
            <Typo style={styles.value}>{formatDate(data.checkInDate)}</Typo>
          </View>
          <View style={styles.listItem}>
            <View style={styles.labelContainer}>
              <CommaIcon width={6} height={6} />
              <Typo style={styles.label}>퇴실일자</Typo>
            </View>
            <Typo style={styles.value}>{formatDate(data.checkOutDate)}</Typo>
          </View>
        </View>
      </View>
    </ManagerLayout>
  );
};

export default ClientDetailPage;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: scaleSize(16),
    paddingTop: scaleSize(24),
  },
  titleContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: scaleSize(12),
    borderTopRightRadius: scaleSize(12),
    paddingHorizontal: scaleSize(20),
    paddingVertical: scaleSize(26),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: scaleFontSize(isSmallDevice ? 16 : 18),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#283042',
    fontFamily: 'Pretendard-Bold',
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: scaleSize(12),
    borderBottomRightRadius: scaleSize(12),
    paddingHorizontal: scaleSize(20),
    paddingVertical: scaleSize(16),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: scaleSize(2)},
    shadowOpacity: 0.05,
    shadowRadius: scaleSize(4),
    elevation: 2,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: scaleSize(22),
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleSize(8),
  },
  label: {
    fontSize: scaleFontSize(14),
    color: '#283042',
    fontWeight: '500',
    fontFamily: 'Pretendard-Regular',
  },
  value: {
    fontSize: scaleFontSize(isSmallDevice ? 14 : 16),
    fontWeight: '600',
    color: '#283042',
    fontFamily: 'Pretendard-Bold',
  },
  emptyValue: {
    fontSize: scaleFontSize(isSmallDevice ? 14 : 16),
    fontWeight: '500',
    color: '#A7A9B0',
    fontFamily: 'Pretendard-Medium',
    opacity: 0.8,
  },
});
