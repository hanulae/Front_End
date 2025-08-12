/**
 * 포인트 환급 및 캐시 충전 페이지 컴포넌트
 * variant에 따라 manager는 환급, funeral은 충전 기능을 제공하며 결제 연동 포함
 *
 * @props variant - 사용자 타입 ('manager' | 'funeral')
 * @libraries @react-navigation/native, jotai, react-native-toast-message
 */
import {Platform, StatusBar, StyleSheet, TextInput, View} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useCallback, useState, useEffect} from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Typo from '../../components/common/Typo';
import CashIcon from '../../assets/Bullet/Bullet_CoinYellow.svg';
import CustomButton from '../../components/common/CustomButton';
import {useAtomValue} from 'jotai';
import {loginAtom} from '../../state/local_state/loginAtom';
import api from '../../api/config';
import Toast from 'react-native-toast-message';
import {getUserInfo} from '../../utils/tokenStorage';

// 미리 정의된 환급/충전 금액 옵션
const REFUND_AMOUNTS = [100000, 75000, 50000, 25000, 10000, 5000];

const PointRefundPage = () => {
  /**
   * 화면 포커스 시 상태바 스타일 설정
   * Android와 iOS의 상태바 색상 및 스타일을 플랫폼별로 적용
   */
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#3287F8');
        StatusBar.setBarStyle('dark-content');
      } else {
        StatusBar.setBarStyle('dark-content');
      }

      return () => {
        // 화면 포커스 해제 시 필요하다면 초기화 작업
      };
    }, []),
  );

  const route = useRoute();
  const navigation = useNavigation();

  // variant 파라미터 안전하게 처리
  const routeParams = route.params as {variant?: 'manager' | 'funeral'};
  const variant = routeParams?.variant || 'funeral';

  /**
   * variant 파라미터 유효성 검증
   * variant가 없는 경우 경고 로그 출력
   */
  useEffect(() => {
    if (!routeParams?.variant) {
      console.warn('variant 파라미터가 없습니다. 기본값을 사용합니다.');
    }
  }, [routeParams?.variant]);

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [inputAmount, setInputAmount] = useState('');
  const [userDetailInfo, setUserDetailInfo] = useState<any>(null);
  const [currentCash, setCurrentCash] = useState<number>(0);

  /**
   * 미리 정의된 금액 버튼 선택 처리
   * 선택된 금액을 입력 필드에 설정하고 버튼 상태 업데이트
   * @param amount - 선택된 금액
   */
  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setInputAmount(amount.toString());
  };

  /**
   * 직접 입력 금액 변경 처리
   * 사용자가 직접 입력한 금액으로 상태 업데이트하고 선택된 버튼 해제
   * @param text - 입력된 텍스트
   */
  const handleInputChange = (text: string) => {
    setInputAmount(text);
    setSelectedAmount(null); // 입력값이 변경되면 선택된 버튼 해제
  };

  /**
   * 환급 요청 처리 (매니저용)
   * 입력된 금액을 검증하고 서버로 환급 요청 전송
   * POST /manager/cash/refund - 매니저의 캐시 환급 요청을 서버로 전송하기 위함
   */
  const handleRefundRequest = async () => {
    console.log('환급 요청 시도');
    const amount = parseInt(inputAmount, 10);

    // 금액 유효성 검증
    if (isNaN(amount) || amount <= 0) {
      Toast.show({
        type: 'error',
        text1: '입력 오류',
        text2: '유효한 금액을 입력해주세요.',
        position: 'top',
      });
      return;
    }

    try {
      await api.post('/manager/cash/refund', {amountCash: amount});

      Toast.show({
        type: 'success',
        text1: '환급 요청 완료',
        text2: '환급 요청이 성공적으로 처리되었습니다.',
        position: 'top',
      });

      // 입력 필드 초기화 및 현재 캐시 잔액 업데이트
      setInputAmount('');
      setSelectedAmount(null);
      setCurrentCash(prev => prev - amount);
    } catch (error: any) {
      console.error('환급 요청 실패:', error.response?.data || error.message);
      Toast.show({
        type: 'error',
        text1: '환급 요청 실패',
        text2: error.response?.data?.message || '오류가 발생했습니다.',
        position: 'top',
      });
    }
  };

  /**
   * 캐시 충전 처리 (장례식장용)
   * 결제 정보를 서버에 미리 저장하고 결제 화면으로 이동
   * POST /funeral/payment/prepare - 결제 전 결제 정보를 서버에 저장하기 위함
   */
  const handleCashCharge = async () => {
    console.log('캐시 충전 시도');
    const amount = parseInt(inputAmount, 10);

    // 금액 유효성 검증
    if (isNaN(amount) || amount <= 0) {
      Toast.show({
        type: 'error',
        text1: '입력 오류',
        text2: '유효한 금액을 입력해주세요.',
        position: 'top',
      });
      return;
    }

    try {
      // 결제 전 서버에 결제 정보 미리 저장
      const merchantUid = `funeral_${new Date().getTime()}`;

      const response = await api.post('/funeral/payment/prepare', {
        merchantUid,
        amount,
      });
      console.log('결제 준비 완료:', response.data);

      // PaymentScreen으로 네비게이션
      navigation.navigate('PaymentScreen', {
        amount,
        merchantUid,
        buyerInfo: {
          email: userDetailInfo?.funeralEmail || 'user@example.com',
          name: userDetailInfo?.funeralName || '사용자',
          tel: userDetailInfo?.funeralPhoneNumber || '010-0000-0000',
          addr: userDetailInfo?.funeralAddress || '서울특별시',
          postcode: userDetailInfo?.funeralPostcode || '12345',
        },
        productName: '캐시 충전',
        variant: variant,
      });
    } catch (error: any) {
      console.error('결제 준비 실패:', error.response?.data || error.message);
      Toast.show({
        type: 'error',
        text1: '결제 준비 실패',
        text2: error.response?.data?.message || '오류가 발생했습니다.',
        position: 'top',
      });
    }
  };

  /**
   * 현재 캐시 잔액 조회
   * GET /manager|funeral/cash/current - 사용자 타입에 따른 현재 캐시 잔액을 가져오기 위함
   */
  useEffect(() => {
    const fetchCurrentCash = async () => {
      try {
        const isManager = variant === 'manager';
        const cashUrl = isManager
          ? '/manager/cash/current'
          : '/funeral/cash/current';
        const res = await api.get(cashUrl);
        setCurrentCash(res.data.currentCash || 0);
      } catch (error: any) {
        console.error(
          '현재 캐시 조회 실패:',
          error.response?.data || error.message,
        );
      }
    };

    fetchCurrentCash();
  }, [variant]);

  /**
   * 사용자 상세 정보 로드
   * 토큰 스토리지에서 사용자 정보를 가져와 결제 시 사용할 구매자 정보로 설정
   */
  useEffect(() => {
    const loadUserDetailInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        console.log('사용자 상세 정보:', userInfo);
        setUserDetailInfo(userInfo?.data || null);
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
      }
    };

    loadUserDetailInfo();
  }, []);

  return (
    <DefaultLayout
      headerShown={true}
      color="#F5F6F8"
      top={true}
      backButton={true}
      homeButton={true}
      homeRouteName={variant === 'manager' ? 'ManagerMain' : 'FuneralMain'}
      headerTitle={variant === 'manager' ? '환급' : '캐시 충전'}>
      <View style={styles.wrapper}>
        {/* 현재 잔액 표시 섹션 */}
        <View style={styles.balanceContainer}>
          <Typo style={styles.balanceTitle}>현재잔액</Typo>
          <View style={styles.balanceContainer1}>
            <Typo style={styles.balanceValue}>
              {currentCash.toLocaleString()}
            </Typo>
            <CashIcon />
          </View>
        </View>

        {/* 환급/충전 금액 선택 및 신청 섹션 */}
        <View style={styles.refundContainer}>
          {/* 미리 정의된 금액 버튼들 */}
          <View style={styles.amountButtonsContainer}>
            {REFUND_AMOUNTS.map((amount, index) => (
              <CustomButton
                key={index}
                style={[
                  styles.amountButton,
                  selectedAmount === amount && styles.selectedButton,
                ]}
                onPress={() => handleAmountSelect(amount)}>
                <Typo
                  style={[
                    styles.amountButtonText,
                    selectedAmount === amount && styles.selectedButtonText,
                  ]}>
                  {amount.toLocaleString()}
                </Typo>
              </CustomButton>
            ))}
          </View>

          {/* 직접 입력 필드 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputAmount}
              onChangeText={handleInputChange}
              keyboardType="numeric"
              placeholder={
                variant === 'manager'
                  ? '환급 금액을 입력하세요'
                  : '충전 금액을 입력하세요'
              }
              placeholderTextColor="#A7A9B0"
            />
          </View>

          {/* 환급/충전 신청 버튼 - variant에 따라 다른 함수 호출 */}
          <CustomButton
            style={styles.refundButton}
            onPress={
              variant === 'manager' ? handleRefundRequest : handleCashCharge
            }>
            <Typo style={styles.refundButtonText}>
              {variant === 'manager' ? '환급 신청' : '충전 신청'}
            </Typo>
          </CustomButton>
        </View>
      </View>
      <Toast />
    </DefaultLayout>
  );
};

export default PointRefundPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  balanceContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 10,
    gap: 10,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: 500,
    color: '#283042',
    fontFamily: 'Pretendard-Bold',
  },
  balanceContainer1: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: 500,
    color: '#283042',
    fontFamily: 'GmarketSansTTFBold',
  },
  refundContainer: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: 20,
  },
  amountButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
    justifyContent: 'center',
  },
  amountButton: {
    width: '30%',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E1E3E6',
  },
  selectedButton: {
    backgroundColor: '#2D81F1',
    borderColor: '#2D81F1',
  },
  amountButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#283042',
    textAlign: 'center',
    fontFamily: 'Pretendard-Medium',
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#283042',
    borderWidth: 1,
    borderColor: '#E1E3E6',
  },
  refundButton: {
    backgroundColor: '#2D81F1',
    padding: 15,
    borderRadius: 10,
  },
  refundButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Pretendard-Bold',
  },
});
