import {StyleSheet, TouchableOpacity, View} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import Typo from '../../components/common/Typo';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import ManagerLayout from '../../layout/ManagerLayout';
import CommaIcon from '../../assets/Contents/Content_Comma.svg';
import CustomButton from '../../components/common/CustomButton';
import DispatchIcon from '../../assets/Button/Button_Dispatch.svg';
import MoveIcon from '../../assets/Button/Button_MoveTransparent.svg';

const EstimateDetailPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const goToCallFormPage = () => {
    navigation.navigate('CallForm');
  };

  const fetchQuoteDetail = async () => {
    console.log('Fetching quote detail...');
  };

  return (
    <ManagerLayout
      headerShown={true}
      headerTitle="입찰 상세"
      homeButton={true}
      homeRouteName="ManagerMain"
      logoutButton={false}>
      <View style={styles.wrapper}>
        <View style={styles.titleContainer}>
          <Typo style={styles.title}>서울대학교병원 장례식장 입찰상세</Typo>
        </View>

        <View style={styles.listContainer}>
          <View style={styles.listItem}>
            <View style={styles.labelContainer}>
              <CommaIcon width={6} height={6} />
              <Typo style={styles.label}>호실</Typo>
            </View>
            <Typo style={styles.value}>1호실</Typo>
          </View>
          <View style={styles.listItem}>
            <View style={styles.labelContainer}>
              <CommaIcon width={6} height={6} />
              <Typo style={styles.label}>평수</Typo>
            </View>
            <Typo style={styles.value}>70평</Typo>
          </View>
          <View style={styles.listItem}>
            <View style={styles.labelContainer}>
              <CommaIcon width={6} height={6} />
              <Typo style={styles.label}>수용인원</Typo>
            </View>
            <Typo style={styles.value}>100명</Typo>
          </View>
          <View style={styles.listItem}>
            <View style={styles.labelContainer}>
              <CommaIcon width={6} height={6} />
              <Typo style={styles.label}>식장지불금액</Typo>
            </View>
            <Typo style={styles.value}>100만원</Typo>
          </View>
          <View style={styles.listItem}>
            <View style={styles.labelContainer}>
              <CommaIcon width={6} height={6} />
              <Typo style={styles.label}>호실사용료</Typo>
            </View>
            <Typo style={styles.value}>50만원</Typo>
          </View>
          <View style={styles.listItem}>
            <View style={styles.labelContainer}>
              <CommaIcon width={6} height={6} />
              <Typo style={styles.label}>제안가</Typo>
            </View>
            <Typo style={styles.value}>120만원</Typo>
          </View>
          <View style={styles.listLastItem}>
            <View style={styles.labelContainer}>
              <CommaIcon width={6} height={6} />
              <Typo style={styles.label}>할인율</Typo>
            </View>
            <Typo style={styles.discountValue}>20%</Typo>
          </View>
        </View>
      </View>
      {/* 하단 버튼 */}
      <View style={styles.bottomContainer}>
        <CustomButton onPress={goToCallFormPage} style={styles.button}>
          <View style={styles.buttonIcon}>
            <DispatchIcon width={24} height={24} />
            <Typo fontSize={14} color="white">
              견적요청
            </Typo>
          </View>
          <MoveIcon width={24} height={24} />
        </CustomButton>
      </View>
    </ManagerLayout>
  );
};

export default EstimateDetailPage;

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
  listLastItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 22,
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
  discountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D81F1',
    fontFamily: 'Pretendard-Bold',
  },
  bottomContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#2D81F1',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    // marginLeft: 16,
  },
});
