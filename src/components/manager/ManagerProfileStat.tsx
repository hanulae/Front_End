import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StyleSheet, View} from 'react-native';
import Typo from '../common/Typo';
import CustomButton from '../common/CustomButton';
import {scaleFontSize, scaleSize, isSmallDevice} from '../../utils/responsive';

// BSK ADD IMPORTS
import {useState, useCallback} from 'react';
import api from '../../api/config';
import {useAtomValue} from 'jotai';
import {loginAtom} from '../../state/local_state/loginAtom';
import Hello from './Hello';

interface IManagerProfileStatProps {
  managerName: string;
}

const ManagerProfileStat = ({managerName}: IManagerProfileStatProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute();

  // BSK ADD LOGIN INFO
  const loginInfo = useAtomValue(loginAtom);
  const [_currentPoint, setCurrentPoint] = useState<number>(0);
  const [currentCash, setCurrentCash] = useState<number>(0);

  useFocusEffect(
    useCallback(() => {
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

          setCurrentPoint(pointRes.data?.currentPoint ?? 0);
          setCurrentCash(cashRes.data?.currentCash ?? 0);
        } catch (error: any) {
          console.error(
            '포인트/캐시 조회 실패:',
            error.response?.data || error.message,
          );
          setCurrentPoint(0);
          setCurrentCash(0);
        }
      };

      fetchCurrentPointAndCash();
    }, [loginInfo.accessToken]),
  );

  const goToManagerPage = () => {
    navigation.navigate('MyPage'); // TabNav에 정의된 이름과 일치해야 합니다.
  };

  // 페이지에 따라 다른 내용 보여주기
  const renderContentBasedOnPage = () => {
    console.log('🏁 route.name:', route.name);
    if (route.name === 'MyPage') {
      return (
        <>
          {/* <View style={styles.pointContainer}>
            <Typo style={styles.pointDesc}>보유 포인트</Typo>
            <View style={styles.flexRow}>
              <Typo style={styles.pointText}>
                {(currentPoint ?? 0).toLocaleString()}
              </Typo>
            </View>
          </View> */}
          <View style={styles.cashContainer}>
            <Typo style={styles.cashDesc}>보유 캐쉬</Typo>
            <View style={styles.flexRow}>
              <Typo style={styles.cashText}>
                {(currentCash ?? 0).toLocaleString()}
              </Typo>
            </View>
          </View>
        </>
      );
    } else {
      return (
        <CustomButton onPress={goToManagerPage} style={styles.myPageButton}>
          <Typo style={styles.myPageButtonText}>프로필 이동</Typo>
        </CustomButton>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Hello />
      <View style={styles.nameContainer}>
        <Typo style={styles.nameText}>{managerName}</Typo>
        <Typo style={styles.roleText}>상조팀장님</Typo>
      </View>
      {renderContentBasedOnPage()}
      {/* <View style={styles.cashContainer}>
        <Typo style={styles.cashDesc}>보유 캐쉬</Typo>
        <View style={styles.flexRow}>
        <Typo style={styles.cashText}>{currentCash.toLocaleString()}</Typo>
          <CashIcon width={24} height={24} />
        </View>
      </View> */}

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
    paddingHorizontal: scaleSize(16),
    paddingTop: scaleSize(64),
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginLeft: scaleSize(16),
  },
  nameText: {
    fontSize: scaleFontSize(isSmallDevice ? 28 : 34),
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: scaleSize(13),
    marginBottom: scaleSize(18),
    marginLeft: scaleSize(16),
  },
  roleText: {
    fontSize: scaleFontSize(isSmallDevice ? 16 : 20),
    fontWeight: '400',
    color: '#FFFFFF',
    marginLeft: scaleSize(4),
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
    borderTopRightRadius: scaleSize(20),
    borderTopLeftRadius: scaleSize(20),
    paddingHorizontal: scaleSize(20),
    marginBottom: scaleSize(4),
  },
  pointDesc: {
    fontSize: scaleFontSize(isSmallDevice ? 16 : 18),
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Regular',
  },
  pointText: {
    fontSize: scaleFontSize(isSmallDevice ? 20 : 24),
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
    borderRadius: scaleSize(20),
  },
  cashDesc: {
    fontSize: scaleFontSize(isSmallDevice ? 16 : 18),
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Regular',
  },
  cashText: {
    fontSize: scaleFontSize(isSmallDevice ? 20 : 24),
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'GMarketSansTTFBold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scaleSize(16),
    marginTop: scaleSize(8),
  },
  leftbutton: {
    flexDirection: 'row',
    paddingVertical: scaleSize(8),
    paddingHorizontal: scaleSize(20),
    backgroundColor: '#4A98FD',
    borderRadius: 1000,
  },
  rightbutton: {
    flexDirection: 'row',
    paddingVertical: scaleSize(8),
    paddingHorizontal: scaleSize(20),
    backgroundColor: '#1C75E9',
    borderRadius: 1000,
  },
  buttonNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleSize(8),
  },
  buttonText: {
    fontSize: scaleFontSize(isSmallDevice ? 14 : 16),
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium',
  },
  myPageButton: {
    backgroundColor: '#4A98FD',
    paddingVertical: scaleSize(16),
    borderRadius: scaleSize(20),
    alignItems: 'center',
    marginHorizontal: scaleSize(20),
    marginBottom: scaleSize(20),
  },
  myPageButtonText: {
    fontSize: scaleFontSize(isSmallDevice ? 16 : 18),
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
