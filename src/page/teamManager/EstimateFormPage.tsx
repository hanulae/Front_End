import {StyleSheet, View} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import {useInputBase} from '../../hooks/input/useInputBase';
import {useState} from 'react';
import Typo from '../../components/common/Typo';
import {Input} from '../../components/common/input/Input';
import {useRoute, useNavigation} from '@react-navigation/native';
import DateWheelBottomSheet from '../../components/common/DateWheel';
import CustomButton from '../../components/common/CustomButton';
import ManagerLayout from '../../layout/ManagerLayout';
import CalandarIcon from '../../assets/Button/Button_Calandar.svg';
import Toast from 'react-native-toast-message';
import RequestIcon from '../../assets/Button/Button_RequestQuote.svg';
import MoveIcon from '../../assets/Button/Button_MoveTransparent.svg';
import {useManagerForm} from '../../hooks/useManagerForm';

const EstimateFormPage = () => {
  const navigation = useNavigation();
  const clientName = useInputBase();
  const visitorCount = useInputBase();
  const deceasedName = useInputBase();

  const route = useRoute();
  const {selectedFunerals, funeralHallIds} = route.params as {
    selectedFunerals: string[];
    funeralHallIds: string[];
  };

  const currentDate = new Date();
  const [admissionDate, setAdmissionDate] = useState<Date | null>(null); // 입실일자
  const [departureDate, setDepartureDate] = useState<Date | null>(null); // 퇴실일자
  const [showAdmissionPicker, setShowAdmissionPicker] = useState(false);
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  
  // 견적서 발송 훅
  const { loading, error, createManagerForm, clearError } = useManagerForm();

  // 날짜 포맷팅 (YYYY-MM-DD)
  const formatSimpleDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(date.getDate()).padStart(2, '0')}`;
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

  // 견적서 발송 함수 (견적서 생성)
  const handleDispatchEstimate = async () => {
    try {
      // 필수 입력 항목 검증
      if (!clientName.value.trim()) {
        Toast.show({
          type: 'error',
          text1: '필수 입력 항목이 누락되었습니다.',
          text2: '상주 이름을 입력해주세요.',
          position: 'top',
          topOffset: -150,
        });
        return;
      }
      if (!visitorCount.value.trim()) {
        Toast.show({
          type: 'error',
          text1: '필수 입력 항목이 누락되었습니다.',
          text2: '조문객 수를 입력해주세요.',
          position: 'top',
          topOffset: -150,
        });
        return;
      }
  } catch (error: any) {
    console.error('견적서 발송 실패: ', error);
    Toast.show({
      type: 'error',
      text1: '견적서 발송 실패',
      text2: error.message || '알 수 없는 오류가 발생했습니다.',
      position: 'top',
      topOffset: -150,
    });
  } finally {
    clearError();
  }
};

  return (
    <ManagerLayout
      headerShown={true}
      headerTitle="견적 신청서"
      homeButton={true}
      color="white"
      homeRouteName="ManagerMain"
      logoutButton={false}>
      <View style={styles.wrapper}>
        <View style={styles.formContainer}>
          <View style={styles.form}>
            <View style={styles.authContainer}>
              <Typo fontSize={16} style={styles.containerTitle}>
                상주 이름
              </Typo>
              <View style={styles.authSection}>
                <Input
                  input={clientName}
                  placeholder="상주이름을 입력하세요."
                />
              </View>
              <View style={styles.field}>
                <Typo fontSize={16} style={styles.containerTitle}>
                  조문객 수
                </Typo>
                <Input
                  input={visitorCount}
                  placeholder="예상 조문객 수를 입력하세요"
                />
              </View>
              <View style={styles.dateField}>
                <View style={styles.field}>
                  <Typo fontSize={16} style={styles.containerTitle}>
                    입실일자
                  </Typo>
                  <CustomButton
                    style={styles.dateButton}
                    // title={admissionDate ? admissionDate.toDateString() : '입실일자 선택'}
                    onPress={() => setShowAdmissionPicker(true)}>
                    <Typo>
                      {admissionDate
                        ? formatSimpleDate(admissionDate)
                        : formatSimpleDate(currentDate)}
                    </Typo>
                    <CalandarIcon width={20} height={20} />
                  </CustomButton>
                </View>

                <View style={styles.field}>
                  <Typo fontSize={16} style={styles.containerTitle}>
                    퇴실일자
                  </Typo>
                  <CustomButton
                    style={styles.dateButton}
                    // title={departureDate ? departureDate.toDateString() : '퇴실일자 선택'}
                    onPress={() => setShowDeparturePicker(true)}>
                    <Typo>
                      {departureDate
                        ? formatSimpleDate(departureDate)
                        : formatSimpleDate(
                            new Date(
                              currentDate.getTime() + 1000 * 60 * 60 * 24 * 2,
                            ),
                          )}
                    </Typo>
                    <CalandarIcon width={20} height={20} />
                  </CustomButton>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              onPress={handleDispatchEstimate}
              style={styles.button}>
              <View style={styles.buttonIcon}>
                <RequestIcon width={24} height={24} />
                <Typo style={styles.buttonText}>
                  견적서 발송
                </Typo>
              </View>
              <MoveIcon width={24} height={24} />
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
      </View>
      <Toast />
    </ManagerLayout>
  );
};

export default EstimateFormPage;

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    flex: 1,
  },
  authSection: {
    // marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    // paddingHorizontal: 16,
  },
  authContainer: {
    flexDirection: 'column',
  },
  containerTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard-Light',
    // marginBottom: 10,
    marginLeft: 10,
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
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 32,
  },
  dateButton: {
    // flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F6F8',
    borderRadius: 10,
    paddingHorizontal: 48,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-end',
    marginTop: 8,
    paddingBottom: 8,
    // 여기에 버튼 스타일 추가
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D81F1',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Black',
  },
  buttonIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
});
