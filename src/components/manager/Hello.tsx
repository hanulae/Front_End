import {StyleSheet, View} from 'react-native';
import Typo from '../common/Typo';

const Hello = () => {
  return (
    <View style={styles.helloContainer}>
      <View style={styles.bubble}>
        <Typo style={styles.helloText}>반갑습니다.</Typo>
      </View>
      <View style={styles.triangle} />
    </View>
  );
};

export default Hello;

const styles = StyleSheet.create({
  helloContainer: {alignItems: 'flex-end', marginBottom: 8},
  bubble: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  helloText: {
    color: '#3182F6',
    fontSize: 14,
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'white',
    // alignSelf: 'flex-end', // ✅ 왼쪽 정렬
    marginRight: 12, // ✅ 필요 시 위치 미세 조정
  },
});
