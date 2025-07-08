import api from '../../api/config';

export interface NotificationItem {
  id: string;
  type: 'estimate' | 'dispatch' | string;
  title: string;
  content: string;
  date: string;
  isRead: boolean;
  isRecent?: boolean;
}

export interface GetNotificationListParams {
  page?: number;
  limit?: number;
  type?: string;
}

export interface GetNotificationListResponse {
  message: string;
  data: {
    notifications: NotificationItem[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
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

      return response.data;
    } catch (error: any) {
      console.error('알림 목록 조회 에러:', error.message);
      throw new Error(`알림 목록 조회 에러: ${error.message}`);
    }
  },

  // 알림 읽음 처리
  markNotificationAsRead: async (notificationId: string): Promise<void> => {
    try {
      await api.put(`/common/notification/read/${notificationId}`);
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
};
