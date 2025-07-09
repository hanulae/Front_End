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
import {useManagerForm} from '../../hooks/useManagerForm';
import {UserManagerFormList} from '../../services/api/manager/managerFormService';

const ClientEstimatePage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  const {managerFormId} = route.params as {managerFormId: string};
  const [selectedId, setSelectedId] = useState<string>('');
  const {getUserManagerFormList, loading, error} = useManagerForm();
  const [userManagerFormList, setUserManagerFormList] = useState<
    UserManagerFormList[]
  >([]);
  const [selectedFuneralName, setSelectedFuneralName] = useState<string>('');
  console.log('managerFormId', managerFormId);
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#3287F8');
        StatusBar.setBarStyle('dark-content');
      } else {
        StatusBar.setBarStyle('dark-content');
      }

      loadUserManagerFormList();

      return () => {
        // 화면 포커스 해제 시 필요하다면 초기화 작업
        // 예: StatusBar.setStyle('default')
      };
    }, []),
  );

  const loadUserManagerFormList = async () => {
    try {
      const result = await getUserManagerFormList(managerFormId);
      if (result) {
        setUserManagerFormList(result);
      }
    } catch (error) {
      console.error('고객 견적서 리스트 로드 실패: ', error);
    }
  };

  // 견적서 선택 (단일 선택)
  const handleSelect = (id: string, funeralName: string) => {
    setSelectedId(id);
    setSelectedFuneralName(funeralName);
  };

  // 견적서 상세 보기
  const goToEstimateDetail = () => {
    navigation.navigate('EstimateDetail', {
      managerFormBidId: selectedId,
      funeralName: selectedFuneralName,
    });
  };

  const getStatusText = (
    status:
      | 'pending'
      | 'bid_submitted'
      | 'bid_selected'
      | 'bid_progress'
      | 'rejected'
      | 'expired'
      | 'transaction_completed',
  ) => {
    switch (status) {
      case 'pending':
        return '입찰대기';
      case 'bid_submitted':
        return '입찰완료';
      case 'bid_selected':
        return '출동신청';
      case 'bid_progress':
        return '출동승인';
      case 'rejected':
        return '입찰실패';
      case 'expired':
        return '입찰만료';
      case 'transaction_completed':
        return '거래완료';
      default:
        return status;
    }
  };

  return (
    <DefaultLayout
      headerShown={true}
      headerTitle="고객 견적서"
      homeButton={true}
      homeRouteName="ManagerMain"
      logoutButton={false}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        {userManagerFormList.map(item => {
          const canSelect = item.bidStatus === 'bid_submitted';
          console.log('item.bidStatus', item.bidStatus);

          return (
            <FuneralQuoteCard
              key={item.managerFormBidId}
              id={item.managerFormBidId}
              handleSelect={
                canSelect
                  ? () => handleSelect(item.managerFormBidId, item.funeralName)
                  : () => {}
              }
              selected={item.managerFormBidId === selectedId}
              name={item.funeralName}
              address={item.funeralAddress}
              completed={!canSelect}
              selectable={canSelect}
              status={getStatusText(item.bidStatus)}
              managerFormId={managerFormId}
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
        <Typo style={styles.submitButtonText}>입찰 상세 보기</Typo>
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
