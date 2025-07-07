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
        <Typo style={styles.roleText}>장례식장님</Typo>
      </View>

      <View style={styles.pointContainer}>
        <Typo style={styles.pointDesc}>보유 포인트</Typo>
        <View style={styles.flexRow}>
          <Typo style={styles.pointText}>{currentPoint.toLocaleString()}</Typo>
          <PointIcon width={24} height={24} />
        </View>
      </View>

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
    // padding: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginLeft: 16,
  },
  nameText: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 13,
    marginBottom: 18,
    marginLeft: 16,
  },
  roleText: {
    fontSize: 20,
    fontWeight: '400',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  pointContainer: {
    flexDirection: 'row',
    backgroundColor: '#3D8FFB',
    paddingVertical: 16,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginBottom: 4,
  },
  pointDesc: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Regular',
  },
  pointText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'GMarketSansTTFBold',
  },
  cashContainer: {
    flexDirection: 'row',
    backgroundColor: '#3D8FFB',
    paddingVertical: 16,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    marginBottom: 8,
  },
  cashDesc: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Regular',
  },
  cashText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'GMarketSansTTFBold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 4,
  },
  leftbutton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#4B99FE',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // shadowColor: '#000', // iOS shadow
    // shadowOpacity: 0.05,
    // shadowRadius: 5,
    // shadowOffset: {width: 0, height: 2},
  },
  modifyButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#4B99FE',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginRight: 29,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
