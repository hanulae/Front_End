// components/funeral/FuneralCard.tsx
import {Image, Pressable, StyleSheet, View} from 'react-native';
import Typo from '../../components/common/Typo';
import CheckOnIcon from '../../assets/Contents/Contents_CheckOn.svg';
import CheckOffIcon from '../../assets/Contents/Contents_CheckOff.svg';
import dummyHallImage from '../../assets/dummyHall.png';

interface FuneralCardProps {
  item: {
    funeralListId?: string;
    funeralId?: string | null;
    funeralName?: string;
    funeralAddress?: string;
    imageUrl?: any;
    id?: string;
    name?: string;
    address?: string;
    phone?: string;
    image?: string;
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
  const itemName = item.funeralName || item.name || '장례식장 이름';
  const itemAddress = item.funeralAddress || item.address || '주소 정보 없음';
  const itemImage = item.imageUrl || item.image || dummyHallImage;

  return (
    <View style={styles.card}>
      <Pressable style={styles.checkContainer} onPress={onPressCheck}>
        {selected ? <CheckOnIcon /> : <CheckOffIcon />}
      </Pressable>
      <Pressable style={styles.contentArea} onPress={onPressCard}>
        <Image 
          source={itemImage}
          style={styles.image}
        />
        <View style={styles.infoContainer}>
          <Typo style={styles.infoName}>{itemName}</Typo>
          <Typo 
            style={styles.infoAddress}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {itemAddress}
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
    gap: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  infoContainer: {
    flex: 1,
    height: 110,
    paddingTop: 8,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  infoName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#283042',
    marginBottom: 10,
    fontFamily: 'Pretendard-Black',
  },
  infoAddress: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6F717D',
    fontFamily: 'Pretendard-Black',
    lineHeight: 12,
    flexWrap: 'wrap',
    flex: 1,
  },
  checkContainer: {
    paddingLeft: 8,
    paddingRight: 20,
    paddingVertical: 8,
  },
  deleteButton: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    borderRadius: 10,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F04452',
    backgroundColor: 'rgba(240, 68, 82, 0.1)',
    // marginTop: 10,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontFamily: 'Pretendard-Black',
  },
});
