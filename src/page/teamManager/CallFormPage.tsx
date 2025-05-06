import {NavigationProp, useNavigation} from '@react-navigation/native';
import DefaultLayout from '../../layout/DefaultLayout';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {usePhoneInput} from '../../hooks/input/usePhoneInput';
import Typo from '../../components/common/Typo';
import {Input} from '../../components/common/input/Input';

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
    <DefaultLayout
      headerShown={true}
      headerTitle="출동 신청서"
      homeButton={true}
      homeRouteName="ManagerMain"
      logoutButton={false}>
      {/* 출동 신청서 내용 */}
      <ScrollView style={styles.wrapper}>
        {/* 주소 입력 */}
        <View style={styles.section}>
          <Typo style={styles.label}>주소입력</Typo>

          <View style={styles.addressRow}>
            <View style={styles.addressBox}>
              <Typo>하늘시 하늘구 하늘동</Typo>
            </View>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleAddressSearch}>
              <Typo style={styles.searchButtonText}>주소검색</Typo>
            </TouchableOpacity>
          </View>

          <View style={styles.addressBox}>
            <Typo>상세주소</Typo>
          </View>
        </View>

        {/* 연락처 입력 */}
        <View style={styles.section}>
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

        {/* 다음 버튼 */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Typo style={styles.nextButtonText}>다음</Typo>
        </TouchableOpacity>
      </ScrollView>
    </DefaultLayout>
  );
};

export default CallFormPage;

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressBox: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: '#666',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  nextButton: {
    marginTop: 40,
    backgroundColor: '#4F7CFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
