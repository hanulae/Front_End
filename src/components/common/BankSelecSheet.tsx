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

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
}

const BankSelectBottomSheet = ({visible, onClose, onSelect}: Props) => {
  const translateY = useRef(new Animated.Value(300)).current;

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

  // 배열을 3개씩 나누는 함수
  const chunkArray = (array: any[], chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const bankRows = chunkArray(BANK_LIST, 3);

  // 괄호가 있으면 줄바꿈 처리하는 함수
  const formatBankName = (bankName: string) => {
    if (bankName.includes('(')) {
      return bankName.replace('(', '\n(');
    }
    return bankName;
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sheet, {transform: [{translateY}]}]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          bounces={false}>
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
