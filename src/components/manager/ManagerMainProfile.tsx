import {useNavigation, CommonActions} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Pressable, StyleSheet, View} from 'react-native';
import Typo from '../common/Typo';
import Hello from './Hello';
import {useMemo} from 'react';
import {scaleFontSize, scaleSize} from '../../utils/responsive';

interface IManagerMainProfileProps {
  managerName: string;
}

const ManagerMainProfile = ({managerName}: IManagerMainProfileProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const responsiveStyles = useMemo(() => {
    return {
      // 폰트 크기
      nameTextSize: scaleFontSize(34),
      roleTextSize: scaleFontSize(20),
      buttonTextSize: scaleFontSize(18),
      
      // 패딩과 마진
      containerPadding: scaleSize(16),
      nameMarginTop: scaleSize(13),
      nameMarginBottom: scaleSize(18),
      nameMarginLeft: scaleSize(16),
      roleMarginLeft: scaleSize(4),
      buttonVerticalPadding: scaleSize(16),
      buttonHorizontalPadding: scaleSize(20),
      buttonMarginTop: scaleSize(16),
      
      // 크기
      borderRadius: scaleSize(20),
      helloScale: scaleSize(1), // Hello 컴포넌트 크기 조절
    };
  }, []);

  const goToProfilePage = () => {
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
      <View style={{ transform: [{ scale: responsiveStyles.helloScale }] }}>
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
