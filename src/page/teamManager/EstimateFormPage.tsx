import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
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
import {useManagerCart} from '../../hooks/useManagerCart';

// 화면 크기 정보 가져오기
const {width: screenWidth} = Dimensions.get('window');

// 기기별 크기 판단
const isTablet = screenWidth >= 768;
const isSmallDevice = screenWidth < 375;
const isLargeDevice = screenWidth > 414;

const EstimateFormPage = () => {
  const navigation = useNavigation();
  const clientName = useInputBase();
  const visitorCount = useInputBase();
  const squareMeter = useInputBase();
  const deceasedName = useInputBase();

  const route = useRoute();
  const {selectedFunerals, funeralHallIds} = route.params as {
    selectedFunerals: any[];
    funeralHallIds: string[];
  };

  const currentDate = new Date();
  const [admissionDate, setAdmissionDate] = useState<Date | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [showAdmissionPicker, setShowAdmissionPicker] = useState(false);
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const {deleteFromCart} = useManagerCart();
  const {loading, createManagerForm} = useManagerForm();

  const formatSimpleDate = (date: Date) => {
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const formatServerDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleAdmissionConfirm = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      Toast.show({
        type: 'error',
        text1: `입실일자는 ${formatSimpleDate(today)} 이후로 선택해주세요.`,
        position: 'top',
        topOffset: -150,
      });
      return;
    }

    console.log('입실일자 선택됨:', formatSimpleDate(date));
    setAdmissionDate(date);

    // 3일장 기준으로 퇴실일자 자동 설정 (입실일자 + 2일)
    const newDeparture = new Date(date);
    newDeparture.setDate(newDeparture.getDate() + 2);
    setDepartureDate(newDeparture);
    setShowAdmissionPicker(false);
  };

  const handleDepartureConfirm = (date: Date) => {
    if (!admissionDate) {
      Toast.show({
        type: 'error',
        text1: '입실일자를 먼저 선택해주세요.',
        position: 'top',
        topOffset: -150,
      });
      return;
    }

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const admission = new Date(admissionDate);
    admission.setHours(0, 0, 0, 0);

    if (selectedDate <= admission) {
      Toast.show({
        type: 'error',
        text1: `퇴실일자는 ${formatSimpleDate(
          admissionDate,
        )} 이후로 선택해주세요.`,
        position: 'top',
        topOffset: -150,
      });
      return;
    }

    console.log('퇴실일자 선택됨:', formatSimpleDate(date));
    setDepartureDate(date);
    setShowDeparturePicker(false);
  };

  const handleDispatchEstimate = async () => {
    // 입력 유효성 검증
    if (!clientName.value.trim()) {
      Toast.show({
        type: 'error',
        text1: '상주 이름을 입력해주세요.',
        position: 'top',
        topOffset: -150,
      });
      return;
    }

    if (!visitorCount.value.trim()) {
      Toast.show({
        type: 'error',
        text1: '예상 조문객 수를 입력해주세요.',
        position: 'top',
        topOffset: -150,
      });
      return;
    }

    if (!admissionDate) {
      Toast.show({
        type: 'error',
        text1: '입실일자를 선택해주세요.',
        position: 'top',
        topOffset: -150,
      });
      return;
    }

    if (!departureDate) {
      Toast.show({
        type: 'error',
        text1: '퇴실일자를 선택해주세요.',
        position: 'top',
        topOffset: -150,
      });
      return;
    }

    if (!funeralHallIds || funeralHallIds.length === 0) {
      Toast.show({
        type: 'error',
        text1: '선택된 장례식장이 없습니다.',
        position: 'top',
        topOffset: -150,
      });
      return;
    }

    const numberOfMourners = parseInt(visitorCount.value);
    if (isNaN(numberOfMourners) || numberOfMourners <= 0) {
      Toast.show({
        type: 'error',
        text1: '유효한 조문객 수를 입력해주세요.',
        position: 'top',
        topOffset: -150,
      });
      return;
    }

    // 견적서 발송 확인 Alert
    Alert.alert(
      '견적서 발송 확인',
      '현재 내용으로 견적서를 발송하시겠습니까?',
      [
        {
          text: '아니오',
          style: 'cancel',
        },
        {
          text: '예',
          onPress: async () => {
            await sendEstimate();
          },
        },
      ],
      {cancelable: false},
    );
  };

  // 실제 견적서 발송 로직을 별도 함수로 분리
  const sendEstimate = async () => {
    try {
      const formData = {
        funeralList: selectedFunerals.map(
          funeral => funeral.funeralList.funeralListId,
        ),
        chiefMournerName: clientName.value.trim(),
        deceasedName: deceasedName.value.trim() || undefined,
        numberOfMourners: parseInt(visitorCount.value),
        roomSize: squareMeter.value.trim()
          ? parseInt(squareMeter.value.trim())
          : undefined,
        checkInDate: formatServerDate(admissionDate!),
        checkOutDate: formatServerDate(departureDate!),
      };

      console.log('📋 견적서 발송 데이터:', formData);

      const result = await createManagerForm(formData);

      if (result) {
        // 장바구니 삭제와 성공 메시지를 병렬로 처리
        const [cartResult] = await Promise.allSettled([
          deleteFromCart(funeralHallIds),
        ]);

        if (cartResult.status === 'rejected') {
          console.error('⚠️ 장바구니 삭제 실패:', cartResult.reason);
        } else {
          console.log('✅ 장바구니 업데이트 완료');
        }

        Toast.show({
          type: 'success',
          text1: '견적서 발송 완료!',
          text2: '견적서가 성공적으로 발송되었습니다.',
          position: 'top',
          topOffset: -150,
          visibilityTime: 1000,
        });

        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      }
    } catch (error: any) {
      console.error('견적서 발송 실패:', error);
      Alert.alert(
        '오류',
        '견적서 발송 중 오류가 발생했습니다.\n다시 시도해 주세요.',
        [{text: '확인'}],
      );
    }
  };

  // 퇴실일자의 기본값 계산 함수
  const getDefaultDepartureDate = () => {
    if (departureDate) {
      return departureDate;
    }
    if (admissionDate) {
      const defaultDeparture = new Date(admissionDate);
      defaultDeparture.setDate(defaultDeparture.getDate() + 2);
      return defaultDeparture;
    }
    const defaultDeparture = new Date(currentDate);
    defaultDeparture.setDate(defaultDeparture.getDate() + 2);
    return defaultDeparture;
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
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <View style={styles.form}>
              <View style={styles.authContainer}>
                <Typo fontSize={16} style={styles.containerTitle}>
                  상주 이름
                  <Typo fontSize={16} style={styles.required}>
                    {' '}
                    (필수)*
                  </Typo>
                </Typo>
                <View style={styles.authSection}>
                  <Input
                    input={clientName}
                    placeholder="상주이름을 입력하세요."
                  />
                </View>
                <View style={styles.field}>
                  <Typo fontSize={16} style={styles.containerTitle}>
                    고인 이름 (선택사항)
                  </Typo>
                  <Input
                    input={deceasedName}
                    placeholder="고인 이름을 입력하세요."
                  />
                </View>
                <View style={styles.field}>
                  <Typo fontSize={16} style={styles.containerTitle}>
                    조문객 수{' '}
                    <Typo fontSize={16} style={styles.required}>
                      (필수)*
                    </Typo>
                  </Typo>
                  <Input
                    input={visitorCount}
                    placeholder="예상 조문객 인원수를 입력하세요."
                    type="number"
                  />
                </View>
                <View style={styles.field}>
                  <Typo fontSize={16} style={styles.containerTitle}>
                    평 수 (선택사항)
                  </Typo>
                  <Input
                    input={squareMeter}
                    placeholder="원하시는 평 수를 입력하세요."
                    type="number"
                  />
                </View>
                <View style={styles.dateField}>
                  <View style={styles.field}>
                    <Typo fontSize={16} style={styles.containerTitle}>
                      입실일자{' '}
                      <Typo fontSize={16} style={styles.required}>
                        (필수)*
                      </Typo>
                    </Typo>
                    <CustomButton
                      style={styles.dateButton}
                      onPress={() => setShowAdmissionPicker(true)}>
                      <Typo style={!admissionDate && styles.placeholderText}>
                        {admissionDate
                          ? formatSimpleDate(admissionDate)
                          : '선택해주세요'}
                      </Typo>
                      <CalandarIcon width={20} height={20} />
                    </CustomButton>
                  </View>

                  <View style={styles.field}>
                    <Typo fontSize={16} style={styles.containerTitle}>
                      퇴실일자{' '}
                      <Typo fontSize={16} style={styles.required}>
                        (필수)*
                      </Typo>
                    </Typo>
                    <CustomButton
                      style={styles.dateButton}
                      onPress={() => setShowDeparturePicker(true)}>
                      <Typo style={!departureDate && styles.placeholderText}>
                        {departureDate
                          ? formatSimpleDate(departureDate)
                          : '선택해주세요'}
                      </Typo>
                      <CalandarIcon width={20} height={20} />
                    </CustomButton>
                  </View>
                </View>
                <View style={styles.selectedFuneralsContainer}>
                  <Typo fontSize={16} style={styles.containerTitle}>
                    선택된 장례식장 ({funeralHallIds?.length || 0}개)
                  </Typo>
                  {selectedFunerals?.map((funeral, index) => (
                    <View key={index} style={styles.selectedFuneralItem}>
                      <Typo style={styles.selectedFuneralText}>
                        •{' '}
                        {funeral?.funeralList?.funeralName ||
                          `장례식장 ${index + 1}`}
                      </Typo>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <CustomButton
            onPress={handleDispatchEstimate}
            style={[styles.button, loading && styles.buttonDisabled]}
            disabled={loading}>
            <View style={styles.buttonIcon}>
              <RequestIcon width={24} height={24} />
              <Typo style={styles.buttonText}>
                {loading ? '발송 중...' : '견적서 발송'}
              </Typo>
            </View>
            <MoveIcon width={24} height={24} />
          </CustomButton>
        </View>
        <DateWheelBottomSheet
          key={`admission-${admissionDate?.getTime() || 'none'}`}
          visible={showAdmissionPicker}
          initialDate={admissionDate || currentDate}
          onConfirm={handleAdmissionConfirm}
          onClose={() => setShowAdmissionPicker(false)}
        />
        <DateWheelBottomSheet
          key={`departure-${departureDate?.getTime() || 'none'}`}
          visible={showDeparturePicker}
          initialDate={getDefaultDepartureDate()}
          onConfirm={handleDepartureConfirm}
          onClose={() => setShowDeparturePicker(false)}
        />
      </View>
      <Toast />
    </ManagerLayout>
  );
};

export default EstimateFormPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: isTablet ? 24 : isSmallDevice ? 12 : 16,
    paddingBottom: 20,
    maxWidth: isTablet ? 600 : '100%',
    alignSelf: isTablet ? 'center' : 'stretch',
  },
  authSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  authContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  containerTitle: {
    fontSize: isTablet ? 18 : isSmallDevice ? 14 : 16,
    fontWeight: '600',
    fontFamily: 'Pretendard-Light',
    marginLeft: isTablet ? 12 : 10,
    marginBottom: isTablet ? 10 : 8,
  },
  required: {
    color: 'red',
  },
  formContainer: {
    flex: 9,
  },
  form: {
    gap: isTablet ? 20 : 16,
  },
  field: {
    flexDirection: 'column',
    marginBottom: isTablet ? 24 : isSmallDevice ? 16 : 20,
    gap: isTablet ? 10 : 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  dateField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 20,
  },
  dateButton: {
    flexDirection: 'row',
    backgroundColor: '#F5F6F8',
    borderRadius: 10,
    paddingHorizontal: isTablet ? 50 : isSmallDevice ? 36 : 42,
    paddingVertical: isTablet ? 20 : isSmallDevice ? 12 : 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: isTablet ? 56 : 48,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 24 : 16,
    paddingVertical: isTablet ? 20 : 16,
    paddingBottom: Platform.OS === 'ios' ? (isLargeDevice ? 34 : 20) : 16,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    backgroundColor: 'white',
    maxWidth: isTablet ? 600 : '100%',
    alignSelf: isTablet ? 'center' : 'stretch',
  },
  button: {
    flexDirection: 'row',
    flex: isTablet ? 0 : 1,
    minWidth: isTablet ? 200 : 'auto',
    alignItems: 'center',
    backgroundColor: '#2D81F1',
    borderRadius: 8,
    paddingVertical: isTablet ? 18 : 16,
    paddingHorizontal: isTablet ? 24 : 20,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  buttonIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Black',
  },
  selectedFuneralsContainer: {
    // marginTop: 10,
    padding: isTablet ? 20 : 16,
    backgroundColor: '#f8f9fa',
    borderRadius: isTablet ? 12 : 8,
    borderLeftWidth: isTablet ? 6 : 4,
    borderLeftColor: '#2D81F1',
  },
  selectedFuneralItem: {
    marginTop: isTablet ? 10 : 8,
  },
  selectedFuneralText: {
    fontSize: isTablet ? 16 : isSmallDevice ? 13 : 14,
    color: '#333',
  },
  placeholderText: {
    color: '#999999',
    fontSize: isTablet ? 16 : isSmallDevice ? 13 : 14,
  },
});
