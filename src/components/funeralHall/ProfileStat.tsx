import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StyleSheet, View} from 'react-native';
import Typo from '../common/Typo';
import CustomButton from '../common/CustomButton';
import MoveIcon from '../../assets/Button/Button_Move.svg';
import PointIcon from '../../assets/Bullet/Bullet_PointCircle.svg';
import CashIcon from '../../assets/Bullet/Bullet_CoinYellow.svg';
import Hello from './Hello';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

// BSK ADD IMPORTS
import api from '../../api/config';
import {useCallback, useState, useEffect} from 'react';
import {useAtomValue} from 'jotai';
import {loginAtom} from '../../state/local_state/loginAtom';
import {getUserInfo} from '../../utils/tokenStorage';
import Toast from 'react-native-toast-message';
import {scaleFontSize, scaleSize} from '../../utils/responsive';

interface IProfileStatProps {
  point: number;
  cash: number;
  hallName: string;
}

// 권한 타입 정의
interface IPermissions {
  roomManagement: boolean;
  infoEdit: boolean;
  dispatchHistory: boolean;
  dispatchPending: boolean;
  estimateHistory: boolean;
  appSettings: boolean;
}

const ProfileStat = ({point, cash, hallName}: IProfileStatProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  // BSK ADD LOGIN INFO
  const loginInfo = useAtomValue(loginAtom);
  const [currentPoint, setCurrentPoint] = useState<number>(point); // 초기값은 props로 받은 point
  const [currentCash, setCurrentCash] = useState<number>(cash); // 초기값은 props로 받은 cash
  const [isStaff, setIsStaff] = useState(false);
  const [permissions, setPermissions] = useState<IPermissions | null>(null);

  // 사용자 정보 및 권한 로드
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        if (userInfo && userInfo.data) {
          setIsStaff(userInfo.data.isStaff || false);
          setPermissions(userInfo.data.permissions || null);
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
      }
    };

    loadUserInfo();
  }, []);

  // 권한 체크 함수
  const hasPermission = (permission: keyof IPermissions): boolean => {
    if (!isStaff) return true; // 대표는 모든 권한
    return permissions?.[permission] || false;
  };

  const goToModifyFuneralInfo = () => {
    if (!hasPermission('infoEdit')) {
      Toast.show({
        type: 'error',
        text1: '접근 권한 없음',
        text2: '정보 수정에 대한 접근 권한이 없습니다.',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }
    navigation.navigate('FuneralModify');
  };

  useFocusEffect(
    useCallback(() => {
      const fetchCurrentPointAndCash = async () => {
        try {
          const [pointRes, cashRes] = await Promise.all([
            api.get('/funeral/point/current', {
              headers: {Authorization: `Bearer ${loginInfo.accessToken}`},
            }),
            api.get('/funeral/cash/current', {
              headers: {Authorization: `Bearer ${loginInfo.accessToken}`},
            }),
          ]);
          setCurrentPoint(pointRes.data.currentPoint || 0);
          setCurrentCash(cashRes.data.currentCash || 0);
        } catch (error: any) {
          console.error(
            '포인트/캐시 조회 실패:',
            error.response?.data || error.message,
          );
        }
      };

      fetchCurrentPointAndCash();
    }, [loginInfo.accessToken]),
  );

  return (
    <View style={styles.container}>
      <Hello />
      <View style={styles.nameContainer}>
        <Typo style={styles.nameText}>{hallName}</Typo>
        {/* <Typo style={styles.roleText}>장례식장님</Typo> */}
      </View>
      {/* 
      <View style={styles.pointContainer}>
        <Typo style={styles.pointDesc}>보유 포인트</Typo>
        <View style={styles.flexRow}>
          <Typo style={styles.pointText}>{currentPoint.toLocaleString()}</Typo>
          <PointIcon width={24} height={24} />
        </View>
      </View> */}

      <View style={styles.cashContainer}>
        <Typo style={styles.cashDesc}>보유 캐쉬</Typo>
        <View style={styles.flexRow}>
          <Typo style={styles.cashText}>{currentCash.toLocaleString()}</Typo>
          <CashIcon width={24} height={24} />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          style={styles.modifyButton}
          onPress={goToModifyFuneralInfo}>
          <View style={styles.buttonNameContainer}>
            <Typo style={styles.buttonText}>장례식장 정보 수정</Typo>
          </View>
          <MoveIcon width={24} height={24} />
        </CustomButton>
      </View>
    </View>
  );
};

export default ProfileStat;

const styles = StyleSheet.create({
  container: {
    // padding: scaleSize(8),
  },
  nameContainer: {
    flexDirection: 'column',
    alignItems: 'baseline',
  },
  nameText: {
    fontSize: scaleFontSize(34),
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: scaleSize(30),
    marginLeft: scaleSize(16),
  },
  roleText: {
    fontSize: scaleFontSize(20),
    fontWeight: '400',
    color: '#FFFFFF',
    marginLeft: scaleSize(18),
    marginBottom: scaleSize(12),
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleSize(16),
  },
  pointContainer: {
    flexDirection: 'row',
    backgroundColor: '#3D8FFB',
    paddingVertical: scaleSize(16),
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(20),
    borderTopRightRadius: scaleSize(20),
    borderTopLeftRadius: scaleSize(20),
    marginBottom: scaleSize(4),
  },
  pointDesc: {
    fontSize: scaleFontSize(18),
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Regular',
  },
  pointText: {
    fontSize: scaleFontSize(24),
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'GMarketSansTTFBold',
  },
  cashContainer: {
    flexDirection: 'row',
    backgroundColor: '#3D8FFB',
    paddingVertical: scaleSize(16),
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(20),
    borderRadius: scaleSize(12),
    marginBottom: scaleSize(8),
  },
  cashDesc: {
    fontSize: scaleFontSize(18),
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Regular',
  },
  cashText: {
    fontSize: scaleFontSize(24),
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'GMarketSansTTFBold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scaleSize(8),
    marginTop: scaleSize(5),
  },
  leftbutton: {
    flex: 1,
    paddingVertical: scaleSize(16),
    paddingHorizontal: scaleSize(20),
    backgroundColor: '#4B99FE',
    borderRadius: scaleSize(12),
    marginBottom: scaleSize(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modifyButton: {
    flex: 1,
    paddingVertical: scaleSize(16),
    paddingHorizontal: scaleSize(20),
    backgroundColor: '#4B99FE',
    borderRadius: scaleSize(12),
    marginBottom: scaleSize(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleSize(15),
    marginRight: scaleSize(29),
  },
  buttonText: {
    fontSize: scaleFontSize(18),
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
