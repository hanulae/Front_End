import notifee, {
  AndroidImportance,
  EventType,
  AndroidColor,
} from '@notifee/react-native';
import {
  getMessaging,
  getToken,
  onMessage,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, string>;
}

class NotificationService {
  private fcmToken: string | null = null;

  /**
   * 알림 권한 요청 및 초기화
   */
  async initialize(): Promise<void> {
    try {
      console.log('알림 서비스 초기화 시작...');

      // FCM 자동 초기화 활성화 (공식 문서 방식)
      const messaging = getMessaging();
      messaging.isAutoInitEnabled = true;
      console.log('FCM 자동 초기화 활성화 완료');

      // 기본 알림 권한 요청
      await notifee.requestPermission();
      console.log('기본 알림 권한 요청 완료');

      // FCM 토큰 획득
      try {
        await this.getFCMToken();
      } catch (fcmError) {
        console.error('FCM 토큰 획득 실패, 계속 진행:', fcmError);
      }

      // 포그라운드 메시지 핸들러 설정 (안전하게)
      try {
        this.setupForegroundHandler();
        console.log('포그라운드 핸들러 설정 완료');
      } catch (foregroundError) {
        console.error('포그라운드 핸들러 설정 실패:', foregroundError);
      }

      // 백그라운드 메시지 핸들러 설정 (안전하게)
      try {
        this.setupBackgroundHandler();
        console.log('백그라운드 핸들러 설정 완료');
      } catch (backgroundError) {
        console.error('백그라운드 핸들러 설정 실패:', backgroundError);
      }

      console.log('알림 서비스 초기화 완료');
    } catch (error) {
      console.error('알림 서비스 초기화 실패:', error);
    }
  }

  /**
   * FCM 토큰 획득 (공식 문서 방식)
   */
  async getFCMToken(): Promise<string | null> {
    try {
      console.log('FCM 토큰 획득 시작...');

      // 공식 문서 방식으로 토큰 획득
      const token = await getToken(getMessaging());
      this.fcmToken = token;

      console.log('FCM 토큰 획득 성공:', this.fcmToken);
      return this.fcmToken;
    } catch (error) {
      console.error('FCM 토큰 획득 실패:', error);
      return null;
    }
  }

  /**
   * 현재 FCM 토큰 반환
   */
  getCurrentToken(): string | null {
    return this.fcmToken;
  }

  /**
   * 로컬 알림 표시
   */
  async showLocalNotification(notification: NotificationData): Promise<string> {
    try {
      console.log('로컬 알림 표시 시작:', notification);

      // 알림 데이터 검증
      if (!notification.title || !notification.body) {
        console.warn('알림 제목 또는 내용이 없습니다.');
        return '';
      }

      const channelId = await notifee.createChannel({
        id: 'default',
        name: '기본 알림',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });

      const notificationId = await notifee.displayNotification({
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          color: AndroidColor.BLUE,
          pressAction: {
            id: 'default',
          },
        },
      });

      console.log('로컬 알림 표시됨:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('로컬 알림 표시 실패:', error);
      // 에러를 throw하지 않고 빈 문자열 반환
      return '';
    }
  }

