/**
 * 포인트 전환 페이지 컴포넌트 (현재 환급 기능만 구현)
 * 미리 정의된 금액 버튼이나 직접 입력을 통해 환급 금액을 선택하고 환급 신청 처리
 *
 * @props variant - 사용자 타입 ('manager' | 'funeral')
 * @libraries @react-navigation/native
 */
import {Platform, StatusBar, StyleSheet, TextInput, View} from 'react-native';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Typo from '../../components/common/Typo';
import CashIcon from '../../assets/Bullet/Bullet_CoinYellow.svg';
import CustomButton from '../../components/common/CustomButton';

// 미리 정의된 환급 금액 옵션
const REFUND_AMOUNTS = [100000, 75000, 50000, 25000, 50000, 5000];

const PointChangePage = () => {
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
  const {variant} = route.params as {variant: 'manager' | 'funeral'};

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [inputAmount, setInputAmount] = useState('');

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
   * 환급 신청 처리
   * 입력된 금액을 검증하고 서버로 환급 신청 요청 전송
   * TODO: 실제 API 연동 필요
   */
  const handleRefundRequest = () => {
    const amount = parseInt(inputAmount, 10);

    // 금액 유효성 검증
    if (isNaN(amount) || amount <= 0) {
      // 에러 처리
      return;
    }

    console.log('Refund requested:', amount);
    // TODO: POST /api/refund - 환급 신청 데이터를 서버로 전송하기 위함
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
        {/* 현재 잔액 표시 섹션 */}
        <View style={styles.balanceContainer}>
          <Typo style={styles.balanceTitle}>현재잔액</Typo>
          <View style={styles.balanceContainer1}>
            <Typo style={styles.balanceValue}>100,000</Typo>
            <CashIcon />
          </View>
        </View>

        {/* 환급 금액 선택 및 신청 섹션 */}
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
              placeholder="환급 금액을 입력하세요"
              placeholderTextColor="#A7A9B0"
            />
          </View>

          {/* 환급 신청 버튼 */}
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
