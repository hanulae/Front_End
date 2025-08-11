import {useEffect, useRef} from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from 'react-native';
import {BANK_LIST} from '../../constant/BankList';
import Typo from './Typo';

/**
 * BankSelectBottomSheet Props 인터페이스
 * @param visible - 바텀시트 표시 여부 (boolean)
 * @param onClose - 바텀시트 닫기 콜백 함수
 * @param onSelect - 은행 선택 완료 시 선택된 은행명을 전달받는 콜백 함수
 */
interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
}

/**
 * 은행 선택을 위한 바텀시트 컴포넌트
 *
 * 관리하는 상태값들:
 * - translateY: 바텀시트 애니메이션을 위한 Animated.Value
 *
 * 주요 기능:
 * - 은행 목록을 3열 그리드로 표시
 * - 은행명에 괄호가 있는 경우 줄바꿈 처리
 * - 부드러운 슬라이드 애니메이션 효과
 */
const BankSelectBottomSheet = ({visible, onClose, onSelect}: Props) => {
  // 바텀시트 슬라이드 애니메이션을 위한 Animated.Value를 참조하는 useRef 훅
  const translateY = useRef(new Animated.Value(300)).current;

  /**
   * 바텀시트 표시/숨김 상태 변화를 감지하여 슬라이드 애니메이션을 처리하는 useEffect 훅
   * visible 상태가 true일 때: 바텀시트를 아래에서 위로 슬라이드업 (0 위치로 이동)
   * visible 상태가 false일 때: 바텀시트를 위에서 아래로 슬라이드다운 (300 위치로 이동)
   */
  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  /**
   * 배열을 지정된 크기의 청크로 나누는 유틸리티 함수
   * @param array - 나눌 배열 (any[])
   * @param chunkSize - 각 청크의 크기 (number)
   * @returns 청크로 나뉜 2차원 배열
   * 목적: 은행 목록을 3개씩 그룹화하여 3열 그리드 레이아웃 구성
   */
  const chunkArray = (array: any[], chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // BANK_LIST를 3개씩 나누어 행(row) 단위로 구성하는 배열
  const bankRows = chunkArray(BANK_LIST, 3);

  /**
   * 은행명에 괄호가 포함된 경우 줄바꿈 처리를 하는 함수
   * @param bankName - 포맷팅할 은행명 (string)
   * @returns 포맷팅된 은행명 (괄호 앞에 줄바꿈 추가)
   * 목적: 긴 은행명이 UI에서 깔끔하게 표시되도록 가독성 향상
   * 예시: "카카오뱅크(주)" → "카카오뱅크\n(주)"
   */
  const formatBankName = (bankName: string) => {
    if (bankName.includes('(')) {
      return bankName.replace('(', '\n(');
    }
    return bankName;
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      {/* 바텀시트 외부 영역 터치 시 닫기 처리를 위한 배경 오버레이 */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* 애니메이션이 적용된 바텀시트 컨테이너 */}
      <Animated.View style={[styles.sheet, {transform: [{translateY}]}]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          {/* 은행 목록을 3열 그리드로 렌더링 */}
          {bankRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.bankRow}>
              {row.map((bank: any) => (
                <TouchableOpacity
                  style={styles.bank}
                  key={bank.name}
                  onPress={() => {
                    onSelect(bank.name);
                    onClose();
                  }}>
                  <Typo style={styles.bankName}>
                    {formatBankName(bank.name)}
                  </Typo>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

export default BankSelectBottomSheet;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    // backgroundColor: '#000000',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 20,
    maxHeight: '70%',
  },
  scrollView: {
    flex: 1,
  },
  bankRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 5,
  },
  bank: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'PretendardLight',
    color: '#222',
    textAlign: 'center',
    lineHeight: 20,
  },
});
