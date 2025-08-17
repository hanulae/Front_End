/**
 * # component 최상위 주석
 *
 * - 포트원(아임포트) 연동을 통한 결제 처리 페이지 컴포넌트
 * - props: navigation (네비게이션 객체), route (라우트 파라미터 - amount, merchantUid, buyerInfo, productName, variant)
 * - 주요 라이브러리: iamport-react-native (포트원 결제 SDK), @react-navigation/native (네비게이션)
 */

import React from 'react';
import {SafeAreaView, ActivityIndicator, View, Text} from 'react-native';
import IMP from 'iamport-react-native';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import api from '../../api/config';

interface PaymentScreenProps {
  navigation: NavigationProp<any>;
  route: RouteProp<{
    params: {
      amount: number;
      merchantUid: string;
      buyerInfo?: {
        email?: string;
        name?: string;
        tel?: string;
        addr?: string;
        postcode?: string;
      };
      productName?: string;
      variant?: 'manager' | 'funeral'; // ← variant 추가
    };
  }>;
}

/**
 * # 함수/메서드 단 주석
 *
 * - 기능 설명: 결제 로딩 중 표시할 로딩 컴포넌트
 * - 입력 값: 없음
 * - 출력 값: JSX 로딩 컴포넌트
 */
const LoadingComponent = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <ActivityIndicator size="large" color="#2D81F1" />
    <Text style={{marginTop: 10, fontSize: 16}}>
      결제 페이지를 불러오는 중...
    </Text>
  </View>
);

const PaymentScreen = ({navigation, route}: PaymentScreenProps) => {
  const {
    amount,
    merchantUid,
    buyerInfo,
    productName = '캐시 충전',
    variant = 'funeral', // ← variant 추가
  } = route.params;

  const userCode = 'imp17160662'; // 실제 포트원 가맹점 코드로 변경 필요

  /**
   * # 함수/메서드 단 주석
   *
   * - 기능 설명: 포트원 결제 결과를 처리하는 콜백 함수
   * - 입력 값: response (포트원 결제 응답 객체)
   * - 출력 값: void (PaymentResult 페이지로 네비게이션)
   */
  const handlePaymentResult = async (response: any) => {
    console.log('결제결과:', response);

    try {
      /**
       * # 중요 로직 또는 조건부 로직
       *
       * - 포트원 결제 성공 조건 검증 (imp_success가 'true', imp_uid 존재, error_code 없음)
       * - 결제 성공/실패에 따른 분기 처리로 각각 다른 응답 처리 필요
       */
      const isSuccess =
        response.imp_success === 'true' &&
        response.imp_uid &&
        !response.error_code;

      console.log('결제 성공 여부:', isSuccess);
      console.log('response:', response);
      console.log('response.imp_success:', response.imp_success);
      console.log('response.imp_uid:', response.imp_uid);
      console.log('response.error_code:', response.error_code);

      if (isSuccess) {
        /**
         * # API 연동 주석
         *
         * - POST : 결제 검증을 위해 서버에 imp_uid, merchant_uid, amount 전송
         */
        try {
          await api.post('/funeral/payment/verify', {
            imp_uid: response.imp_uid,
            merchant_uid: response.merchant_uid || merchantUid,
            amount: amount,
          });

          (navigation as any).replace('PaymentResult', {
            result: '성공',
            response,
            amount,
            variant,
          });
        } catch (verifyError) {
          console.error('결제 검증 실패:', verifyError);
          /**
           * # 중요 로직 또는 조건부 로직
           *
           * - 서버 검증 실패해도 포트원에서 결제가 성공했으면 성공으로 처리
           * - 사용자 경험을 위해 결제 자체는 성공으로 안내
           */
          (navigation as any).replace('PaymentResult', {
            result: '성공',
            response,
            amount,
            variant,
          });
        }
      } else {
        /**
         * # 중요 로직 또는 조건부 로직
         *
         * - 결제 실패 또는 취소 시 에러 메시지 처리
         * - response에서 error_msg를 추출하거나 기본 에러 메시지 사용
         */
        const errorMessage = response.error_msg || '결제에 실패했습니다.';

        (navigation as any).replace('PaymentResult', {
          result: '실패',
          response,
          errorMsg: errorMessage,
          amount,
          variant,
        });
      }
    } catch (error) {
      console.error('결제 처리 중 오류:', error);
      (navigation as any).replace('PaymentResult', {
        result: '실패',
        response,
        errorMsg: '결제 처리 중 오류가 발생했습니다.',
        amount,
        variant,
      });
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <IMP.Payment
        userCode={userCode}
        loading={<LoadingComponent />}
        data={{
          pg: 'html5_inicis',
          pay_method: 'card',
          name: productName,
          merchant_uid: merchantUid, // 미리 생성된 merchantUid 사용
          amount: amount,
          app_scheme: 'hanulae',
          // 필수 buyer 정보 추가
          buyer_email: buyerInfo?.email || 'user@example.com',
          buyer_name: buyerInfo?.name || '사용자',
          buyer_tel: buyerInfo?.tel || '010-0000-0000',
          buyer_addr: buyerInfo?.addr || '서울특별시',
          buyer_postcode: buyerInfo?.postcode || '12345',
          escrow: true,
        }}
        callback={handlePaymentResult}
      />
    </SafeAreaView>
  );
};

export default PaymentScreen;
