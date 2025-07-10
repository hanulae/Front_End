import {Platform, StatusBar, StyleSheet, TextInput, View} from 'react-native';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {useCallback, useState, useEffect} from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Typo from '../../components/common/Typo';
import CashIcon from '../../assets/Bullet/Bullet_CoinYellow.svg';
import CustomButton from '../../components/common/CustomButton';

// BSK ADD IMPORTS
import {useAtomValue} from 'jotai';
import {loginAtom} from '../../state/local_state/loginAtom';
import api from '../../api/config';
import Toast from 'react-native-toast-message'; // 상단 import 필요

const REFUND_AMOUNTS = [100000, 75000, 50000, 25000, 10000, 5000];

const PointRefundPage = () => {
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
        // 예: StatusBar.setStyle('default')
      };
    }, []),
  );

  const route = useRoute();
  const {variant} = route.params as {variant: 'manager' | 'funeral'};

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [inputAmount, setInputAmount] = useState('');

  // BSK ADD LOGIN INFO
  const loginInfo = useAtomValue(loginAtom);
  const [currentCash, setCurrentCash] = useState<number>(0);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setInputAmount(amount.toString());
  };

  const handleInputChange = (text: string) => {
    setInputAmount(text);
    setSelectedAmount(null); // 입력값이 변경되면 선택된 버튼 해제
  };

  const handleRefundRequest = async () => {
    //TODO: 환급 요청 로직 추가
    console.log('환급 요청 시도');
    console.log('현재 포인트:', currentCash);
    console.log('입력 금액:', inputAmount);

    const amount = parseInt(inputAmount, 10);

    if (isNaN(amount) || amount <= 0) {
      Toast.show({
        type: 'error',
        text1: '입력 오류',
        text2: '유효한 금액을 입력해주세요.',
        position: 'top',
      });
      return;
    }
    console.log('amount:', amount);
    if (amount > currentCash) {
      Toast.show({
        type: 'error',
        text1: '포인트 초과',
        text2: '환급 요청 금액이 현재 포인트를 초과했습니다.',
        position: 'top',
      });
      return;
    }
    console.log('amount123:', amount);
    try {
      const res = await api.post(
        '/manager/cash/refund',
        { amountCash: amount },
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        },
      );

      Toast.show({
        type: 'success',
        text1: '환급 요청 완료',
        text2: '환급 요청이 성공적으로 처리되었습니다.',
        position: 'top',
      });

      setInputAmount('');
      setSelectedAmount(null);
      setCurrentCash(prev => prev - amount); // UI 반영용
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

  useEffect(() => {
    const fetchCurrentCash = async () => {
      try {
        const isManager = variant === 'manager';
        const cashUrl = isManager
          ? '/manager/cash/current'
          : '/funeral/cash/current';
        const res = await api.get(cashUrl, {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        });
        setCurrentCash(res.data.currentCash || 0); // currentCash로 변경
      } catch (error: any) {
        console.error(
          '현재 캐시 조회 실패:',
          error.response?.data || error.message,
        );
      }
    };

    fetchCurrentCash();
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
        <View style={styles.balanceContainer}>
          <Typo style={styles.balanceTitle}>현재잔액</Typo>
          <View style={styles.balanceContainer1}>
            <Typo style={styles.balanceValue}>
              {currentCash.toLocaleString()}
            </Typo>
            <CashIcon />
          </View>
        </View>
        <View style={styles.refundContainer}>
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

          <CustomButton
            style={styles.refundButton}
            onPress={handleRefundRequest}>
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
