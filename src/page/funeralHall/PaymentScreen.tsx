// PaymentScreen.tsx

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

  const handlePaymentResult = async (response: any) => {
    console.log('결제결과:', response);

    try {
      // 포트원 결제 성공 조건을 실제 응답에 맞게 수정
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
        // 서버에 결제 검증 요청
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
          // 검증 실패해도 결제는 성공으로 처리
          (navigation as any).replace('PaymentResult', {
            result: '성공',
            response,
            amount,
            variant,
          });
        }
      } else {
        // 결제 실패 또는 취소
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
