import React, {useCallback, useEffect, useState} from 'react';
import {NavigationProp, useFocusEffect} from '@react-navigation/native';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import Typo from '../../components/common/Typo';
import {useAtomValue} from 'jotai';
import {userInfoAtom} from '../../state/local_state/userinfoAtom';
import api from '../../api/config';
import MoveGrayIcon from '../../assets/Button/Button_MoveOff.svg';

interface INotice {
  noticeId: string;
  title: string;
  content: string;
  isVisible: boolean;
  userType: 'manager' | 'funeral' | 'all';
  createdAt: string;
  updatedAt: string;
}

interface INoticePageProps {
  navigation: NavigationProp<any>;
}

const NoticePage = ({navigation}: INoticePageProps) => {
  const userInfo = useAtomValue(userInfoAtom);
  const [notices, setNotices] = useState<INotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#3287F8');
        StatusBar.setBarStyle('light-content');
      } else {
        StatusBar.setBarStyle('light-content');
      }
    }, []),
  );

  const fetchNotices = useCallback(async () => {
    try {
      setLoading(true);
      // 사용자 타입에 따라 공지사항 필터링
      const userType = userInfo.userType || 'all';
      const response = await api.get('/common/notice/list', {
        params: {type: userType},
      });

      if (response.data?.data) {
        setNotices(response.data.data);
      }
    } catch (error) {
      console.error('공지사항 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [userInfo.userType]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotices();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchNotices();
  }, [userInfo.userType, fetchNotices]);

  const goToNoticeDetail = (noticeId: string) => {
    navigation.navigate('NoticeDetail', {noticeId});
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getUserTypeText = (userType: string) => {
    switch (userType) {
      case 'manager':
        return '상조팀장';
      case 'funeral':
        return '장례식장';
      case 'all':
        return '전체';
      default:
        return '전체';
    }
  };

  return (
    <DefaultLayout
      color="white"
      headerShown={true}
      headerTitle="공지사항"
      homeButton={true}
      homeRouteName="Main">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Typo style={styles.loadingText}>공지사항을 불러오는 중...</Typo>
          </View>
        ) : notices.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Typo style={styles.emptyText}>등록된 공지사항이 없습니다.</Typo>
          </View>
        ) : (
          <View style={styles.noticeList}>
            {notices.map(notice => (
              <TouchableOpacity
                key={notice.noticeId}
                style={styles.noticeItem}
                onPress={() => goToNoticeDetail(notice.noticeId)}
                activeOpacity={0.7}>
                <View style={styles.noticeHeader}>
                  <View style={styles.noticeInfo}>
                    <Typo style={styles.noticeTitle} numberOfLines={2}>
                      {notice.title}
                    </Typo>
                    <View style={styles.noticeMeta}>
                      <View style={styles.userTypeBadge}>
                        <Typo style={styles.userTypeText}>
                          {getUserTypeText(notice.userType)}
                        </Typo>
                      </View>
                      <Typo style={styles.noticeDate}>
                        {formatDate(notice.createdAt)}
                      </Typo>
                    </View>
                  </View>
                  <MoveGrayIcon width={20} height={20} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </DefaultLayout>
  );
};

export default NoticePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  noticeList: {
    gap: 12,
  },
  noticeItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noticeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  noticeInfo: {
    flex: 1,
    marginRight: 12,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  noticeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userTypeBadge: {
    backgroundColor: '#3287F8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  userTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  noticeDate: {
    fontSize: 14,
    color: '#666',
  },
});
