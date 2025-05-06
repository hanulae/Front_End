import {StyleSheet, View} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import {useInputBase} from '../../hooks/input/useInputBase';
import {useState} from 'react';
import Typo from '../../components/common/Typo';
import {Input} from '../../components/common/input/Input';
import {useRoute} from '@react-navigation/native';
import DateWheelBottomSheet from '../../components/common/DateWheel';
import CustomButton from '../../components/common/CustomButton';

const EstimateFormPage = () => {
  const clientName = useInputBase();
  const visitorCount = useInputBase();
  const route = useRoute();
  const {funeralHallId} = route.params as {funeralHallId: number};
  console.log('funeralHallId', funeralHallId);
  const currentDate = new Date();

  const [admissionDate, setAdmissionDate] = useState<Date | null>(null); // 입실일자
  const [departureDate, setDepartureDate] = useState<Date | null>(null); // 퇴실일자

  const [showAdmissionPicker, setShowAdmissionPicker] = useState(false);
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);

  const formatSimpleDate = (date: Date) => {
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}.${String(date.getDate()).padStart(2, '0')}`;
  };

  // 입실일자 선택 완료
  const handleAdmissionConfirm = (date: Date) => {
    console.log('입실일자 선택됨:', formatSimpleDate(date));
    setAdmissionDate(date);

    // 퇴실일자 기본 2일 뒤로 자동 설정
    const newDeparture = new Date(date);
    newDeparture.setDate(newDeparture.getDate() + 2);
    setDepartureDate(newDeparture);
    setShowAdmissionPicker(false);
  };

  // 퇴실일자 선택 완료
  const handleDepartureConfirm = (date: Date) => {
    console.log('퇴실일자 선택됨:', formatSimpleDate(date));
    setDepartureDate(date);
    setShowDeparturePicker(false);
  };

  return (
    <DefaultLayout
      headerShown={true}
      headerTitle="견적 신청서"
      homeButton={true}
      homeRouteName="ManagerMain"
      logoutButton={false}>
      <View style={styles.wrapper}>
        <View style={styles.formContainer}>
          <View style={styles.form}>
            <View style={styles.field}>
              <Typo style={styles.label}>상주 이름</Typo>
              <Input input={clientName} placeholder="상주 이름을 입력하세요" />
            </View>
            <View style={styles.field}>
              <Typo style={styles.label}>조문객 수</Typo>
              <Input
                input={visitorCount}
                placeholder="예상 조문객 수를 입력하세요"
              />
            </View>
            <View style={styles.dateField}>
              <View style={styles.field}>
                <Typo style={styles.label}>입실 일자</Typo>
                <CustomButton
                  // title={admissionDate ? admissionDate.toDateString() : '입실일자 선택'}
                  onPress={() => setShowAdmissionPicker(true)}>
                  <Typo>
                    {admissionDate
                      ? formatSimpleDate(admissionDate)
                      : '입실일자 선택'}
                  </Typo>
                </CustomButton>
              </View>

              <View style={styles.field}>
                <Typo style={styles.label}>퇴실 일자</Typo>
                <CustomButton
                  // title={departureDate ? departureDate.toDateString() : '퇴실일자 선택'}
                  onPress={() => setShowDeparturePicker(true)}>
                  <Typo>
                    {departureDate
                      ? formatSimpleDate(departureDate)
                      : '퇴실일자 선택'}
                  </Typo>
                </CustomButton>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton
            onPress={() => console.log('견적 신청서 제출')}
            style={styles.button}>
            <Typo fontSize={14} color="white">
              견적서 발송
            </Typo>
          </CustomButton>
        </View>
        {/* 입실일자 선택용 바텀시트 */}
        <DateWheelBottomSheet
          visible={showAdmissionPicker}
          initialDate={currentDate}
          onConfirm={handleAdmissionConfirm}
          onClose={() => setShowAdmissionPicker(false)}
        />

        {/* 퇴실일자 선택용 바텀시트 */}
        <DateWheelBottomSheet
          visible={showDeparturePicker}
          initialDate={currentDate}
          onConfirm={handleDepartureConfirm}
          onClose={() => setShowDeparturePicker(false)}
        />
      </View>
    </DefaultLayout>
  );
};

export default EstimateFormPage;

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    flex: 1,
  },
  formContainer: {
    flex: 9,
    // 여기에 폼 스타일 추가
  },
  form: {
    // 여기에 폼 필드 스타일 추가
    gap: 16,
  },
  field: {
    flexDirection: 'column',
    gap: 24, // 라벨과 Input 사이 살짝 간격
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  dateField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 16,
  },
  buttonContainer: {
    flex: 1,
    marginTop: 16,
    // 여기에 버튼 스타일 추가
  },
  button: {
    // flex: 1,
    alignItems: 'center',
    backgroundColor: '#5b86ea',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
});
