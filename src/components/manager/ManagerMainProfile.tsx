import {useNavigation, CommonActions} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Pressable, StyleSheet, View, useWindowDimensions} from 'react-native';
import Typo from '../common/Typo';
import Hello from './Hello';
import {useMemo} from 'react';

interface IManagerMainProfileProps {
  managerName: string;
}

const ManagerMainProfile = ({managerName}: IManagerMainProfileProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  
  // 화면 크기 감지
  const {width} = useWindowDimensions();
  
  // 브레이크포인트 정의 (갤럭시 S9 전용 최적화)
  const deviceType = useMemo(() => {
    if (width >= 768) return 'tablet';
    if (width >= 411) return 'large'; // medium phone 기준
    if (width >= 375) return 'medium'; // iPhone 6/7/8 크기
    if (width >= 361) return 'small';
    return 'extraSmall'; // 갤럭시 S9 등 360px 이하
  }, [width]);

  const responsiveStyles = useMemo(() => {
    const scale = deviceType === 'extraSmall' ? 0.7 :  // 갤럭시 S9 전용
                  deviceType === 'small' ? 0.8 : 
                  deviceType === 'medium' ? 0.9 :
                  deviceType === 'large' ? 1.0 : 1.2; // tablet

    return {
      // 폰트 크기
      nameTextSize: Math.round(34 * scale),
      roleTextSize: Math.round(20 * scale),
      buttonTextSize: Math.round(18 * scale),
      
      // 패딩과 마진 (갤럭시 S9에서 추가 최적화)
      containerPadding: deviceType === 'extraSmall' ? 8 : Math.round(16 * scale),
      nameMarginTop: deviceType === 'extraSmall' ? 6 : Math.round(13 * scale),
      nameMarginBottom: deviceType === 'extraSmall' ? 8 : Math.round(18 * scale),
      nameMarginLeft: deviceType === 'extraSmall' ? 8 : Math.round(16 * scale),
      roleMarginLeft: Math.round(4 * scale),
      buttonVerticalPadding: deviceType === 'extraSmall' ? 10 : Math.round(16 * scale),
      buttonHorizontalPadding: deviceType === 'extraSmall' ? 12 : Math.round(20 * scale),
      buttonMarginTop: deviceType === 'extraSmall' ? 6 : Math.round(16 * scale),
      
      // 크기
      borderRadius: Math.round(20 * scale),
    };
  }, [deviceType]);

  const goToProfilePage = () => {
    // TabNav의 MyPage 탭으로 이동
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          {name: 'ManagerMain'},
          {
            name: 'FindFuneral',
            params: {screen: 'MyPage'},
          },
        ],
      }),
    );
  };

  return (
    <View style={[styles.container, { padding: responsiveStyles.containerPadding }]}>
      <View style={deviceType === 'extraSmall' ? { transform: [{ scale: 0.8 }] } : {}}>
        <Hello />
      </View>
      <View style={[styles.nameContainer, { marginLeft: responsiveStyles.nameMarginLeft }]}>
        <Typo style={[styles.nameText, {
          fontSize: responsiveStyles.nameTextSize,
          marginTop: responsiveStyles.nameMarginTop,
          marginBottom: responsiveStyles.nameMarginBottom,
          marginLeft: responsiveStyles.nameMarginLeft,
        }]}>{managerName}</Typo>
        <Typo style={[styles.roleText, {
          fontSize: responsiveStyles.roleTextSize,
          marginLeft: responsiveStyles.roleMarginLeft,
        }]}>상조팀장님</Typo>
      </View>
      <Pressable style={[styles.profileButton, {
        paddingVertical: responsiveStyles.buttonVerticalPadding,
        paddingHorizontal: responsiveStyles.buttonHorizontalPadding,
        borderRadius: responsiveStyles.borderRadius,
        marginTop: responsiveStyles.buttonMarginTop,
      }]} onPress={goToProfilePage}>
        <Typo style={[styles.profileButtonText, { fontSize: responsiveStyles.buttonTextSize }]}>프로필 보기</Typo>
      </Pressable>
    </View>
  );
};

export default ManagerMainProfile;

const styles = StyleSheet.create({
  container: {
    // padding은 동적으로 적용됨
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    // marginLeft는 동적으로 적용됨
  },
  nameText: {
    fontWeight: '700',
    color: '#FFFFFF',
    // fontSize, margin은 동적으로 적용됨
  },
  roleText: {
    fontWeight: '400',
    color: '#FFFFFF',
    // fontSize, marginLeft는 동적으로 적용됨
  },
  profileButton: {
    backgroundColor: '#3D8FFB',
    alignItems: 'center',
    // padding, borderRadius, marginTop은 동적으로 적용됨
  },
  profileButtonText: {
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Bold',
    // fontSize는 동적으로 적용됨
  },
});
