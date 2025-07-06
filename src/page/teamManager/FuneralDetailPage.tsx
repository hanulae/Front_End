import {NavigationProp, useRoute, RouteProp} from '@react-navigation/native';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {useEffect, useState, useCallback} from 'react';
import ManagerLayout from '../../layout/ManagerLayout';
import CustomButton from '../../components/common/CustomButton';
import CartIcon from '../../assets/Button/Button_Cart.svg';
import Typo from '../../components/common/Typo';
import MoveIcon from '../../assets/Button/Button_MoveTransparent.svg';
import dummyHallImage from '../../assets/dummyHall.png';
import PhoneIcon from '../../assets/Icon/Icon_Phone.svg';
import HomeIcon from '../../assets/Icon/Icon_Home.svg';
import MapIcon from '../../assets/Icon/Icon_Map.svg';
import ParkingLotIcon from '../../assets/Icon/Icon_ParkingLot.svg';
import StoreIcon from '../../assets/Icon/Icon_Store.svg';
import FamilyWaitingRoomIcon from '../../assets/Icon/Icon_FamilyWaitingRoom.svg';
import DisabledFacilityIcon from '../../assets/Icon/Icon_DisabledFacility.svg';
import {
  funeralService,
  FuneralDetail,
  HallRoomSummary,
} from '../../services/api/funeralService';
import {useManagerCart} from '../../hooks/useManagerCart';
import Toast from 'react-native-toast-message';
import {useAtom} from 'jotai';
import {userInfoAtom} from '../../state/local_state/userinfoAtom';

type FuneralDetailParams = {
  funeralListId: string;
  funeralId: string;
  variant?: string; // variant 파라미터 추가
};

interface IFuneralDetailPageProps {
  navigation: NavigationProp<any>;
}

// 아이콘 크기 상수 정의
const ICON_SIZES = {
  contact: 16, // 연락처 아이콘
  amenity: 68, // 편의시설 아이콘
  button: 24, // 버튼 아이콘
} as const;

