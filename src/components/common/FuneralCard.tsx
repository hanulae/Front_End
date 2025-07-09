// components/funeral/FuneralCard.tsx
import {Image, Pressable, StyleSheet, View, useWindowDimensions} from 'react-native';
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
  const {width} = useWindowDimensions();
  const itemName = item.funeralName || item.name || '장례식장 이름';
  const itemAddress = item.funeralAddress || item.address || '주소 정보 없음';
  const itemImage = item.imageUrl || item.image || dummyHallImage;

  // 화면 크기에 따른 반응형 스타일 계산
  const isTablet = width > 768;
  const isSmallDevice = width < 375;
  
  const responsiveStyles = {
    // 이미지 크기 - 화면 너비에 비례
    imageSize: {
      width: isTablet ? Math.min(width * 0.15, 120) : isSmallDevice ? width * 0.22 : width * 0.25,
      height: isTablet ? Math.min(width * 0.15, 120) : isSmallDevice ? width * 0.22 : width * 0.25,
    },
    // 텍스트 크기 - 화면 크기에 따라 조정
    nameSize: isTablet ? 22 : isSmallDevice ? 16 : 18,
    addressSize: isTablet ? 14 : isSmallDevice ? 11 : 12,
    deleteButtonSize: isTablet ? 16 : isSmallDevice ? 12 : 14,
    // 간격 조정
    cardPadding: isTablet ? 12 : isSmallDevice ? 6 : 8,
    checkPadding: isTablet ? 12 : isSmallDevice ? 6 : 8,
    gap: isTablet ? 24 : isSmallDevice ? 16 : 20,
    // 컨테이너 높이
    containerHeight: isTablet ? 140 : isSmallDevice ? 90 : 110,
  };

  return (
    <View style={[styles.card, cardDisabled && styles.cardDisabled, {paddingVertical: responsiveStyles.cardPadding}]}>
      {/* 체크박스는 showCheckbox가 true이고 카드가 비활성화되지 않았을 때만 표시 */}
      {showCheckbox && !cardDisabled && (
        <Pressable style={[styles.checkContainer, {paddingLeft: responsiveStyles.checkPadding, paddingRight: responsiveStyles.gap, paddingVertical: responsiveStyles.checkPadding}]} onPress={onPressCheck}>
          {selected ? <CheckOnIcon /> : <CheckOffIcon />}
        </Pressable>
      )}
      <Pressable
        style={[
          styles.contentArea,
          !showCheckbox && styles.contentAreaFullWidth,
          cardDisabled && styles.contentAreaDisabled,
          {gap: responsiveStyles.gap}
        ]}
        onPress={cardDisabled ? undefined : onPressCard}
        disabled={cardDisabled}>
        <Image
          source={itemImage}
          style={[
            styles.image,
            cardDisabled && styles.imageDisabled,
            {
              width: responsiveStyles.imageSize.width,
              height: responsiveStyles.imageSize.height,
            }
          ]}
        />
        <View style={[styles.infoContainer, {height: responsiveStyles.containerHeight}]}>
          <Typo style={[styles.infoName, cardDisabled && styles.textDisabled, {fontSize: responsiveStyles.nameSize}]}>
            {itemName}
          </Typo>
          <Typo
            style={[styles.infoAddress, cardDisabled && styles.textDisabled, {fontSize: responsiveStyles.addressSize}]}
            numberOfLines={isTablet ? 3 : 2}
            ellipsizeMode="tail">
            {itemAddress}
          </Typo>
          {onPressDelete && !cardDisabled && (
            <Pressable style={styles.deleteButton} onPress={onPressDelete}>
              <Typo fontSize={responsiveStyles.deleteButtonSize} color="red" style={[styles.deleteButtonText, {fontSize: responsiveStyles.deleteButtonSize}]}>
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cardDisabled: {
    opacity: 0.6,
  },
  contentArea: {
    flex: 1,
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
    borderRadius: 12,
  },
  imageDisabled: {
    opacity: 0.5,
  },
  infoContainer: {
    flex: 1,
    paddingTop: 6,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  infoName: {
    fontWeight: '500',
    color: '#283042',
    marginBottom: 8,
    fontFamily: 'Pretendard-Black',
  },
  infoAddress: {
    fontWeight: '400',
    color: '#6F717D',
    fontFamily: 'Pretendard-Black',
    lineHeight: 16,
    flexWrap: 'wrap',
    flex: 1,
  },
  textDisabled: {
    color: '#999',
  },
  checkContainer: {
    paddingVertical: 8,
  },
  deleteButton: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    borderRadius: 10,
  },
  deleteButtonText: {
    fontWeight: '600',
    color: '#F04452',
    backgroundColor: 'rgba(240, 68, 82, 0.1)',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontFamily: 'Pretendard-Black',
  },
});
