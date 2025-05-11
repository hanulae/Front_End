import {NavigationProp} from '@react-navigation/native';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import {useState} from 'react';
import Typo from '../../components/common/Typo';
import ManagerLayout from '../../layout/ManagerLayout';

interface ICallHistoryPageProps {
  navigation: NavigationProp<any>;
}

const dummyData = [
  {id: 1, name: '김철수', status: '진행중'},
  {id: 2, name: '김영희', status: '완료'},
  {id: 3, name: '홍길동', status: '진행중'},
  {id: 4, name: '금잔디', status: '완료'},
  {id: 5, name: '김철수', status: '진행중'},
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
    <ManagerLayout
      headerShown={true}
      color="white"
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
              {/* <Typo style={styles.customerName}>{item.name}</Typo>

              <View style={styles.tag}>
                <Typo style={styles.tagText}>출동신청</Typo>
              </View> */}
              <View style={styles.topRow}>
                <Typo style={styles.clientName}>{item.name}</Typo>
                <Typo style={styles.clientDesc}>고객님</Typo>
              </View>
              <View style={styles.bottomRow}>
                <View style={styles.tag}>
                  <Typo style={styles.tagText}>출동신청</Typo>
                </View>
                <TouchableOpacity
                  style={styles.detailButton}
                  onPress={() => {
                    console.log('상세보기 이동');
                    // navigation.navigate('DetailPage', { id }) 처럼 연결
                  }}>
                  <Typo style={styles.detailText}>상세보기</Typo>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </ManagerLayout>
  );
};

export default CallHistoryPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F6F8',
    paddingHorizontal: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 30,
    backgroundColor: '#F5F6F8',
    paddingBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 18,
    backgroundColor: 'rgba(75, 153, 253, 0.1)',
    borderRadius: 100,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4F7CFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(45, 129, 241, 0.5)',
    fontFamily: 'Pretendard-Light',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    // padding: 16,
    marginBottom: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#eee',
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tag: {
    backgroundColor: 'white',
    borderColor: 'rgba(240, 68, 82, 0.25)',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F04452',
    fontFamily: 'Pretendard-Black',
  },
  topRow: {
    flexDirection: 'row',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },
  clientDesc: {
    fontSize: 18,
    fontWeight: '600',
    color: '#283042',
    fontFamily: 'Pretendard-Medium',
    marginLeft: 8,
  },
  detailButton: {
    // paddingVertical: 4,
    // paddingHorizontal: 8,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6F717D',
    textDecorationLine: 'underline',
    textDecorationColor: '#6F717D',
    fontFamily: 'Pretendard-Black',
  },
});
