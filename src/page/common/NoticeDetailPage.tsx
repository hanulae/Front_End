/**
 * 공지사항 상세보기 페이지 컴포넌트
 * - 특정 공지사항의 상세 내용을 표시
 * - props: _navigation (NavigationProp, 사용되지 않음)
 * - 주요 라이브러리: @react-navigation/native
 */
import React, {useCallback, useEffect, useState} from 'react';
import {
  NavigationProp,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {Platform, StatusBar, StyleSheet, View, ScrollView} from 'react-native';
import DefaultLayout from '../../layout/DefaultLayout';
import Typo from '../../components/common/Typo';
import api from '../../api/config';

interface INotice {
  noticeId: string;
  title: string;
  content: string;
  isVisible: boolean;
  userType: 'manager' | 'funeral' | 'all';
  createdAt: string;
  updatedAt: string;
}

interface INoticeDetailPageProps {
  _navigation: NavigationProp<any>;
}

interface IRouteParams {
  noticeId: string;
}

const NoticeDetailPage = ({_navigation}: INoticeDetailPageProps) => {
  const route = useRoute();
  const {noticeId} = route.params as IRouteParams;
  const [notice, setNotice] = useState<INotice | null>(null);
  const [loading, setLoading] = useState(true);

  // StatusBar 설정 - 화면 포커스 시 파란색 배경에 어두운 콘텐츠 스타일 적용
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#3287F8');
        StatusBar.setBarStyle('dark-content');
      } else {
        StatusBar.setBarStyle('dark-content');
      }
    }, []),
  );

  // 공지사항 상세 정보 조회 - noticeId로 특정 공지사항의 상세 내용 가져오기
  const fetchNoticeDetail = useCallback(async () => {
    try {
      setLoading(true);

      /**
       * API 연동: GET 공지사항 상세 조회
       * - 특정 noticeId에 해당하는 공지사항의 전체 내용을 서버에서 가져옴
       */
      const response = await api.get(`/common/notice/${noticeId}`);

      if (response.data?.data) {
        setNotice(response.data.data);
      }
    } catch (error) {
      console.error('공지사항 상세 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [noticeId]);

  // noticeId 변경 시 상세 정보 재조회
  useEffect(() => {
    if (noticeId) {
      fetchNoticeDetail();
    }
  }, [noticeId, fetchNoticeDetail]);

  // 날짜 포맷팅 - YYYY.MM.DD HH:mm 형식으로 변환
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 사용자 타입 텍스트 변환 - 영문 타입을 한글로 표시
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

  // 로딩 상태 표시
  if (loading) {
    return (
      <DefaultLayout color="#3287F8" headerShown={true} headerTitle="공지사항">
        <View style={styles.loadingContainer}>
          <Typo style={styles.loadingText}>공지사항을 불러오는 중...</Typo>
        </View>
      </DefaultLayout>
    );
  }

  // 공지사항을 찾을 수 없는 경우
  if (!notice) {
    return (
      <DefaultLayout color="#3287F8" headerShown={true} headerTitle="공지사항">
        <View style={styles.errorContainer}>
          <Typo style={styles.errorText}>공지사항을 찾을 수 없습니다.</Typo>
        </View>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout
      color="white"
      headerShown={true}
      headerTitle="공지사항"
      homeButton={true}
      homeRouteName="Notice">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.noticeContainer}>
          <View style={styles.noticeHeader}>
            <Typo style={styles.noticeTitle}>{notice.title}</Typo>
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
          <View style={styles.contentContainer}>
            <Typo style={styles.contentText}>{notice.content}</Typo>
          </View>
        </View>
      </ScrollView>
    </DefaultLayout>
  );
};

export default NoticeDetailPage;

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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  noticeContainer: {
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
    marginBottom: 20,
  },
  noticeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    lineHeight: 28,
    marginBottom: 12,
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
  contentContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 20,
  },
  contentText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});
