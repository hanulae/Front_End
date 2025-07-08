import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

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

interface NotificationCardProps {
  item: NotificationItem;
  onPress?: () => void;
}

// 알림 타입 분류 및 스타일 정의
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

// 카테고리별 아이콘 텍스트 (실제 아이콘 라이브러리 사용 시 변경)
const getCategoryIcon = (category: string) => {
  switch (category) {
    case '견적/입찰':
      return '📋';
    case '출동':
      return '🚗';
    case '거래':
      return '✅';
    case '환급':
      return '💰';
    case '시스템':
      return '⚙️';
    default:
      return '🔔';
  }
};

const NotificationCard: React.FC<NotificationCardProps> = ({item, onPress}) => {
  const style = getNotificationStyle(item.notificationType);
  const icon = getCategoryIcon(style.category);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: item.isRead ? '#F8F9FB' : style.backgroundColor,
          borderLeftColor: style.borderColor,
        },
        !item.isRead && styles.unreadContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Text style={[styles.icon, {color: style.iconColor}]}>{icon}</Text>
          <View style={styles.titleSection}>
            <Text style={[styles.title, !item.isRead && styles.unreadTitle]}>
              {item.title}
            </Text>
            <Text style={styles.category}>{style.category}</Text>
          </View>
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.content}>{item.body}</Text>
        <Text style={styles.date}>
          {new Date(item.sentAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  unreadContainer: {
    elevation: 3,
    shadowOpacity: 0.15,
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
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  unreadTitle: {
    color: '#1976D2',
  },
  category: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1976D2',
  },
  contentSection: {
    marginLeft: 32,
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
  },
  recentDate: {
    color: '#1976D2',
    fontWeight: '500',
  },
});

export default NotificationCard;
