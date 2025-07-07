import {useNavigation, CommonActions} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Pressable, StyleSheet, View} from 'react-native';
import Typo from '../common/Typo';
import Hello from './Hello';

interface IManagerMainProfileProps {
  managerName: string;
}

const ManagerMainProfile = ({managerName}: IManagerMainProfileProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

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
    <View style={styles.container}>
      <Hello />
      <View style={styles.nameContainer}>
        <Typo style={styles.nameText}>{managerName}</Typo>
        <Typo style={styles.roleText}>상조팀장님</Typo>
      </View>
      <Pressable style={styles.profileButton} onPress={goToProfilePage}>
        <Typo style={styles.profileButtonText}>프로필 보기</Typo>
      </Pressable>
    </View>
  );
};

export default ManagerMainProfile;

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
  profileButton: {
    backgroundColor: '#3D8FFB',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 16,
  },
  profileButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Bold',
  },
});
