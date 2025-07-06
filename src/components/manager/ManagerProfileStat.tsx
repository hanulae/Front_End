import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StyleSheet, View} from 'react-native';
import Typo from '../common/Typo';
import PointIcon from '../../assets/Bullet/Bullet_PointCircle.svg';
import CashIcon from '../../assets/Bullet/Bullet_CoinYellow.svg';

// BSK ADD IMPORTS
import {useEffect, useState} from 'react';
import api from '../../api/config';
import {useAtomValue} from 'jotai';
import {loginAtom} from '../../state/local_state/loginAtom';
import Hello from './Hello';

interface IManagerProfileStatProps {
  managerName: string;
}

const ManagerProfileStat = ({managerName}: IManagerProfileStatProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const goToPointHistory = () => {
    console.log('Point History');
  };
  const goToChargePoint = () => {
    console.log('Charge Point');
  };

  // BSK ADD LOGIN INFO
  const loginInfo = useAtomValue(loginAtom);
  const [currentPoint, setCurrentPoint] = useState<number>(0); // 초기값은 props로 받은 point
  const [currentCash, setCurrentCash] = useState<number>(0); // 초기값은 props로 받은 cash

  useEffect(() => {
    const fetchCurrentPointAndCash = async () => {
      try {
        const [pointRes, cashRes] = await Promise.all([
          api.get('/manager/point/current', {
            headers: {Authorization: `Bearer ${loginInfo.accessToken}`},
          }),
          api.get('/manager/cash/current', {
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
  }, []);

  return (
    <View style={styles.container}>
      <Hello />
      <View style={styles.nameContainer}>
        <Typo style={styles.nameText}>{managerName}</Typo>
        <Typo style={styles.roleText}>상조팀장님</Typo>
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

      {/* <View style={styles.buttonContainer}>
        <CustomButton style={styles.leftbutton} onPress={goToPointHistory}>
          <View style={styles.buttonNameContainer}>
            <LogIcon width={24} height={24} />
            <Typo style={styles.buttonText}>내역</Typo>
          </View> */}
      {/* <MoveIcon width={24} height={24} /> */}
      {/* </CustomButton> */}
      {/* </View> */}
    </View>
  );
};

export default ManagerProfileStat;

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  leftbutton: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#4A98FD',
    borderRadius: 1000,
  },
  rightbutton: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#1C75E9',
    borderRadius: 1000,
  },
  buttonNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium',
  },
});
