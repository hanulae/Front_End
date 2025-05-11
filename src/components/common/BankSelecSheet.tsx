import {useEffect, useRef} from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {BankList} from '../../constant/BankList';
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
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sheet, {transform: [{translateY}]}]}>
        {BankList.map(bank => (
          <TouchableOpacity
            style={styles.bank}
            key={bank.name}
            onPress={() => {
              onSelect(bank.name);
              onClose();
            }}>
            <bank.icon width={24} height={24} />
            <Typo style={styles.bankName}>{bank.name}</Typo>
          </TouchableOpacity>
        ))}
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
  },
  bank: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'PretendardLight',
    color: '#222',
  },
});