  /**
   * 즉시 알림 표시 (채널 없이)
   */
  async showImmediateNotification(
    notification: NotificationData,
  ): Promise<string> {
    try {
      const notificationId = await notifee.displayNotification({
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        android: {
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
      });

      console.log('즉시 알림 표시됨:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('즉시 알림 표시 실패:', error);
      throw error;
    }
  }

  /**
   * 예약 알림 표시 (간단한 방식)
   */
  async scheduleNotification(
    notification: NotificationData,
    trigger: {
      date?: Date;
      seconds?: number;
    },
  ): Promise<string> {
    try {
      const channelId = await notifee.createChannel({
        id: 'scheduled',
        name: '예약 알림',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });

      // 간단한 setTimeout 방식으로 변경
      if (trigger.seconds) {
        const notificationId = `scheduled_${Date.now()}`;

        setTimeout(async () => {
          try {
            await notifee.displayNotification({
              title: notification.title,
              body: notification.body,
              data: notification.data || {},
              android: {
                channelId,
                importance: AndroidImportance.HIGH,
              },
            });
            console.log('예약 알림 표시됨:', notificationId);
          } catch (error) {
            console.error('예약 알림 표시 실패:', error);
          }
        }, trigger.seconds * 1000);

        console.log('예약 알림 설정됨:', notificationId);
        return notificationId;
      }

      throw new Error('Invalid trigger configuration');
    } catch (error) {
      console.error('예약 알림 설정 실패:', error);
      throw error;
    }
  }

  /**
   * 포그라운드 메시지 핸들러 설정
   */
  private setupForegroundHandler(): void {
    onMessage(getMessaging(), async (remoteMessage: any) => {
      try {
        console.log('포그라운드 메시지 수신:', remoteMessage);

        // 메시지 데이터 검증
        if (!remoteMessage || !remoteMessage.notification) {
          console.log('유효하지 않은 메시지 데이터');
          return;
        }

        // 포그라운드에서 알림 표시 (에러 처리 강화)
        await this.showLocalNotification({
          title: remoteMessage.notification.title || '새 메시지',
          body: remoteMessage.notification.body || '',
          data: remoteMessage.data as Record<string, string>,
        });

        console.log('포그라운드 알림 표시 완료');
      } catch (error) {
        console.error('포그라운드 메시지 처리 실패:', error);
        // 에러가 발생해도 앱이 크래시되지 않도록 함
      }
    });
  }

  /**
   * 백그라운드 메시지 핸들러 설정
   */
  private setupBackgroundHandler(): void {
    setBackgroundMessageHandler(getMessaging(), async (remoteMessage: any) => {
      try {
        console.log('백그라운드 메시지 수신:', remoteMessage);

        // 메시지 데이터 검증
        if (!remoteMessage || !remoteMessage.notification) {
          console.log('유효하지 않은 메시지 데이터');
          return;
        }

        // 백그라운드에서 알림 표시 (에러 처리 강화)
        await this.showLocalNotification({
          title: remoteMessage.notification.title || '새 메시지',
          body: remoteMessage.notification.body || '',
          data: remoteMessage.data as Record<string, string>,
        });

        console.log('백그라운드 알림 표시 완료');
      } catch (error) {
        console.error('백그라운드 메시지 처리 실패:', error);
        // 에러가 발생해도 앱이 크래시되지 않도록 함
      }
    });
  }

  /**
   * 알림 이벤트 리스너 설정
   */
  setupNotificationListeners(): void {
    notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.PRESS:
          console.log('알림 터치됨:', detail.notification);
          // 알림 터치 시 처리 로직
          break;
        case EventType.DISMISSED:
          console.log('알림 닫힘:', detail.notification);
          break;
      }
    });

    notifee.onBackgroundEvent(async ({type, detail}) => {
      switch (type) {
        case EventType.PRESS:
          console.log('백그라운드에서 알림 터치됨:', detail.notification);
          // 백그라운드에서 알림 터치 시 처리 로직
          break;
      }
    });
  }

  /**
   * 모든 알림 취소
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await notifee.cancelAllNotifications();
      console.log('모든 알림 취소됨');
    } catch (error) {
      console.error('알림 취소 실패:', error);
    }
  }

  /**
   * 특정 알림 취소
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await notifee.cancelNotification(notificationId);
      console.log('알림 취소됨:', notificationId);
    } catch (error) {
      console.error('알림 취소 실패:', error);
    }
  }

  /**
   * 예약된 알림 취소
   */
  async cancelTriggerNotification(notificationId: string): Promise<void> {
    try {
      await notifee.cancelTriggerNotification(notificationId);
      console.log('예약 알림 취소됨:', notificationId);
    } catch (error) {
      console.error('예약 알림 취소 실패:', error);
    }
  }
}

// 싱글톤 인스턴스 생성
const notificationService = new NotificationService();

export default notificationService;
