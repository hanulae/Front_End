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
  showCheckbox?: boolean; // 체크박스 표시 여부
  disabled?: boolean;
  cardDisabled?: boolean; // 카드 전체 비활성화 여부
}

const FuneralCard = ({
  item,
  selected,
  onPressCard,
  onPressCheck,
  onPressDelete,
  showCheckbox = true, // 기본값은 true (기존 동작 유지)
  cardDisabled = false, // 카드 전체 비활성화 여부
}: FuneralCardProps) => {
  const itemName = item.funeralName || item.name || '장례식장 이름';
  const itemAddress = item.funeralAddress || item.address || '주소 정보 없음';
  const itemImage = item.imageUrl || item.image || dummyHallImage;

  return (
    <View style={[styles.card, cardDisabled && styles.cardDisabled]}>
      {/* 체크박스는 showCheckbox가 true이고 카드가 비활성화되지 않았을 때만 표시 */}
      {showCheckbox && !cardDisabled && (
        <Pressable style={styles.checkContainer} onPress={onPressCheck}>
          {selected ? <CheckOnIcon /> : <CheckOffIcon />}
        </Pressable>
      )}
      <Pressable
        style={[
          styles.contentArea,
          !showCheckbox && styles.contentAreaFullWidth,
          cardDisabled && styles.contentAreaDisabled,
        ]}
        onPress={cardDisabled ? undefined : onPressCard}
        disabled={cardDisabled}>
        <Image
          source={itemImage}
          style={[styles.image, cardDisabled && styles.imageDisabled]}
        />
        <View style={styles.infoContainer}>
          <Typo style={[styles.infoName, cardDisabled && styles.textDisabled]}>
            {itemName}
          </Typo>
          <Typo
            style={[styles.infoAddress, cardDisabled && styles.textDisabled]}
            numberOfLines={2}
            ellipsizeMode="tail">
            {itemAddress}
          </Typo>
          {onPressDelete && !cardDisabled && (
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
  cardDisabled: {
    opacity: 0.6,
  },
  contentArea: {
    flex: 1,
    gap: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentAreaFullWidth: {
    paddingLeft: 8, // 체크박스가 없을 때 적절한 여백 추가
  },
  contentAreaDisabled: {
    opacity: 0.6,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  imageDisabled: {
    opacity: 0.5,
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
  textDisabled: {
    color: '#999',
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
