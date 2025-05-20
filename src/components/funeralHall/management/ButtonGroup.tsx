import {StyleSheet, View} from 'react-native';
import Typo from '../../common/Typo';
import CustomButton from '../../common/CustomButton';

interface IButtonGroupProps {
  isEdit: boolean;
  isDelete: boolean;
  isCancel: boolean;
  onEditPress: () => void;
  onDeletePress: () => void;
  onCancelPress: () => void;
  isVisible?: boolean;
}

const ButtonGroup = ({
  isVisible,
  isEdit,
  isDelete,
  isCancel,
  onEditPress,
  onDeletePress,
  onCancelPress,
}: IButtonGroupProps) => {
  // if (!isVisible) {
  //   return null;
  // }

  return (
    <>
      {isVisible && (
        <View style={styles.buttonRow}>
          {isEdit && (
            <CustomButton onPress={onEditPress} style={styles.editButton}>
              <Typo style={styles.editButtonText}>수정</Typo>
            </CustomButton>
          )}
          {isDelete && (
            <CustomButton onPress={onDeletePress} style={styles.deleteButton}>
              <Typo style={styles.deleteButtonText}>삭제</Typo>
            </CustomButton>
          )}
          {isCancel && (
            <CustomButton onPress={onCancelPress} style={styles.cancelButton}>
              <Typo style={styles.cancelButtonText}>취소</Typo>
            </CustomButton>
          )}
        </View>
      )}
    </>
  );
};

export default ButtonGroup;

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    borderRadius: 10,
    backgroundColor: 'rgba(57, 124, 254, 0.1)',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  deleteButton: {
    borderRadius: 10,
    backgroundColor: 'rgba(240, 68, 82, 0.1)',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  cancelButton: {
    borderRadius: 10,
    backgroundColor: 'rgba(137, 144, 160, 0.1)',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Pretendard-Black',
    color: '#2D81F1',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Pretendard-Black',
    color: '#F04452',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Pretendard-Black',
    color: '#8990A0',
  },
});
