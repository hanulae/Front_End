import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StyleSheet, View} from 'react-native';
import Typo from '../common/Typo';
import CustomButton from '../common/CustomButton';
import ChargeIcon from '../../assets/Button/Button_Charge.svg';
import LogIcon from '../../assets/Button/Button_Log.svg';
import MoveIcon from '../../assets/Button/Button_Move.svg';
import Hello from './Hello';
import {useNavigation} from '@react-navigation/native';

interface IProfileStatProps {
  point: number;
  hallName: string;
}

const ProfileStat = ({point, hallName}: IProfileStatProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const goToPointHistory = () => {
    console.log('Point History');
  };

  const goToChargePoint = () => {
    console.log('Charge Point');
  };
  return (
    <View>
      <Hello />
      <Typo style={styles.nameText}>{hallName} 님</Typo>
      <Typo style={styles.pointText}>{point.toLocaleString()} P</Typo>
      <View style={styles.buttonContainer}>
        <CustomButton style={styles.leftbutton} onPress={goToPointHistory}>
          <View style={styles.buttonNameContainer}>
            <LogIcon width={24} height={24} />
            <Typo style={styles.buttonText}>내역</Typo>
          </View>
          <MoveIcon width={24} height={24} />
        </CustomButton>
        <CustomButton style={styles.rightbutton} onPress={goToChargePoint}>
          <View style={styles.buttonNameContainer}>
            <ChargeIcon width={24} height={24} />
            <Typo style={styles.buttonText}>충전</Typo>
          </View>
          <MoveIcon width={24} height={24} />
        </CustomButton>
      </View>
    </View>
  );
};

export default ProfileStat;

const styles = StyleSheet.create({
  nameText: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 13,
    marginBottom: 18,
  },
  pointText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  leftbutton: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#4B99FE',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
  rightbutton: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1C75E9',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
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
