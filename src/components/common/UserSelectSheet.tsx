import React, {useState} from 'react';
import {View, Pressable, StyleSheet, Animated, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Typo from './Typo';
import FuneralIcon from '../../assets/User/User_FuneralDisable.svg';
import ManagerIcon from '../../assets/User/User_ManagerDisable.svg';
import CheckIcon from '../../assets/User/User_Check.svg';

interface ISelectSheetProps {
  onClose: () => void;
  targetScreen: 'Login' | 'Signup';
}

const {height} = Dimensions.get('window');

const UserSelectSheet = ({onClose, targetScreen}: ISelectSheetProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [selected, setSelected] = useState<'manager' | 'funeral'>('manager');
  const translateY = new Animated.Value(300);

  React.useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSelect = (type: 'manager' | 'funeral') => {
    setSelected(type);
    setTimeout(() => {
      onClose(); // BottomSheet 닫기
      navigation.navigate(targetScreen, {userType: type});
    }, 150);
  };

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <Animated.View style={[styles.sheet, {transform: [{translateY}]}]}>
        <View style={styles.titleContainer}>
          <Typo style={styles.title}>회원유형을 선택해 주세요.</Typo>
        </View>
        <View style={styles.optionContainer}>
          {['manager', 'funeral'].map(type => (
            <Pressable
              key={type}
              style={[
                styles.optionBox,
                selected === type && styles.optionSelected,
              ]}
              onPress={() => handleSelect(type as 'manager' | 'funeral')}>
              <Typo
                style={[
                  styles.optionText,
                  selected === type && styles.optionTextSelected,
                ]}>
                {type === 'manager' ? '상조팀장' : '장례식장'}
              </Typo>
              {/* 아이콘은 SVG나 Image로 추가 가능 */}
              <View style={styles.buttonContainer}>
                {type === 'manager' ? (
                  <ManagerIcon width={25} height={25} />
                ) : (
                  <FuneralIcon width={25} height={25} />
                )}
                <CheckIcon height={20} />
              </View>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default UserSelectSheet;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: 'white',
    paddingHorizontal: 25,
    paddingTop: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.3,
  },
  titleContainer: {
    // paddingLeft: 10,
    // paddingTop: 30,
    paddingBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  optionBox: {
    flex: 1,
    gap: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingLeft: 25,
    paddingVertical: 25,
    height: 160,
    width: 150,
    flexDirection: 'column',
    justifyContent: 'space-between',
    // alignItems: 'center',
    borderRadius: 12,
  },
  optionSelected: {
    borderColor: '#397CFF',
    backgroundColor: '#E6F0FF',
  },
  optionText: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Pretendard-Medium',
    textAlign: 'left',
  },
  optionTextSelected: {
    color: '#397CFF',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingRight: 25,
    // gap: 50,
    justifyContent: 'space-between',
  },
});
