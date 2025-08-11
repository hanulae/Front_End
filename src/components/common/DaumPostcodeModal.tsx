import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Postcode from '@actbase/react-daum-postcode';
import Typo from './Typo';

/**
 * Daum 우편번호 검색 API 응답 데이터 인터페이스
 * @param zonecode - 우편번호 (5자리 숫자)
 * @param address - 기본 주소 (도로명주소 우선, 없으면 지번주소)
 * @param addressEnglish - 영문 주소
 * @param addressType - 주소 타입 ('R': 도로명, 'J': 지번)
 * @param bname - 법정동명
 * @param buildingName - 건물명
 * @param roadAddress - 도로명주소
 * @param jibunAddress - 지번주소
 * @param sido - 시도 (서울특별시, 경기도 등)
 * @param sigungu - 시군구 (강남구, 수원시 등)
 * @param roadname - 도로명
 * @param query - 사용자가 입력한 검색어
 */
interface PostcodeData {
  zonecode: string; // 우편번호
  address: string; // 기본 주소
  addressEnglish: string; // 영문 주소
  addressType: 'R' | 'J'; // R: 도로명, J: 지번
  bname: string; // 법정동명
  buildingName: string; // 건물명
  roadAddress: string; // 도로명주소
  jibunAddress: string; // 지번주소
  sido: string; // 시도
  sigungu: string; // 시군구
  roadname: string; // 도로명
  query: string; // 검색어
}

/**
 * DaumPostcodeModal Props 인터페이스
 * @param visible - 모달 표시 여부 (boolean)
 * @param onClose - 모달 닫기 콜백 함수
 * @param onSelected - 주소 선택 완료 시 PostcodeData 객체를 전달받는 콜백 함수
 */
interface DaumPostcodeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelected: (data: PostcodeData) => void;
}

/**
 * Daum 우편번호 검색 모달 컴포넌트
 *
 * 주요 기능:
 * - Daum 우편번호 검색 API 웹뷰 통합
 * - 전체 화면 모달 형태로 주소 검색 제공
 * - 선택된 주소 데이터를 구조화하여 부모 컴포넌트에 전달
 * - 검색 과정 및 결과에 대한 상세 로깅
 * - 사용자 친화적인 헤더와 닫기 버튼
 *
 * 사용 목적:
 * - 정확한 한국 주소 입력을 위한 표준 검색 인터페이스
 * - 사용자 주소 입력 실수 방지
 * - 우편번호, 도로명주소, 지번주소 등 다양한 주소 정보 제공
 */
const DaumPostcodeModal: React.FC<DaumPostcodeModalProps> = ({
  visible,
  onClose,
  onSelected,
}) => {
  /**
   * 주소 선택 완료 시 처리하는 함수
   * @param data - Daum 우편번호 검색 API에서 반환된 주소 데이터
   * 목적:
   * - 선택된 주소 데이터를 로깅하여 디버깅 지원
   * - 라이브러리에서 받은 데이터를 가공 없이 부모 컴포넌트에 전달
   * - 주소 선택 후 모달 자동 닫기
   */
  const handleAddressSelected = (data: any) => {
    console.log('📍 주소 선택됨:', data);
    console.log('🔍 전체 데이터:', JSON.stringify(data, null, 2));

    // 라이브러리에서 받은 데이터를 그대로 전달
    onSelected(data);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* 모달 헤더 - 제목과 닫기 버튼 */}
        <View style={styles.header}>
          <Typo style={styles.headerTitle}>주소 검색</Typo>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Typo style={styles.closeButtonText}>닫기</Typo>
          </TouchableOpacity>
        </View>

        {/* Daum 우편번호 검색 웹뷰 컨테이너 */}
        <View style={styles.postcodeContainer}>
          <Postcode
            style={styles.postcode}
            jsOptions={{
              animation: true, // 검색 결과 표시 애니메이션 활성화
              hideMapBtn: true, // 지도 보기 버튼 숨김
              autoMapping: true, // 자동 매핑 기능 활성화
            }}
            onSelected={handleAddressSelected}
            onError={error => {
              console.error('📍 주소 검색 에러:', error);
            }}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default DaumPostcodeModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#2D81F1',
    fontWeight: '600',
  },
  postcodeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  postcode: {
    flex: 1,
    width: '100%',
  },
});
