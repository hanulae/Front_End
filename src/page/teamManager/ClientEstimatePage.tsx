import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Typo from '../../components/common/Typo';
import {useState} from 'react';
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
    status: '입찰대기',
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
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              style={[
                styles.card,
                isSelected ? styles.cardSelected : styles.cardUnselected,
              ]}
              onPress={() => setSelectedId(item.id)}
              disabled={item.status !== '입찰완료'} // 입찰대기 중이면 클릭 막을 수도 있음 (선택사항)
            >
              <View style={styles.row}>
                <View>
                  <Typo
                    style={[
                      styles.nameText,
                      isSelected && styles.selectedText,
                    ]}>
                    {item.name}
                  </Typo>
                  <Typo style={styles.addressText}>{item.address}</Typo>
                </View>

                <View style={styles.checkWrapper}>
                  <View
                    style={[
                      styles.checkCircle,
                      isSelected
                        ? styles.checkCircleSelected
                        : isCompleted
                        ? styles.checkCircleCompletedOnly
                        : styles.checkCircleUnselected,
                    ]}
                  />
                </View>
              </View>

              <View style={styles.statusButton}>
                <Typo
                  style={[
                    styles.statusButtonText,
                    isCompleted ? styles.statusComplete : styles.statusPending,
                  ]}>
                  {item.status}
                </Typo>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* 하단 버튼 */}
        <TouchableOpacity
          onPress={goToEstimateDetail}
          style={[
            styles.submitButton,
            selectedId
              ? styles.submitButtonEnabled
              : styles.submitButtonDisabled,
          ]}
          disabled={!selectedId}>
          <Typo style={styles.submitButtonText}>출동신청</Typo>
        </TouchableOpacity>
      </ScrollView>
    </DefaultLayout>
  );
};

export default ClientEstimatePage;

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    padding: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardSelected: {
    borderColor: '#4F7CFF',
    backgroundColor: '#eef3ff',
  },
  cardUnselected: {
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  selectedText: {
    color: '#4F7CFF',
  },
  addressText: {
    fontSize: 12,
    color: '#666',
  },
  checkWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  checkCircleSelected: {
    borderColor: '#4F7CFF',
    backgroundColor: '#4F7CFF',
  },
  checkCircleCompletedOnly: {
    borderColor: '#4F7CFF',
    backgroundColor: '#ffffff',
  },
  checkCircleUnselected: {
    borderColor: '#ccc',
    backgroundColor: '#eee',
  },
  statusButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#ddd',
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusComplete: {
    color: '#4F7CFF',
  },
  statusPending: {
    color: '#999',
  },
  submitButton: {
    marginTop: 40,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
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
