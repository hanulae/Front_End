// components/funeral/FuneralCard.tsx
import {Image, Pressable, StyleSheet, View} from 'react-native';
import Typo from '../../components/common/Typo';
import CheckOnIcon from '../../assets/Contents/Contents_CheckOn.svg';
import CheckOffIcon from '../../assets/Contents/Contents_CheckOff.svg';

interface FuneralCardProps {
  item: {
    id: number;
    imageUrl: any;
    name: string;
    address: string;
  };
  selected: boolean;
  onPressCard: () => void;
  onPressCheck: () => void;
  onPressDelete?: () => void;
}

const FuneralCard = ({
  item,
  selected,
  onPressCard,
  onPressCheck,
  onPressDelete,
}: FuneralCardProps) => {
  return (
    <View style={styles.card}>
      <Pressable style={styles.checkContainer} onPress={onPressCheck}>
        {selected ? <CheckOnIcon /> : <CheckOffIcon />}
      </Pressable>
      <Pressable style={styles.contentArea} onPress={onPressCard}>
        <Image source={item.imageUrl} style={styles.image} />
        <View style={styles.infoContainer}>
          <Typo fontSize={14}>{item.name}</Typo>
          <Typo fontSize={12} color="#666">
            {item.address}
          </Typo>
          {onPressDelete && (
            <Pressable style={styles.deleteButton} onPress={onPressDelete}>
              <Typo fontSize={12} color="red" style={styles.deleteButtonText}>
                삭제
              </Typo>
            </Pressable>
          )}
        </View>
      </Pressable>
    </View>
  );
};

export default FuneralCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  contentArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  checkContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  deleteButton: {},
  deleteButtonText: {
    fontWeight: '700',
    color: '#ff0000',
  },
});
