import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ButtonGroup from './ButtonGroup';
import Typo from '../../common/Typo';

interface IStaffCardProps {
  staffName: string;
  staffId: string;
  staffGrade: string;
  isButtonVisible: boolean;
  toggleEdit: () => void;
  handleDelete: () => void;
  handleCancel: () => void;
}

const StaffCard = ({
  staffName,
  staffGrade,
  staffId,
  isButtonVisible,
  toggleEdit,
  handleDelete,
  handleCancel,
}: IStaffCardProps) => {
  return (
    <TouchableOpacity style={styles.cardContainer}>
      <View style={styles.staffNameContainer}>
        <View style={styles.paragraph}>
          <Typo style={styles.text}>{staffGrade}</Typo>
          <Typo style={styles.divider}>|</Typo>
          <Typo style={styles.text}>{staffName}</Typo>
        </View>
      </View>
      {isButtonVisible && (
        <ButtonGroup
          isVisible={isButtonVisible}
          isEdit={true}
          isDelete={true}
          isCancel={true}
          onEditPress={toggleEdit}
          onDeletePress={handleDelete}
          onCancelPress={handleCancel}
        />
      )}
    </TouchableOpacity>
  );
};

export default StaffCard;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  staffNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
    flex: 1,
  },
  paragraph: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
    lineHeight: 24,
  },
  divider: {
    fontSize: 18,
    fontWeight: '600',
    color: '#C4C7CF',
    fontFamily: 'Pretendard-Black',
    lineHeight: 18,
  },
});
