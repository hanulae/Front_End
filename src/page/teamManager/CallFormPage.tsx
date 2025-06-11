import {NavigationProp, useNavigation} from '@react-navigation/native';
import DefaultLayout from '../../layout/DefaultLayout';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {usePhoneInput} from '../../hooks/input/usePhoneInput';
import Typo from '../../components/common/Typo';
import {Input} from '../../components/common/input/Input';
import ManagerLayout from '../../layout/ManagerLayout';

const CallFormPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const familyPhone = usePhoneInput();
  const teamLeaderPhone = usePhoneInput();
  const emergencyPhone = usePhoneInput();

  const handleAddressSearch = () => {
    console.log('주소 검색 페이지로 이동');
    // navigation.navigate('AddressSearchPage'); // 추후 연결
  };

  const handleNext = () => {
    // 이떄, 실제로는 서버로 출동 요청이 들어감.
    console.log('다음으로 이동');
    navigation.navigate('ProceedCall');
  };
  return (
    <ManagerLayout
      headerShown={true}
      headerTitle="출동 신청서"
      color="white"
      homeButton={true}
      homeRouteName="ManagerMain"
      logoutButton={false}>
      {/* 출동 신청서 내용 */}
      <View style={styles.wrapper}>
        {/* 주소 입력 */}
        <View style={styles.section}>
          <Typo fontSize={16} style={styles.label}>
            주소 입력
          </Typo>
          <View style={styles.container}>
            <View style={styles.addressRow}>
              <View style={styles.addressBox}>
                <Typo style={styles.addressText}>하늘시 하늘구 하늘동</Typo>
              </View>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleAddressSearch}>
                <Typo style={styles.searchButtonText}>주소검색</Typo>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.addressDetail}>
            <Typo style={styles.addressText}>상세주소</Typo>
          </View>
        </View>

        {/* 연락처 입력 */}
        <View style={styles.bottomSection}>
          <Typo style={styles.label}>가족 연락처</Typo>
          <Input input={familyPhone} placeholder="가족 연락처를 입력하세요" />

          <Typo style={styles.label}>팀장 연락처</Typo>
          <Input
            input={teamLeaderPhone}
            placeholder="팀장 연락처를 입력하세요"
          />

          <Typo style={styles.label}>비상 연락처</Typo>
          <Input
            input={emergencyPhone}
            placeholder="비상 연락처를 입력하세요"
          />
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Typo style={styles.nextButtonText}>다음</Typo>
          </TouchableOpacity>
        </View>
      </View>
    </ManagerLayout>
  );
};

export default CallFormPage;

const styles = StyleSheet.create({
  wrapper: {
    // flexGrow: 1,
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  section: {
    flexDirection: 'column',
    gap: 8,
  },
  bottomSection: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 24,
  },
  container: {
    // flex: 1,
    flexDirection: 'column',
    // alignSelf: 'stretch',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard-Bold',
    marginLeft: 10,
    marginBottom: 16,
    marginTop: 16,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressBox: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#F5F6F8',
    borderRadius: 8,
    justifyContent: 'center',
  },
  addressText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(175, 179, 187, 0.5)',
    fontFamily: 'Pretendard-Black',
  },
  addressDetail: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#F5F6F8',
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: 24,
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: '#8990A0',
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  searchButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Pretendard-Black',
  },
  nextButton: {
    marginTop: 40,
    backgroundColor: '#2D81F1',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },

  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
