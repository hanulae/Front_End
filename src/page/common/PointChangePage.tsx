import {Platform, StatusBar, StyleSheet, TextInput, View} from 'react-native';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Typo from '../../components/common/Typo';
import CashIcon from '../../assets/Bullet/Bullet_CoinYellow.svg';
import CustomButton from '../../components/common/CustomButton';

const REFUND_AMOUNTS = [100000, 75000, 50000, 25000, 50000, 5000];

const PointChangePage = () => {
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

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setInputAmount(amount.toString());
  };

  const handleInputChange = (text: string) => {
    setInputAmount(text);
    setSelectedAmount(null); // 입력값이 변경되면 선택된 버튼 해제
  };

  const handleRefundRequest = () => {
    // TODO: 서버로 환급 신청 요청 보내기
    const amount = parseInt(inputAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      // 에러 처리
      return;
    }
    console.log('Refund requested:', amount);
  };

  return (
    <DefaultLayout
      headerShown={true}
      color="#F5F6F8"
      top={true}
      backButton={true}
      homeButton={true}
      homeRouteName={variant === 'manager' ? 'ManagerMain' : 'FuneralMain'}
      headerTitle="포인트 전환">
      <View style={styles.wrapper}>
        <View style={styles.balanceContainer}>
          <Typo style={styles.balanceTitle}>현재잔액</Typo>
          <View style={styles.balanceContainer1}>
            <Typo style={styles.balanceValue}>100,000</Typo>
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
              placeholder="환급 금액을 입력하세요"
              placeholderTextColor="#A7A9B0"
            />
          </View>

          <CustomButton
            style={styles.refundButton}
            onPress={handleRefundRequest}>
            <Typo style={styles.refundButtonText}>환급 신청</Typo>
          </CustomButton>
        </View>
      </View>
    </DefaultLayout>
  );
};

export default PointChangePage;

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