const FuneralDetailPage = ({
  navigation: _navigation,
}: IFuneralDetailPageProps) => {
  const route = useRoute<RouteProp<{params: FuneralDetailParams}, 'params'>>();
  const {funeralListId, funeralId, variant} = route.params;

  // 로그인 상태 체크
  const [userInfo] = useAtom(userInfoAtom);
  const isLoggedIn = userInfo.isLogin;

  // 회원가입 중인지 확인
  const isSignupMode = variant === 'signup';

  // 상태 관리
  const [funeralInfo, setFuneralInfo] = useState<FuneralDetail | null>(null);
  const [hallRoomSummary, setHallRoomSummary] = useState<HallRoomSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {addToCart} = useManagerCart();

  // 실제 API 호출 함수
  const fetchFuneralDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 장례식장 상세 정보 조회
      const funeralResponse = await funeralService.getFuneralDetail(
        funeralListId,
      );

      if (funeralResponse.success && funeralResponse.data) {
        setFuneralInfo(funeralResponse.data);

        // 호실 요약 정보 조회
        if (funeralId) {
          try {
            const hallRoomResponse = await funeralService.getHallRoomSummary(
              funeralId,
            );
            if (hallRoomResponse.success && hallRoomResponse.data) {
              setHallRoomSummary(hallRoomResponse.data);
            }
          } catch (hallRoomError: any) {
            console.warn('⚠️ 호실 요약 정보 로드 실패:', hallRoomError);
            // 호실 정보 실패는 전체 페이지를 막지 않음
          }
        }
      } else {
        throw new Error('장례식장 정보를 불러올 수 없습니다');
      }
    } catch (err: any) {
      console.error('❌ 장례식장 상세 정보 로드 실패:', err);
      setError(err.message || '알 수 없는 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  }, [funeralListId, funeralId]);

  useEffect(() => {
    // 실제 API로 상세 정보 가져오기
    fetchFuneralDetail();
  }, [fetchFuneralDetail]);

  const handleAddToCart = async () => {
    try {
      if (!funeralInfo) {
        console.error('❌ 장례식장 정보가 없습니다');
        return;
      }

      const result = await addToCart([funeralInfo]);
      if (result) {
        console.log('장바구니 추가 성공');
        Toast.show({
          type: 'success',
          text1: '장바구니에 추가되었습니다.',
          position: 'top',
          topOffset: -150,
          visibilityTime: 2000,
        });
      } else {
        console.error('장바구니 추가 실패');
        Toast.show({
          type: 'error',
          text1: '장바구니 추가 실패',
          position: 'top',
          topOffset: -150,
          visibilityTime: 2000,
        });
      }
    } catch (err) {
      console.error('❌ 장바구니 저장 실패', err);
    }
  };

  const handlePhoneCall = () => {
    if (funeralInfo?.funeralPhoneNumber) {
      Linking.openURL(`tel:${funeralInfo.funeralPhoneNumber}`);
    }
  };

  const handleWebsite = () => {
    if (funeralInfo?.funeralHomepageUrl) {
      const url = funeralInfo.funeralHomepageUrl.startsWith('http')
        ? funeralInfo.funeralHomepageUrl
        : `https://${funeralInfo.funeralHomepageUrl}`;
      Linking.openURL(url);
    }
  };

  const handleMap = () => {
    if (funeralInfo?.funeralAddress) {
      const encodedAddress = encodeURIComponent(funeralInfo.funeralAddress);
      Linking.openURL(`https://maps.google.com/maps?q=${encodedAddress}`);
    }
  };

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <ManagerLayout
        headerShown={true}
        headerTitle="장례식장 상세"
        color="white"
        homeButton={true}
        logoutButton={false}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2D81F1" />
          <Typo style={styles.loadingText}>정보를 불러오는 중...</Typo>
        </View>
      </ManagerLayout>
    );
  }

  // 에러 발생 시 표시
  if (error || !funeralInfo) {
    return (
      <ManagerLayout
        headerShown={true}
        headerTitle="장례식장 상세"
        color="white"
        homeButton={true}
        logoutButton={false}>
        <View style={styles.centerContainer}>
          <Typo style={styles.errorText}>
            ⚠️ {error || '정보를 불러올 수 없습니다'}
          </Typo>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchFuneralDetail}>
            <Typo style={styles.retryButtonText}>다시 시도</Typo>
          </TouchableOpacity>
        </View>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout
      headerShown={true}
      headerTitle="장례식장 상세"
      color="white"
      homeButton={true}
      logoutButton={false}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 🖼️ 장례식장 이미지 */}
        <View style={styles.imageContainer}>
          <Image
            source={
              funeralInfo.funeralImageUrl
                ? {uri: funeralInfo.funeralImageUrl}
                : dummyHallImage
            }
            style={styles.hallImage}
          />
        </View>

        {/* 📋 기본 정보 */}
        <View style={styles.infoSection}>
          <Typo style={styles.hallName}>{funeralInfo.funeralName}</Typo>
          <Typo style={styles.hallAddress}>{funeralInfo.funeralAddress}</Typo>

          <View style={styles.contactButtons}>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handlePhoneCall}>
              <PhoneIcon
                width={ICON_SIZES.contact}
                height={ICON_SIZES.contact}
              />
              <Typo style={styles.contactText}>전화</Typo>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleWebsite}>
              <HomeIcon
                width={ICON_SIZES.contact}
                height={ICON_SIZES.contact}
              />
              <Typo style={styles.contactText}>홈페이지</Typo>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactButton} onPress={handleMap}>
              <MapIcon width={ICON_SIZES.contact} height={ICON_SIZES.contact} />
              <Typo style={styles.contactText}>지도</Typo>
            </TouchableOpacity>
          </View>
        </View>

        {/* 🏢 시설정보 */}
        <View style={styles.section}>
          <Typo style={styles.sectionTitle}>시설정보</Typo>
          <View style={styles.facilityGrid}>
            <View style={styles.facilityItem}>
              <Typo style={styles.facilityLabel}>규모</Typo>
              <Typo style={styles.facilityValue}>
                {funeralInfo.funeralScale || '정보없음'}
              </Typo>
            </View>
            <View style={styles.facilityItem}>
              <Typo style={styles.facilityLabel}>빈소</Typo>
              <Typo style={styles.facilityValue}>
                {funeralInfo.funeralTotalRooms !== undefined &&
                funeralInfo.funeralTotalRooms !== null
                  ? `${funeralInfo.funeralTotalRooms}개`
                  : '정보없음'}
              </Typo>
            </View>
            <View style={styles.facilityItem}>
              <Typo style={styles.facilityLabel}>운영</Typo>
              <Typo style={styles.facilityValue}>
                {funeralInfo.funeralOperationType || '정보없음'}
              </Typo>
            </View>
            <View style={styles.facilityItem}>
              <Typo style={styles.facilityLabel}>형태</Typo>
              <Typo style={styles.facilityValue}>
                {funeralInfo.funeralStyle || '정보없음'}
              </Typo>
            </View>
          </View>
        </View>

        {/* 🛠️ 편의시설 */}
        <View style={styles.section}>
          <Typo style={styles.sectionTitle}>편의시설</Typo>
          <View style={styles.amenityGrid}>
            <View
              style={[
                styles.amenityItem,
                !funeralInfo.funeralParkingLot && styles.disabledAmenity,
              ]}>
              <ParkingLotIcon
                width={ICON_SIZES.amenity}
                height={ICON_SIZES.amenity}
              />
              <Typo
                style={[
                  styles.amenityText,
                  !funeralInfo.funeralParkingLot && styles.disabledText,
                ]}>
                주차
              </Typo>
            </View>
            <View
              style={[
                styles.amenityItem,
                !funeralInfo.funeralStore && styles.disabledAmenity,
              ]}>
              <StoreIcon
                width={ICON_SIZES.amenity}
                height={ICON_SIZES.amenity}
              />
              <Typo
                style={[
                  styles.amenityText,
                  !funeralInfo.funeralStore && styles.disabledText,
                ]}>
                식당
              </Typo>
            </View>
            <View
              style={[
                styles.amenityItem,
                !funeralInfo.funeralFamilyWaitingRoom && styles.disabledAmenity,
              ]}>
              <FamilyWaitingRoomIcon
                width={ICON_SIZES.amenity}
                height={ICON_SIZES.amenity}
              />
              <Typo
                style={[
                  styles.amenityText,
                  !funeralInfo.funeralFamilyWaitingRoom && styles.disabledText,
                ]}>
                휴게실
              </Typo>
            </View>
            <View
              style={[
                styles.amenityItem,
                !funeralInfo.funeralDisabledFacility && styles.disabledAmenity,
              ]}>
              <DisabledFacilityIcon
                width={ICON_SIZES.amenity}
                height={ICON_SIZES.amenity}
              />
              <Typo
                style={[
                  styles.amenityText,
                  !funeralInfo.funeralDisabledFacility && styles.disabledText,
                ]}>
                장애인시설
              </Typo>
            </View>
          </View>
        </View>

        {/* 🏠 빈소 정보 */}
        {hallRoomSummary.length > 0 && (
          <View style={styles.section}>
            <Typo style={styles.sectionTitle}>빈소정보</Typo>
            <View style={styles.hallRoomTable}>
              {/* 테이블 헤더 */}
              <View style={styles.tableHeader}>
                <View style={styles.tableHeaderCell}>
                  <Typo style={styles.tableHeaderText}>호실이름</Typo>
                </View>
                <View style={styles.tableHeaderCell}>
                  <Typo style={styles.tableHeaderText}>평수</Typo>
                </View>
                <View style={styles.tableHeaderCell}>
                  <Typo style={styles.tableHeaderText}>수용가능인원</Typo>
                </View>
              </View>

              {/* 테이블 데이터 */}
              {hallRoomSummary.map(room => (
                <View key={room.funeralHallId} style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Typo style={styles.tableCellText}>
                      {room.funeralHallName}
                    </Typo>
                  </View>
                  <View style={styles.tableCell}>
                    <Typo style={styles.tableCellText}>
                      {room.funeralHallSize}평
                    </Typo>
                  </View>
                  <View style={styles.tableCell}>
                    <Typo style={styles.tableCellText}>
                      {room.funeralHallNumberOfMourners}명
                    </Typo>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* 🛒 하단 고정 버튼 - 회원가입 중이 아닐 때만 표시 */}
      {!isSignupMode && (
        <View style={styles.buttonContainer}>
          {isLoggedIn ? (
            // 로그인된 사용자: 장바구니 담기 버튼
            <CustomButton onPress={handleAddToCart} style={styles.button}>
              <View style={styles.buttonIcon}>
                <CartIcon
                  width={ICON_SIZES.button}
                  height={ICON_SIZES.button}
                />
                <Typo style={styles.buttonText}>장바구니 담기</Typo>
              </View>
              <MoveIcon width={ICON_SIZES.button} height={ICON_SIZES.button} />
            </CustomButton>
          ) : null}
        </View>
      )}
      <Toast />
    </ManagerLayout>
  );
};

export default FuneralDetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // 🆕 로딩/에러 화면 스타일
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Pretendard-Medium',
  },
  errorText: {
    fontSize: 16,
    color: '#F04452',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Pretendard-Medium',
  },
  retryButton: {
    backgroundColor: '#2D81F1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard-Black',
  },

  // 🆕 비활성화된 편의시설 스타일
  disabledAmenity: {
    opacity: 0.3,
  },
  disabledText: {
    color: '#ccc',
  },

  // 🖼️ 이미지 영역
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#f5f5f5',
  },
  hallImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // 📋 정보 영역
  infoSection: {
    padding: 20,
    borderBottomWidth: 8,
    borderBottomColor: '#f5f5f5',
  },
  hallName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    fontFamily: 'Pretendard-Black',
  },
  hallAddress: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
    fontFamily: 'Pretendard-Medium',
  },

  // 📞 연락처 버튼
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 50,
  },
  contactText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Pretendard-Medium',
  },

  // 📊 섹션 공통
  section: {
    padding: 20,
    borderBottomWidth: 4,
    borderBottomColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    fontFamily: 'Pretendard-Black',
  },

  // 🏢 시설정보 그리드
  facilityGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  facilityItem: {
    alignItems: 'center',
    flex: 1,
  },
  facilityLabel: {
    fontSize: 16,
    color: '#2D81F1',
    marginBottom: 12,
    fontFamily: 'Pretendard-Medium',
  },
  facilityValue: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Pretendard-Medium',
  },

  // 🛠️ 편의시설 그리드
  amenityGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  amenityItem: {
    alignItems: 'center',
    flex: 1,
  },
  amenityText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'Pretendard-Medium',
  },
  // 🛒 하단 버튼
  buttonContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D81F1',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  buttonIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Black',
  },
  // 로그인 안내 버튼 스타일
  loginPromptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  loginPromptButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Black',
  },

  // 🏠 빈소 정보 테이블 스타일
  hallRoomTable: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  // 테이블 헤더
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  tableHeaderCell: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Pretendard-Medium',
  },
  // 테이블 데이터 행
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  tableCell: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  tableCellText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Pretendard-Medium',
  },
});
