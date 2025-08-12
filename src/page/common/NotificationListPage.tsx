/**
 * 알림 목록을 표시하고 관리하는 페이지 컴포넌트
 * 알림 클릭 시 해당 페이지로 네비게이션하며, 읽음 처리 및 전체 읽음 처리 기능 제공
 *
 * @props variant - 사용자 타입 ('manager' | 'funeralHall')
 * @libraries @react-navigation/native, @notifee/react-native, react-native-toast-message
 */
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getUserInfo, UserInfo} from '../../utils/tokenStorage';
import {
  getNavigationTarget,
  notificationApiService,
  NotificationItem,
} from '../../services/api/notificationService';
import NotificationCard from '../../components/common/NotificationCard';
import notifee from '@notifee/react-native';
import api from '../../api/config';
import {handleNotificationRead} from '../../services/notificationService';
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

  /**
   * 화면 포커스 시 상태바 스타일 설정
   * Android와 iOS의 상태바 색상 및 스타일을 플랫폼별로 적용
   */
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
      };
    }, []),
  );

  /**
   * 사용자 정보 로드
   * 토큰 스토리지에서 사용자 정보를 가져와 상태에 저장
   */
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
  }, []);

  /**
   * 알림 목록 조회 (화면 포커스 시마다 실행)
   * GET /common/notification - 사용자의 알림 목록을 가져오기 위함
   */
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

  /**
   * 알림 클릭 처리
   * 알림을 읽음으로 표시하고 해당 알림의 타입에 따라 적절한 페이지로 네비게이션
   * @param item - 클릭된 알림 아이템
   */
  const handleNotificationPress = async (item: NotificationItem) => {
    try {
      console.log('알림 클릭 - 타입:', item.notificationType);
      console.log('알림 클릭 - 데이터:', item.data);

      // 알림 타입별 네비게이션 타겟 결정
      const navigationTarget = getNavigationTarget(item.notificationType, item);
      console.log('네비게이션 타겟:', navigationTarget);

      // PUT /common/notification/{id}/read - 개별 알림을 읽음 상태로 변경하기 위함
      await handleNotificationRead(item.notificationId, item.isRead);

      // 네비게이션 타겟이 있는 경우 해당 페이지로 이동
      if (navigationTarget) {
        (navigation as any).navigate(
          navigationTarget.screen,
          navigationTarget.params,
        );
      } else {
        console.log(
          '해당 알림 타입에 대한 네비게이션 타겟이 없습니다:',
          item.notificationType,
        );
      }
    } catch (error) {
      console.error('알림 클릭 처리 중 오류:', error);
    }
  };

  /**
   * 모든 알림 읽음 처리
   * 모든 미읽음 알림을 읽음 상태로 변경하고 앱 배지 카운트 초기화
   * POST /common/notification/read-all - 모든 알림을 읽음 상태로 변경하기 위함
   */
  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAllAsRead(true);
      await notificationApiService.markAllNotificationsAsRead();

      // 앱 배지 카운트 초기화
      await notifee.setBadgeCount(0);

      // 로컬 상태 업데이트 - 모든 알림을 읽음 상태로 변경
      setNotifications(prev =>
        prev.map(notification => ({
          ...notification,
          isRead: true,
        })),
      );

      console.log('모든 알림 읽음 처리 완료');
    } catch (err: any) {
      console.error('모든 알림 읽음 처리 실패:', err);
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  // 읽지 않은 알림 개수 계산
  const unreadCount = notifications.filter(
    notification => !notification.isRead,
  ).length;

  // 로딩 상태 처리
  if (loading) {
    return (
      <DefaultLayout headerShown={true} headerTitle="알림" homeButton={true}>
        <View style={styles.loadingContainer}>
          <Text>로딩 중...</Text>
        </View>
      </DefaultLayout>
    );
  }

  // 에러 상태 처리
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

  // 알림이 없는 경우 처리
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

  /**
   * FlatList 아이템 렌더링
   * @param item - 렌더링할 알림 아이템
   * @returns NotificationCard 컴포넌트
   */
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
      color="white"
      homeButton={true}
      homeRouteName={
        userInfo?.userType === 'manager' ? 'ManagerMain' : 'FuneralMain'
      }>
      {/* 읽지 않은 알림이 있는 경우에만 전체 읽음 버튼 표시 */}
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
