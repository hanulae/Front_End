import {StyleSheet, View, useWindowDimensions} from 'react-native';
import Typo from '../../components/common/Typo';
import {NavigationProp, useNavigation, useRoute} from '@react-navigation/native';
import ManagerLayout from '../../layout/ManagerLayout';
import CommaIcon from '../../assets/Contents/Content_Comma.svg';
import CustomButton from '../../components/common/CustomButton';
import DispatchIcon from '../../assets/Button/Button_Dispatch.svg';
import MoveIcon from '../../assets/Button/Button_MoveTransparent.svg';
import { useManagerForm } from '../../hooks/useManagerForm';
import { useCallback, useEffect, useState } from 'react';

const EstimateDetailPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  const {width} = useWindowDimensions();
  const {managerFormBidId, funeralName, hasBidSelected} = route.params as {
    managerFormBidId: string;
    funeralName: string;
    hasBidSelected?: boolean;
  };
  console.log('funeralName', funeralName);
  const {getManagerFormBidDetail, loading, error} = useManagerForm();
  const [managerFormBidDetail, setManagerFormBidDetail] = useState<{
    managerFormBidId: string;
    managerFormId: string;
    funeralId: string;
    funeralHallName: string;
    funeralHallSize: number;
    funeralHallNumberOfMourners: number;
    funeralHallPrice: number;
    funeralHallDetailPrice: number;
    funeralProponentMoney: number;
    funeralDiscount: number;
    bidStatus: string;
    bidSubmittedAt: string;
  } | undefined>();

  // 화면 크기에 따른 반응형 스타일 계산
  const isTablet = width >= 768;
  const isSmallDevice = width < 375;
  
  const responsiveStyles = {
    // 텍스트 크기
    titleSize: isTablet ? 24 : isSmallDevice ? 16 : 20,
    labelSize: isTablet ? 18 : isSmallDevice ? 13 : 15,
    valueSize: isTablet ? 20 : isSmallDevice ? 14 : 16,
    buttonTextSize: isTablet ? 18 : isSmallDevice ? 13 : 15,
    
    // 패딩과 마진
    containerPadding: isTablet ? 28 : isSmallDevice ? 12 : 16,
    cardPadding: isTablet ? 32 : isSmallDevice ? 16 : 20,
    itemPadding: isTablet ? 28 : isSmallDevice ? 16 : 20,
    buttonPadding: isTablet ? 24 : isSmallDevice ? 14 : 18,
    topPadding: isTablet ? 36 : isSmallDevice ? 16 : 24,
    bottomMargin: isTablet ? 36 : isSmallDevice ? 16 : 24,
    
    // 아이콘 크기
    iconSize: isTablet ? 32 : isSmallDevice ? 20 : 24,
    commaIconSize: isTablet ? 10 : isSmallDevice ? 5 : 6,
    
    // 간격
    gap: isTablet ? 14 : isSmallDevice ? 6 : 8,
    buttonGap: isTablet ? 14 : isSmallDevice ? 6 : 8,

    // 테두리 반경
    borderRadius: isTablet ? 16 : isSmallDevice ? 8 : 12,
  };

  const goToCallFormPage = () => {
    navigation.navigate('CallForm', {
      managerFormBidId: managerFormBidId,
      managerFormId: managerFormBidDetail?.managerFormId,
      funeralId: managerFormBidDetail?.funeralId,
    });
  };

  const loadManagerFormBidDetail = useCallback(async () => {
    try {
      const result = await getManagerFormBidDetail(managerFormBidId);
      if (result) {
        setManagerFormBidDetail(result);
      }
    } catch (error) {
      console.error('고객 견적 입찰 상세 조회 에러: ', error);
    }
  }, [getManagerFormBidDetail, managerFormBidId]);

  useEffect(() => {
    loadManagerFormBidDetail();
  }, [loadManagerFormBidDetail]);

  // 로딩 상태 처리
  if (loading) {
    return (
      <ManagerLayout
        headerShown={true}
        headerTitle="입찰 상세"
        homeButton={true}
        homeRouteName="ManagerMain"
        logoutButton={false}>
        <View style={[styles.centerContainer, {padding: responsiveStyles.containerPadding}]}>
          <Typo style={[styles.loadingText, {fontSize: responsiveStyles.labelSize}]}>로딩 중...</Typo>
        </View>
      </ManagerLayout>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <ManagerLayout
        headerShown={true}
        headerTitle="입찰 상세"
        homeButton={true}
        homeRouteName="ManagerMain"
        logoutButton={false}>
        <View style={[styles.centerContainer, {padding: responsiveStyles.containerPadding}]}>
          <Typo style={[styles.errorText, {fontSize: responsiveStyles.labelSize}]}>❌ {error}</Typo>
        </View>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout
      headerShown={true}
      headerTitle="입찰 상세"
      homeButton={true}
      homeRouteName="ManagerMain"
      logoutButton={false}>
      <View style={[styles.wrapper, {
        paddingHorizontal: responsiveStyles.containerPadding, 
        paddingTop: responsiveStyles.topPadding
      }]}>
        <View style={[styles.titleContainer, {
          paddingHorizontal: responsiveStyles.cardPadding, 
          paddingVertical: responsiveStyles.itemPadding,
          borderTopLeftRadius: responsiveStyles.borderRadius,
          borderTopRightRadius: responsiveStyles.borderRadius,
        }]}>
          <Typo style={[styles.title, {fontSize: responsiveStyles.titleSize}]}>
            {`${funeralName} 입찰상세`}
          </Typo>
        </View>

        <View style={[styles.listContainer, {
          paddingHorizontal: responsiveStyles.cardPadding, 
          paddingVertical: responsiveStyles.containerPadding,
          borderBottomLeftRadius: responsiveStyles.borderRadius,
          borderBottomRightRadius: responsiveStyles.borderRadius,
        }]}>
          <View style={[styles.listItem, {paddingVertical: responsiveStyles.itemPadding}]}>
            <View style={[styles.labelContainer, {gap: responsiveStyles.gap}]}>
              <CommaIcon width={responsiveStyles.commaIconSize} height={responsiveStyles.commaIconSize} />
              <Typo style={[styles.label, {fontSize: responsiveStyles.labelSize}]}>장례식장</Typo>
            </View>
            <Typo style={[styles.value, {fontSize: responsiveStyles.valueSize}]}>{managerFormBidDetail?.funeralHallName}</Typo>
          </View>
          <View style={[styles.listItem, {paddingVertical: responsiveStyles.itemPadding}]}>
            <View style={[styles.labelContainer, {gap: responsiveStyles.gap}]}>
              <CommaIcon width={responsiveStyles.commaIconSize} height={responsiveStyles.commaIconSize} />
              <Typo style={[styles.label, {fontSize: responsiveStyles.labelSize}]}>평수</Typo>
            </View>
            <Typo style={[styles.value, {fontSize: responsiveStyles.valueSize}]}>{managerFormBidDetail?.funeralHallSize}평</Typo>
          </View>
          <View style={[styles.listItem, {paddingVertical: responsiveStyles.itemPadding}]}>
            <View style={[styles.labelContainer, {gap: responsiveStyles.gap}]}>
              <CommaIcon width={responsiveStyles.commaIconSize} height={responsiveStyles.commaIconSize} />
              <Typo style={[styles.label, {fontSize: responsiveStyles.labelSize}]}>수용인원</Typo>
            </View>
            <Typo style={[styles.value, {fontSize: responsiveStyles.valueSize}]}>{managerFormBidDetail?.funeralHallNumberOfMourners}명</Typo>
          </View>
          <View style={[styles.listItem, {paddingVertical: responsiveStyles.itemPadding}]}>
            <View style={[styles.labelContainer, {gap: responsiveStyles.gap}]}>
              <CommaIcon width={responsiveStyles.commaIconSize} height={responsiveStyles.commaIconSize} />
              <Typo style={[styles.label, {fontSize: responsiveStyles.labelSize}]}>식장지불금액</Typo>
            </View>
            <Typo style={[styles.value, {fontSize: responsiveStyles.valueSize}]}>{managerFormBidDetail?.funeralHallDetailPrice}만원</Typo>
          </View>
          <View style={[styles.listItem, {paddingVertical: responsiveStyles.itemPadding}]}>
            <View style={[styles.labelContainer, {gap: responsiveStyles.gap}]}>
              <CommaIcon width={responsiveStyles.commaIconSize} height={responsiveStyles.commaIconSize} />
              <Typo style={[styles.label, {fontSize: responsiveStyles.labelSize}]}>호실사용료</Typo>
            </View>
            <Typo style={[styles.value, {fontSize: responsiveStyles.valueSize}]}>{managerFormBidDetail?.funeralHallPrice}만원</Typo>
          </View>
          <View style={[styles.listItem, {paddingVertical: responsiveStyles.itemPadding}]}>
            <View style={[styles.labelContainer, {gap: responsiveStyles.gap}]}>
              <CommaIcon width={responsiveStyles.commaIconSize} height={responsiveStyles.commaIconSize} />
              <Typo style={[styles.label, {fontSize: responsiveStyles.labelSize}]}>식장지불금액 + 호실사용료</Typo>
            </View>
            <Typo style={[
              styles.value,
              {fontSize: responsiveStyles.valueSize},
              (managerFormBidDetail?.funeralHallPrice || 0) + (managerFormBidDetail?.funeralHallDetailPrice || 0) > 
              (managerFormBidDetail?.funeralProponentMoney ? managerFormBidDetail.funeralProponentMoney / 10000 : 0) 
              && { textDecorationLine: 'line-through', color: '#999' }
            ]}>
              {(managerFormBidDetail?.funeralHallPrice || 0) + (managerFormBidDetail?.funeralHallDetailPrice || 0)}만원
            </Typo>
          </View>
          <View style={[styles.listItem, {paddingVertical: responsiveStyles.itemPadding}]}>
            <View style={[styles.labelContainer, {gap: responsiveStyles.gap}]}>
              <CommaIcon width={responsiveStyles.commaIconSize} height={responsiveStyles.commaIconSize} />
              <Typo style={[styles.label, {fontSize: responsiveStyles.labelSize}]}>제안가</Typo>
            </View>
            <Typo style={[styles.value, {fontSize: responsiveStyles.valueSize}]}>{managerFormBidDetail?.funeralProponentMoney}만원</Typo>
          </View>
          <View style={[styles.listLastItem, {paddingVertical: responsiveStyles.itemPadding}]}>
            <View style={[styles.labelContainer, {gap: responsiveStyles.gap}]}>
              <CommaIcon width={responsiveStyles.commaIconSize} height={responsiveStyles.commaIconSize} />
              <Typo style={[styles.label, {fontSize: responsiveStyles.labelSize}]}>할인율</Typo>
            </View>
            <Typo style={[styles.discountValue, {fontSize: responsiveStyles.valueSize}]}>{managerFormBidDetail?.funeralDiscount}%</Typo>
          </View>
        </View>
      </View>
      {/* 하단 버튼 */}
      <View style={styles.bottomContainer}>
        <CustomButton 
          onPress={hasBidSelected ? () => {} : goToCallFormPage} 
          style={[
            styles.button, 
            hasBidSelected && styles.disabledButton,
            {
              paddingVertical: responsiveStyles.buttonPadding, 
              paddingHorizontal: responsiveStyles.cardPadding,
              marginHorizontal: responsiveStyles.containerPadding,
              marginBottom: responsiveStyles.bottomMargin,
              borderRadius: responsiveStyles.borderRadius,
            }
          ]}
          disabled={hasBidSelected}
        >
          <View style={[styles.buttonIcon, {gap: responsiveStyles.buttonGap}]}>
            <DispatchIcon width={responsiveStyles.iconSize} height={responsiveStyles.iconSize} />
            <Typo fontSize={responsiveStyles.buttonTextSize} color={hasBidSelected ? "#999" : "white"}>
              {hasBidSelected ? "이미 다른 장례식장에 출동 신청을 했습니다" : "출동신청서 작성"}
            </Typo>
          </View>
          {!hasBidSelected && <MoveIcon width={responsiveStyles.iconSize} height={responsiveStyles.iconSize} />}
        </CustomButton>
      </View>
    </ManagerLayout>
  );
};

export default EstimateDetailPage;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#F5F5F5', // 상단 회색 배경
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
  },
  titleContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#283042',
    fontFamily: 'Pretendard-Bold',
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  listLastItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: '#283042',
    fontWeight: '500',
    fontFamily: 'Pretendard-Regular',
  },
  value: {
    fontWeight: '600',
    color: '#283042',
    fontFamily: 'Pretendard-Bold',
  },
  discountValue: {
    fontWeight: '600',
    color: '#2D81F1',
    fontFamily: 'Pretendard-Bold',
  },
  bottomContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#2D81F1',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  buttonIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});
