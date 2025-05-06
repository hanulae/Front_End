import {NavigationProp} from '@react-navigation/native';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import {useState} from 'react';
import Typo from '../../components/common/Typo';

interface ICallHistoryPageProps {
  navigation: NavigationProp<any>;
}

const dummyData = [
  {id: 1, name: '김철수 고객님', status: '진행중'},
  {id: 2, name: '김영희 고객님', status: '완료'},
  {id: 3, name: '홍길동 고객님', status: '진행중'},
  {id: 4, name: '금잔디 고객님', status: '완료'},
  {id: 5, name: '김철수 고객님', status: '진행중'},
];

const CallHistoryPage = ({navigation}: ICallHistoryPageProps) => {
  const [selectedTab, setSelectedTab] = useState<'진행중' | '완료'>('진행중');

  const handleCardPress = (item: any) => {
    if (selectedTab === '진행중') {
      navigation.navigate('ProceedCall', {callId: item.id});
    } else {
      console.log('완료된 출동 클릭', item.id);
    }
  };
  return (
    <DefaultLayout
      headerShown={true}
      headerTitle="출동 신청 내역"
      homeButton={true}
      homeRouteName="ManagerMain">
      {/* 탭 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === '진행중' && styles.activeTab,
          ]}
          onPress={() => setSelectedTab('진행중')}>
          <Typo
            style={[
              styles.tabText,
              selectedTab === '진행중' && styles.activeTabText,
            ]}>
            진행중
          </Typo>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === '완료' && styles.activeTab]}
          onPress={() => setSelectedTab('완료')}>
          <Typo
            style={[
              styles.tabText,
              selectedTab === '완료' && styles.activeTabText,
            ]}>
            완료
          </Typo>
        </TouchableOpacity>
      </View>

      {/* 리스트 */}
      <ScrollView contentContainerStyle={styles.wrapper}>
        {dummyData
          .filter(item => item.status === selectedTab)
          .map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => handleCardPress(item)}>
              <Typo style={styles.customerName}>{item.name}</Typo>

              <View style={styles.tag}>
                <Typo style={styles.tagText}>출동신청</Typo>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </DefaultLayout>
  );
};

export default CallHistoryPage;

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    padding: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4F7CFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tag: {
    backgroundColor: '#ffecec',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  tagText: {
    color: '#FF6666',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
