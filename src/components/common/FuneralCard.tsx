// components/funeral/FuneralCard.tsx
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Typo from '../../components/common/Typo';
import CheckOnIcon from '../../assets/Contents/Contents_CheckOn.svg';
import CheckOffIcon from '../../assets/Contents/Contents_CheckOff.svg';
import dummyHallImage from '../../assets/dummyHall.png';

/**
 * FuneralCard Props 인터페이스
 * @param item - 장례식장 정보(서버 스키마가 다를 수 있어 유연한 키 지원)
 * @param selected - 체크박스 선택 상태
 * @param onPressCard - 카드 영역 클릭 콜백
 * @param onPressCheck - 체크박스 클릭 콜백
 * @param onPressDelete - 삭제 버튼 클릭 콜백 (optional)
 * @param showCheckbox - 체크박스 표시 여부 (optional, 기본값 true)
 * @param disabled - 사용 안 함 (호환성 유지)
 * @param cardDisabled - 카드 전체 인터랙션 비활성화 여부 (optional)
 */
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

/**
 * 장례식장 카드 컴포넌트
 *
 * 주요 기능:
 * - 장례식장 썸네일, 이름, 주소를 카드 형태로 표시
 * - 반응형 스타일: 기기 너비에 따라 크기/간격/글자 크기 자동 조정
 * - 체크박스/삭제 버튼 조건부 표시
 * - 카드 전체 비활성화 모드 지원
 */
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

  // 다중 스키마 호환: 우선순위에 따라 표시할 필드 결정
  const itemName = item.funeralName || item.name || '장례식장 이름';
  const itemAddress = item.funeralAddress || item.address || '주소 정보 없음';
  const itemImage = item.imageUrl || item.image || dummyHallImage;

  // 화면 크기에 따른 반응형 스타일 계산
  const isTablet = width > 768;
  const isSmallDevice = width < 375;

  const responsiveStyles = {
    // 이미지 크기 - 화면 너비에 비례
    imageSize: {
      width: isTablet
        ? Math.min(width * 0.15, 120)
        : isSmallDevice
        ? width * 0.22
        : width * 0.25,
      height: isTablet
        ? Math.min(width * 0.15, 120)
        : isSmallDevice
        ? width * 0.22
        : width * 0.25,
    },
    // 텍스트 크기 - 화면 크기에 따라 조정
    nameSize: isTablet ? 22 : isSmallDevice ? 16 : 18,
    addressSize: isTablet ? 14 : isSmallDevice ? 10 : 12,
    deleteButtonSize: isTablet ? 16 : isSmallDevice ? 11 : 13,
    // 간격 조정
    cardPadding: isTablet ? 12 : isSmallDevice ? 4 : 8,
    checkPadding: isTablet ? 12 : isSmallDevice ? 4 : 8,
    gap: isTablet ? 24 : isSmallDevice ? 16 : 18,
    // 컨테이너 높이
    containerHeight: isTablet ? 140 : isSmallDevice ? 100 : 120,
  };

  return (
    <View
      style={[
        styles.card,
        cardDisabled && styles.cardDisabled,
        {paddingVertical: responsiveStyles.cardPadding},
      ]}>
      {/* 체크박스는 showCheckbox가 true이고 카드가 비활성화되지 않았을 때만 표시 */}
      {showCheckbox && !cardDisabled && (
        <Pressable
          style={[
            styles.checkContainer,
            {
              paddingLeft: responsiveStyles.checkPadding,
              paddingRight: responsiveStyles.gap,
              paddingVertical: responsiveStyles.checkPadding,
            },
          ]}
          onPress={onPressCheck}>
          {selected ? <CheckOnIcon /> : <CheckOffIcon />}
        </Pressable>
      )}

      {/* 카드 컨텐츠 영역 (체크박스 존재 여부에 따라 좌측 여백 보정) */}
      <Pressable
        style={[
          styles.contentArea,
          !showCheckbox && styles.contentAreaFullWidth,
          cardDisabled && styles.contentAreaDisabled,
          {gap: responsiveStyles.gap},
        ]}
        onPress={cardDisabled ? undefined : onPressCard}
        disabled={cardDisabled}>
        {/* 썸네일 이미지 */}
        <Image
          source={itemImage}
          style={[
            styles.image,
            cardDisabled && styles.imageDisabled,
            {
              width: responsiveStyles.imageSize.width,
              height: responsiveStyles.imageSize.height,
            },
          ]}
        />

        {/* 텍스트 정보 영역 */}
        <View
          style={[
            styles.infoContainer,
            {height: responsiveStyles.containerHeight},
          ]}>
          <Typo
            style={[
              styles.infoName,
              cardDisabled && styles.textDisabled,
              {fontSize: responsiveStyles.nameSize},
            ]}>
            {itemName}
          </Typo>
          <Typo
            style={[
              styles.infoAddress,
              cardDisabled && styles.textDisabled,
              {fontSize: responsiveStyles.addressSize},
            ]}
            numberOfLines={isTablet ? 3 : 2}
            ellipsizeMode="tail">
            {itemAddress}
          </Typo>

          {/* 삭제 버튼 (콜백이 있고 카드가 활성 상태일 때만 표시) */}
          {onPressDelete && !cardDisabled && (
            <Pressable style={styles.deleteButton} onPress={onPressDelete}>
              <Typo
                fontSize={responsiveStyles.deleteButtonSize}
                color="red"
                style={[
                  styles.deleteButtonText,
                  {fontSize: responsiveStyles.deleteButtonSize},
                ]}>
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
    fontFamily: 'Pretendard-Regular',
    lineHeight: 18,
    flexWrap: 'wrap',
    marginBottom: 10,
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
