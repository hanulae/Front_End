/**
 * # component 최상위 주석
 *
 * - 결제 완료 후 결과를 표시하는 페이지 컴포넌트 (성공/실패 상태 표시)
 * - props: route (결제 결과 데이터 - result, response, amount, errorMsg, variant)
 * - 주요 라이브러리: @react-navigation/native (네비게이션)
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../../components/common/CustomButton';

const PaymentResult = ({route}) => {
  const {result, response, amount, errorMsg, variant} = route.params;
  const navigation = useNavigation();

  /**
   * # 함수/메서드 단 주석
   *
   * - 기능 설명: 이전 화면으로 돌아가는 네비게이션 함수
   * - 입력 값: 없음
   * - 출력 값: void (이전 화면으로 네비게이션)
   */
  const handleGoBack = () => {
    // goBack()을 사용해서 이전 화면으로 돌아가기
    // 이렇게 하면 PaymentScreen → PaymentResult → PointRefundPage로 돌아감
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {result === '성공' ? '✅ 결제 성공' : '❌ 결제 실패'}
      </Text>

      {/**
       * # 중요 로직 또는 조건부 로직
       *
       * - 결제 성공/실패에 따른 UI 분기 처리
       * - 성공 시 충전 금액과 성공 메시지 표시, 실패 시 에러 메시지 표시
       */}
      {result === '성공' ? (
        <View style={styles.successContainer}>
          <Text style={styles.amountText}>{amount?.toLocaleString()}원</Text>
          <Text style={styles.successMessage}>
            캐시가 성공적으로 충전되었습니다.
          </Text>
        </View>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorMessage}>
            {errorMsg || '결제에 실패했습니다.'}
          </Text>
        </View>
      )}

      <CustomButton style={styles.button} onPress={handleGoBack}>
        <Text style={styles.buttonText}>
          {result === '성공' ? '확인' : '다시 시도'}
        </Text>
      </CustomButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  amountText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D81F1',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  errorMessage: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2D81F1',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentResult;
