import {useRoute} from '@react-navigation/native';
import {ScrollView, StyleSheet, View} from 'react-native';
import DefaultLayout from '../../../layout/DefaultLayout';
import Typo from '../../../components/common/Typo';
import {serviceAgreement} from '../../../constant/agreements/serviceAgreement';
import {privacyAgreement} from '../../../constant/agreements/privacy';

/**
 * 약관 상세 내용을 표시하는 페이지 컴포넌트
 * - 서비스 이용약관, 개인정보 처리방침 등 각종 약관의 상세 내용을 스크롤뷰로 표시
 * - 라우트 파라미터로 받은 type에 따라 다른 약관 내용을 렌더링
 *
 * Props: 없음 (라우트 파라미터 사용)
 * 주요 라이브러리: @react-navigation/native (라우트 파라미터 접근)
 */
const AgreementDetailPage = () => {
  const route = useRoute();
  // 라우트 파라미터에서 약관 타입을 추출 (어떤 약관을 표시할지 결정)
  const {type} = route.params as {
    type: 'service' | 'privacy' | 'location' | 'age' | 'marketing';
  };

  /**
   * 약관 타입에 따라 헤더에 표시할 제목을 반환하는 함수
   * @returns {string} 약관 타입별 제목 문자열
   */
  const getTitle = () => {
    switch (type) {
      case 'service':
        return '서비스 이용약관';
      case 'privacy':
        return '개인정보 처리방침';
      case 'location':
        return '위치기반 서비스 이용약관';
      case 'age':
        return '연령 확인 약관';
      case 'marketing':
        return '마케팅 수신 동의 약관';
      default:
        return '서비스 이용약관';
    }
  };

  /**
   * 약관 타입에 따라 실제 약관 내용을 반환하는 함수
   * @returns {string} 약관 타입별 내용 문자열
   */
  const getContent = () => {
    // 약관 타입별 분기 처리 - 실제 약관 상수와 임시 텍스트로 구분
    switch (type) {
      case 'service':
        return serviceAgreement; // 상수 파일에서 가져온 실제 서비스 약관 내용
      case 'privacy':
        return privacyAgreement; // 상수 파일에서 가져온 실제 개인정보 처리방침 내용
      case 'location':
        return '위치기반 서비스 이용약관 내용'; // TODO: 실제 약관 내용으로 교체 필요
      case 'age':
        return '연령 확인 약관 내용'; // TODO: 실제 약관 내용으로 교체 필요
      case 'marketing':
        return '마케팅 수신 동의 약관 내용'; // TODO: 실제 약관 내용으로 교체 필요
      default:
        return '서비스 이용약관 내용'; // 예외 상황 대비 기본값
    }
  };

  return (
    <DefaultLayout
      headerShown={true}
      homeButton={false}
      color="white"
      backButton={false}
      close={true}
      logoutButton={false}
      homeRouteName="Main"
      headerTitle={getTitle()}>
      <ScrollView style={{padding: 20}}>
        <Typo fontSize={16} style={{fontWeight: '700', marginBottom: 10}}>
          {getTitle()}
        </Typo>
        <Typo fontSize={14} style={{lineHeight: 20}}>
          {getContent()}
        </Typo>
      </ScrollView>
    </DefaultLayout>
  );
};

export default AgreementDetailPage;

const styles = StyleSheet.create({});
