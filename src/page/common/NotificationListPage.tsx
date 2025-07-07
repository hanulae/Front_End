import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import {useNavigation, useRoute} from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface NotificationItem {
  id: string;
  type: 'estimate' | 'dispatch';
  title: string;
  content: string;
  date: string; // ISO or formatted
  isRead: boolean;
  isRecent?: boolean;
}

interface NotificationListPageProps {
  variant: 'manager' | 'funeralHall';
}

// 더미 데이터
const dummyData: NotificationItem[] = [
  {
    id: '1',
    type: 'estimate',
    title: '견적요청',
    content: '김상조 팀장님으로부터 견적요청이 들어왔습니다.',
    date: '1시간전',
    isRead: false,
    isRecent: true,
  },
  {
    id: '2',
    type: 'dispatch',
    title: '출동요청',
    content: '김상조 팀장님으로부터 견적요청이 들어왔습니다.',
    date: '2025년 4월 8일',
    isRead: true,
  },
  {
    id: '3',
    type: 'estimate',
    title: '견적요청',
    content: '김상조 팀장님으로부터 견적요청이 들어왔습니다.',
    date: '2025년 3월 10일',
    isRead: true,
  },
  {
    id: '4',
    type: 'dispatch',
    title: '출동요청',
    content: '김상조 팀장님으로부터 견적요청이 들어왔습니다.',
    date: '2024년 12월 10일',
    isRead: true,
  },
  {
    id: '5',
    type: 'estimate',
    title: '견적요청',
    content: '김상조 팀장님으로부터 견적요청이 들어왔습니다.',
    date: '2024년 4월 8일',
    isRead: true,
  },
];

const NotificationListPage = (props: NotificationListPageProps) => {
  // 네비게이션/route에서 variant를 받을 수도 있음
  const navigation = useNavigation();
  const route = useRoute();
  const variant = (props.variant ||
    (route.params && (route.params as any).variant)) as
    | 'manager'
    | 'funeralHall';

  // variant에 따라 분기할 내용이 있으면 여기에 작성

  const renderItem = ({item}: {item: NotificationItem}) => (
    <View style={[styles.itemContainer, !item.isRead && styles.unreadItem]}>
      <View style={styles.itemLeft}>
        {/* <Icon
          name={item.type === 'estimate' ? 'bell' : 'bell-outline'}
          size={18}
          color={item.isRead ? '#BDBDBD' : '#397CFF'}
          style={{marginRight: 8}}
        /> */}
        <Text style={[styles.itemTitle, !item.isRead && styles.unreadTitle]}>
          {item.title}
        </Text>
      </View>
      <TouchableOpacity>
        {/* <Icon name="close" size={18} color="#BDBDBD" /> */}
      </TouchableOpacity>
      <View style={styles.itemContentWrap}>
        <Text style={styles.itemContent}>{item.content}</Text>
        <Text style={[styles.itemDate, item.isRecent && styles.recentDate]}>
          {item.date}
        </Text>
      </View>
    </View>
  );

  return (
    <DefaultLayout headerShown={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* <Icon name="chevron-left" size={28} color="#222" /> */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>알림</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Main' as never)}>
          {/* <Icon name="home-outline" size={24} color="#222" /> */}
        </TouchableOpacity>
      </View>
      <FlatList
        data={dummyData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{padding: 20}}
        showsVerticalScrollIndicator={false}
      />
    </DefaultLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  itemContainer: {
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    flexDirection: 'column',
    position: 'relative',
  },
  unreadItem: {
    backgroundColor: '#EAF2FF',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  unreadTitle: {
    color: '#397CFF',
  },
  itemContentWrap: {
    marginLeft: 26,
    marginTop: 2,
  },
  itemContent: {
    fontSize: 14,
    color: '#222',
    marginBottom: 6,
  },
  itemDate: {
    fontSize: 12,
    color: '#BDBDBD',
  },
  recentDate: {
    color: '#397CFF',
  },
});

export default NotificationListPage;
