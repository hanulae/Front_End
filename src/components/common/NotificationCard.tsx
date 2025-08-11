import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import AlarmIconOn from '../../assets/Contents/Contents_AlarmOn.svg';
import AlarmIconOff from '../../assets/Contents/Contents_AlarmOff.svg';

/**
 * 알림 카드 컴포넌트
 *
 * 목적:
 * - 알림 목록에서 각 알림 항목을 카드 형태로 렌더링
 * - 읽음/안읽음 상태에 따라 아이콘/스타일 분기
 * - 눌렀을 때 onPress 콜백 실행
 *
 * 주요 포인트:
 * - 상대 시간 문자열(getTimeAgo)로 생성일 표기
 * - 알림 타입(notificationType)에 따른 스타일 분류 함수 사용
 */
export interface NotificationItem {
  notificationId: string;
  title: string;
  body: string;
  sentAt: string;
  isRead: boolean;
  notificationType: string;
  data?: any;
  createdAt?: string;
  updatedAt?: string;
  readAt?: string | null;
  receiverId?: string;
  receiverType?: string;
  senderId?: string;
  senderType?: string;
}

/**
 * NotificationCard Props
 * @param item - 알림 데이터
 * @param onPress - 카드 클릭 콜백
 */
interface NotificationCardProps {
  item: NotificationItem;
  onPress?: () => void;
}

/**
 * 상대적인 시간 계산 함수
 * 예: "12분 전", "3일 전" 등
 */
const getTimeAgo = (sentAt: string): string => {
  const now = new Date();
  const createdAt = new Date(sentAt);
  const diff = now.getTime() - createdAt.getTime(); // 밀리초 단위

  let timeAgo: string;

  if (diff < 60 * 1000) {
    timeAgo = `${Math.floor(diff / 1000)}초 전`;
  } else if (diff < 3600 * 1000) {
    timeAgo = `${Math.floor(diff / (60 * 1000))}분 전`;
  } else if (diff < 86400 * 1000) {
    timeAgo = `${Math.floor(diff / (3600 * 1000))}시간 전`;
  } else if (diff < 604800 * 1000) {
    timeAgo = `${Math.floor(diff / (86400 * 1000))}일 전`;
  } else if (diff < 2419200 * 1000) {
    timeAgo = `${Math.floor(diff / (604800 * 1000))}주 전`;
  } else if (diff < 29030400 * 1000) {
    timeAgo = `${Math.floor(diff / (2419200 * 1000))}개월 전`;
  } else {
    timeAgo = `${Math.floor(diff / (29030400 * 1000))}년 전`;
  }

  return timeAgo;
};

/**
 * 알림 타입 분류 및 스타일 정의
 * - 배경/테두리/아이콘 색상/카테고리 텍스트 결정
 */
const getNotificationStyle = (type: string) => {
  switch (type) {
    // 견적/입찰 관련 (파란색 계열)
    case 'manager_form_created':
    case 'bid_submitted':
      return {
        backgroundColor: '#E3F2FD',
        borderColor: '#2196F3',
        iconColor: '#1976D2',
        category: '견적/입찰',
      };

    // 출동 관련 (주황색 계열)
    case 'dispatch_requested':
    case 'dispatch_approved':
    case 'dispatch_cancelled':
    case 'dispatch_rejected':
      return {
        backgroundColor: '#FFF3E0',
        borderColor: '#FF9800',
        iconColor: '#F57C00',
        category: '출동',
      };

    // 거래 완료 (초록색 계열)
    case 'transaction_completed':
      return {
        backgroundColor: '#E8F5E8',
        borderColor: '#4CAF50',
        iconColor: '#388E3C',
        category: '거래',
      };

    // 환급 관련 (보라색 계열)
    case 'cash_refund_requested':
    case 'cash_refund_approved':
    case 'cash_refund_rejected':
      return {
        backgroundColor: '#F3E5F5',
        borderColor: '#9C27B0',
        iconColor: '#7B1FA2',
        category: '환급',
      };

    // 시스템 알림 (회색 계열)
    case 'account_approved':
    case 'point_granted':
    case 'cash_granted':
    default:
      return {
        backgroundColor: '#F5F5F5',
        borderColor: '#9E9E9E',
        iconColor: '#757575',
        category: '시스템',
      };
  }
};

const NotificationCard: React.FC<NotificationCardProps> = ({item, onPress}) => {
  /** 알림 타입에 따른 스타일 객체 (필요 시 사용) */
  const style = getNotificationStyle(item.notificationType);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        // {
        //   backgroundColor: item.isRead ? '#F8F9FB' : style.backgroundColor,
        // },
        !item.isRead && styles.unreadContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View style={styles.titleSection}>
            {item.isRead ? (
              <AlarmIconOff width={24} height={24} style={styles.iconStyle} />
            ) : (
              <AlarmIconOn width={24} height={24} style={styles.iconStyle} />
            )}
            <Text style={[styles.title, !item.isRead && styles.unreadTitle]}>
              {item.title}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.content}>{item.body}</Text>
        <Text style={[styles.date, item.isRead === false && styles.unReadDate]}>
          {getTimeAgo(item.sentAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D8D8D8',
    // marginBottom: 12,
    // borderLeftWidth: 4,
  },
  unreadContainer: {
    // elevation: 3,
    // shadowOpacity: 0.15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconStyle: {
    marginRight: 12,
  },
  titleSection: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    // marginBottom: 2,
    lineHeight: 22,
  },
  unreadTitle: {
    color: '#1976D2',
  },
  category: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  contentSection: {
    // marginLeft: 32,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  content: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  unReadDate: {
    color: '#1976D2',
    fontWeight: '500',
  },
});

export default NotificationCard;
