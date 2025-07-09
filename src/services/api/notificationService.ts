import api from '../../api/config';

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

export const getNavigationTarget = (notificationType: string, data: any) => {
  switch (notificationType) {
    // 장레식장
    case 'manager_form_created':
      return {
        screen: 'EstimateHistory',
        params: {
          managerFormId: data.data.managerFormId,
        },
      };
    case 'dispatch_requested':
      return {
        screen: 'PendingDispatch',
      };

    // 상조팀장
    case 'bid_submitted':
      return {
        screen: 'ClientEstimate',
        params: {
          managerFormId: data.data.managerFormId,
        },
      };
    case 'dispatch_approved':
      return {
        screen: 'CallHistory',
      };

    // 공통
    case 'transaction_completed_requested':
      if (data.data.requesterType === 'manager') {
        return {
          screen: 'ConfirmTransaction',
          params: {
            dispatchRequestId: data.data.dispatchRequestId,
          },
        };
      } else {
        return {
          screen: 'ProceedCall',
          params: {
            callId: data.data.dispatchRequestId,
          },
        };
      }
    case 'transaction_completed':
      return {
        screen: 'PointHistory',
        params: {
          variant: data.receiverType,
        },
      };

    default:
      return null;
  }
};

export interface GetNotificationListParams {
  page?: number;
  limit?: number;
  type?: string;
}

export interface GetNotificationListResponse {
  message: string;
  rows: NotificationItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export const notificationApiService = {
  // 알림 목록 조회
  getNotificationList: async (
    params: GetNotificationListParams = {},
  ): Promise<GetNotificationListResponse> => {
    try {
      const response = await api.get('/common/notification/list', {
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          type: params.type || undefined,
        },
      });

      return response.data.data;
    } catch (error: any) {
      console.error('알림 목록 조회 에러:', error.message);
      throw new Error(`알림 목록 조회 에러: ${error.message}`);
    }
  },

  // 알림 읽음 처리
  markNotificationAsRead: async (notificationId: string): Promise<void> => {
    try {
      await api.put(`/common/notification/${notificationId}/read`);
    } catch (error: any) {
      console.error('알림 읽음 처리 에러:', error.message);
      throw new Error(`알림 읽음 처리 에러: ${error.message}`);
    }
  },

  // 알림 삭제
  deleteNotification: async (notificationId: string): Promise<void> => {
    try {
      await api.delete(`/common/notification/delete/${notificationId}`);
    } catch (error: any) {
      console.error('알림 삭제 에러:', error.message);
      throw new Error(`알림 삭제 에러: ${error.message}`);
    }
  },

  // 모든 알림 읽음 처리
  markAllNotificationsAsRead: async (): Promise<void> => {
    try {
      await api.put('/common/notification/read-all');
    } catch (error: any) {
      console.error('모든 알림 읽음 처리 에러:', error.message);
      throw new Error(`모든 알림 읽음 처리 에러: ${error.message}`);
    }
  },
};
