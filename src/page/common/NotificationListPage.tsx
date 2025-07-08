import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {getUserInfo, UserInfo} from '../../utils/tokenStorage';
import {
  notificationApiService,
  NotificationItem,
} from '../../services/api/notificationService';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface NotificationListPageProps {
  variant: 'manager' | 'funeralHall';
}

const NotificationListPage = (props: NotificationListPageProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 컴포넌트 마운트 시 한 번만 실행
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const info = await getUserInfo();
        setUserInfo(info);
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, []); // 빈 의존성 배열로 한 번만 실행

  // 알림 목록 조회 (useFocusEffect 사용)
  useFocusEffect(
    useCallback(() => {
      const fetchNotifications = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await notificationApiService.getNotificationList();
          console.log('알림 목록 조회 성공:', response);
          setNotifications(response.data.notifications || []);
        } catch (error: any) {
          console.error('알림 목록 조회 실패:', error);
          setError(error.message || '알림 목록을 불러오는데 실패했습니다.');
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
    }, []),
  );

  console.log('userInfo', userInfo);
  // 네비게이션/route에서 variant를 받을 수도 있음
  const route = useRoute();
  const variant = (props.variant ||
    (route.params && (route.params as any).variant)) as
    | 'manager'
    | 'funeralHall';

  // 로딩 중일 때 표시할 화면
  if (loading) {
    return (
      <DefaultLayout headerShown={true} headerTitle="알림" homeButton={true}>
        <View style={styles.loadingContainer}>
          <Text>로딩 중...</Text>
        </View>
      </DefaultLayout>
    );
  }

  // 에러가 있을 때 표시할 화면
  if (error) {
    return (
      <DefaultLayout
        headerShown={true}
        headerTitle="알림"
        homeButton={true}
        homeRouteName={
          userInfo?.userType === 'manager' ? 'ManagerMain' : 'FuneralMain'
        }>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>알림을 불러올 수 없습니다</Text>
          <Text style={styles.emptySubtitle}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              // 화면에 다시 포커스될 때 자동으로 다시 로드됨
            }}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      </DefaultLayout>
    );
  }

  // 알림이 없을 때 표시할 화면
  if (notifications.length === 0) {
    return (
      <DefaultLayout
        headerShown={true}
        headerTitle="알림"
        homeButton={true}
        homeRouteName={
          userInfo?.userType === 'manager' ? 'ManagerMain' : 'FuneralMain'
        }>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>알림이 없습니다</Text>
          <Text style={styles.emptySubtitle}>
            새로운 알림이 도착하면 여기에 표시됩니다
          </Text>
        </View>
      </DefaultLayout>
    );
  }

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
    <DefaultLayout
      headerShown={true}
      headerTitle="알림"
      homeButton={true}
      homeRouteName={
        userInfo?.userType === 'manager' ? 'ManagerMain' : 'FuneralMain'
      }>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{padding: 20}}
        showsVerticalScrollIndicator={false}
      />
    </DefaultLayout>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#397CFF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
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
