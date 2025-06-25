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

interface DaumPostcodeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelected: (data: PostcodeData) => void;
}

const DaumPostcodeModal: React.FC<DaumPostcodeModalProps> = ({
  visible,
  onClose,
  onSelected,
}) => {
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
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Typo style={styles.headerTitle}>주소 검색</Typo>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Typo style={styles.closeButtonText}>닫기</Typo>
          </TouchableOpacity>
        </View>

        {/* 다음 우편번호 검색 */}
        <View style={styles.postcodeContainer}>
          <Postcode
            style={styles.postcode}
            jsOptions={{ 
              animation: true,
              hideMapBtn: true,
              autoMapping: true
            }}
            onSelected={handleAddressSelected}
            onError={(error) => {
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