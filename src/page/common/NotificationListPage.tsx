import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getUserInfo, UserInfo} from '../../utils/tokenStorage';
import {
  getNavigationTarget,
  notificationApiService,
  NotificationItem,
} from '../../services/api/notificationService';
import NotificationCard from '../../components/common/NotificationCard';
import api from '../../api/config';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface NotificationListPageProps {
  variant: 'manager' | 'funeralHall';
}

const NotificationListPage = (_props: NotificationListPageProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
  const navigation = useNavigation();

  // 컴포넌트 마운트 시 한 번만 실행
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const info = await getUserInfo();
        setUserInfo(info);
      } catch (err) {
        console.error('사용자 정보 로드 실패:', err);
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
          setNotifications(response.rows || []);
        } catch (err: any) {
          console.error('알림 목록 조회 실패:', err);
          setError(err.message || '알림 목록을 불러오는데 실패했습니다.');
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
    }, []),
  );

  const handleNotificationPress = async (item: NotificationItem) => {
    try {
      console.log('알림 클릭 - 타입:', item.notificationType);
      console.log('알림 클릭 - 데이터:', item.data);
      console.log('수신자 타입:', item.receiverType);

      // getNavigationTarget을 기반으로 네비게이션 처리
      const navigationTarget = getNavigationTarget(item.notificationType, item);
      console.log('네비게이션 타겟:', navigationTarget);
      const response = await api.put(
        `/common/notification/${item.notificationId}/read`,
      );
      console.log('알림 읽음 처리 결과:', response);
      if (response.status === 200) {
        if (navigationTarget) {
          // getNavigationTarget에서 반환된 screen과 params로 직접 네비게이션
          navigation.navigate(navigationTarget.screen, navigationTarget.params);

          // 알림 읽음 처리 (선택사항)
          // notificationApiService.markNotificationAsRead(item.notificationId);
        } else {
          console.log(
            '해당 알림 타입에 대한 네비게이션 타겟이 없습니다:',
            item.notificationType,
          );
        }
      }
    } catch (error) {
      console.error('알림 클릭 처리 중 오류:', error);
    }
  };

  console.log('userInfo', userInfo);
  console.log('알림개수', notifications.length);
  console.log('notifications', notifications);
  // 모든 알림 읽음 처리
  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAllAsRead(true);
      await notificationApiService.markAllNotificationsAsRead();

      // 로컬 상태 업데이트
      setNotifications(prev =>
        prev.map(notification => ({
          ...notification,
          isRead: true,
        })),
      );

      console.log('모든 알림 읽음 처리 완료');
    } catch (err: any) {
      console.error('모든 알림 읽음 처리 실패:', err);
      // 에러 처리 (필요시 토스트 메시지 등 추가)
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  // 읽지 않은 알림 개수 계산
  const unreadCount = notifications.filter(
    notification => !notification.isRead,
  ).length;
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
    <NotificationCard
      item={item}
      onPress={() => handleNotificationPress(item)}
    />
  );

  return (
    <DefaultLayout
      headerShown={true}
      headerTitle="알림"
      homeButton={true}
      homeRouteName={
        userInfo?.userType === 'manager' ? 'ManagerMain' : 'FuneralMain'
      }>
      {unreadCount > 0 && (
        <View style={styles.headerButtonContainer}>
          <TouchableOpacity
            style={[
              styles.markAllReadButton,
              markingAllAsRead && styles.markingAllAsReadButton,
            ]}
            onPress={handleMarkAllAsRead}
            disabled={markingAllAsRead}>
            <Text style={styles.markAllReadButtonText}>
              {markingAllAsRead
                ? '처리 중...'
                : `모든 알림 읽음 처리 (${unreadCount}개)`}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.notificationId}
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
  headerButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  markAllReadButton: {
    backgroundColor: '#397CFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  markingAllAsReadButton: {
    backgroundColor: '#BDBDBD',
  },
  markAllReadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default NotificationListPage;
