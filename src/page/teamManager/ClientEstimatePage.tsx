import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Typo from '../../components/common/Typo';
import {useCallback, useState} from 'react';
import FuneralQuoteCard from '../../components/manager/FuneralQuoteCard';
import CustomButton from '../../components/common/CustomButton';
const estimates = [
  {
    id: 1,
    name: '서울대학교병원 장례식장',
    address: '서울시 종로구 대학로 101',
    selected: true,
    status: '입찰완료',
  },
  {
    id: 2,
    name: '서울대학교병원 장례식장',
    address: '서울시 종로구 대학로 101',
    selected: false,
    status: '입찰완료',
  },
  {
    id: 3,
    name: '서울대학교병원 장례식장',
    address: '서울시 종로구 대학로 101',
    selected: false,
    status: '입찰대기',
  },
];
const ClientEstimatePage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  const {clientId} = route.params as {clientId: number};
  console.log('clientId', clientId);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#3287F8');
        StatusBar.setBarStyle('dark-content');
      } else {
        StatusBar.setBarStyle('dark-content');
      }

      return () => {
        // 화면 포커스 해제 시 필요하다면 초기화 작업
        // 예: StatusBar.setStyle('default')
      };
    }, []),
  );

  const handleSelect = (id: number) => {
    setSelectedId(prev => (prev === id ? null : id));
  };
  const goToEstimateDetail = () => {
    navigation.navigate('EstimateDetail');
  };
  return (
    <DefaultLayout
      headerShown={true}
      headerTitle="고객 견적서"
      homeButton={true}
      homeRouteName="ManagerMain"
      logoutButton={false}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        {estimates.map(item => {
          const isSelected = selectedId === item.id;
          const isCompleted = item.status === '입찰완료';

          return (
            <FuneralQuoteCard
              key={item.id}
              id={item.id}
              handleSelect={handleSelect}
              selected={isSelected}
              name={item.name}
              address={item.address}
              completed={isCompleted}
              status={item.status}
            />
          );
        })}

        {/* 하단 버튼 */}
      </ScrollView>
      <CustomButton
        onPress={goToEstimateDetail}
        style={[
          styles.submitButton,
          selectedId ? styles.submitButtonEnabled : styles.submitButtonDisabled,
        ]}
        disabled={!selectedId}>
        <Typo style={styles.submitButtonText}>출동신청</Typo>
      </CustomButton>
    </DefaultLayout>
  );
};

export default ClientEstimatePage;

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    padding: 16,
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 14,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  submitButtonEnabled: {
    backgroundColor: '#4F7CFF',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
