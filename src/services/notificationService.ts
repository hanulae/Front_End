import notifee, {EventType, AndroidImportance} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import api from '../api/config';
import {getNavigationTarget} from './api/notificationService';
// Navigation types removed as they're not used directly here
import {navigationRef} from '../util/navigationRef';

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
}

// 전역 상태 - 단순하게 관리
let fcmToken: string | null = null;
// let navigationRef: any = null;
let isInitialized = false;

// 전역 중복 처리 방지
if (!(global as any).notificationHandlers) {
  (global as any).notificationHandlers = {
    isProcessing: false,
    lastProcessedId: '',
    lastProcessedTime: 0,
  };
}

/**
 * 알림 서비스 초기화
 */
export const initialize = async (): Promise<void> => {
  if (isInitialized) {
    console.log('이미 초기화되어 있습니다.');
    return;
  }

  try {
    console.log('=== 알림 서비스 초기화 시작 ===');
    console.log('(권한 요청은 App.tsx에서 이미 완료됨)');

    // FCM 토큰 획득
    fcmToken = await messaging().getToken();
    console.log('✅ FCM 토큰 획득:', fcmToken);

    // 포그라운드 핸들러 설정
    setupForegroundHandler();
    console.log('✅ 포그라운드 핸들러 설정 완료');

    // 백그라운드 핸들러 설정
    setupBackgroundHandler();
    console.log('✅ 백그라운드 핸들러 설정 완료');

    isInitialized = true;
    console.log('=== 알림 서비스 초기화 완료 ===');
  } catch (error) {
    console.error('알림 서비스 초기화 실패:', error);
    throw error;
  }
};

/**
 * FCM 토큰 획득
 */
export const getFCMToken = async (): Promise<string | null> => {
  try {
    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      console.log('FCM 토큰 재획득:', fcmToken);
    }
    return fcmToken;
  } catch (error) {
    console.error('FCM 토큰 획득 실패:', error);
    return null;
  }
};

/**
 * FCM 토큰을 백엔드로 등록
 */
export const registerFCMTokenToServer = async (): Promise<boolean> => {
  try {
    const token = await getFCMToken();
    if (!token) {
      console.log('FCM 토큰이 없어서 등록을 건너뜁니다.');
      return false;
    }

    // react-native-device-info를 사용하여 고유한 기기 ID 생성
    let deviceId: string;
    try {
      // 먼저 고유 ID를 시도
      deviceId = await DeviceInfo.getUniqueId();
      console.log('기기 고유 ID 획득:', deviceId);
    } catch {
      // 고유 ID 실패 시 기기 ID를 시도
      try {
        deviceId = await DeviceInfo.getDeviceId();
        console.log('기기 ID 획득:', deviceId);
      } catch {
        // 모든 방법 실패 시 임시 ID 생성
        deviceId = `device_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        console.log('임시 기기 ID 생성:', deviceId);
      }
    }

    console.log('기기 ID:', deviceId);
    console.log('기기 타입:', Platform.OS);

    console.log('FCM 토큰 백엔드 등록 시작:', token);

    const response = await api.post('/common/notification/fcm/token', {
      fcmToken: token,
      deviceId: deviceId,
      deviceType: Platform.OS, // 'ios' 또는 'android'
    });
    console.log('FCM 토큰 백엔드 등록 응답:', response);

    if (response.data.data.success) {
      console.log('FCM 토큰 백엔드 등록 성공');
      return true;
    } else {
      console.log('FCM 토큰 백엔드 등록 실패:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('FCM 토큰 백엔드 등록 중 오류:', error);
    return false;
  }
};

/**
 * 현재 FCM 토큰 반환
 */
export const getCurrentToken = (): string | null => {
  return fcmToken;
};

/**
 * 로컬 알림 표시
 */
export const showLocalNotification = async (
  notification: NotificationData,
): Promise<string> => {
  try {
    console.log('로컬 알림 표시 시작:', notification);

    // 알림 채널 생성
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    // 알림 표시
    const notificationId = await notifee.displayNotification({
      title: notification.title,
      body: notification.body,
      data: notification.data,
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
        sound: 'default', // ✅ Android도 소리 추가
      },
      ios: {
        sound: 'default', // ✅ iOS도 소리 추가
      },
    });

    console.log('로컬 알림 표시 완료, ID:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('로컬 알림 표시 실패:', error);
    throw error;
  }
};

/**
 * 즉시 알림 표시 (포그라운드에서도 표시)
 */
export const showImmediateNotification = async (
  notification: NotificationData,
): Promise<string> => {
  try {
    console.log('즉시 알림 표시 시작:', notification);

    // 알림 채널 생성
    const channelId = await notifee.createChannel({
      id: 'immediate',
      name: 'Immediate Channel',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });

    // 알림 표시
    const notificationId = await notifee.displayNotification({
      title: notification.title,
      body: notification.body,
      data: notification.data,
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
        sound: 'default',
      },
    });

    console.log('즉시 알림 표시 완료, ID:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('즉시 알림 표시 실패:', error);
    throw error;
  }
};

/**
 * 예약 알림 설정
 */
export const scheduleNotification = async (
  notification: NotificationData,
  trigger: {
    date?: Date;
    seconds?: number;
  },
): Promise<string> => {
  try {
    console.log('예약 알림 설정 시작:', notification, trigger);

    // 알림 채널 생성
    const channelId = await notifee.createChannel({
      id: 'scheduled',
      name: 'Scheduled Channel',
      importance: AndroidImportance.HIGH,
    });

    // 트리거 설정
    const triggerConfig: any = {};
    if (trigger.date) {
      triggerConfig.timestamp = trigger.date.getTime();
    } else if (trigger.seconds) {
      triggerConfig.timestamp = Date.now() + trigger.seconds * 1000;
    }

    // 예약 알림 설정
    const notificationId = await notifee.createTriggerNotification(
      {
        title: notification.title,
        body: notification.body,
        data: notification.data,
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
      },
      triggerConfig,
    );

    console.log('예약 알림 설정 완료, ID:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('예약 알림 설정 실패:', error);
    throw error;
  }
};

/**
 * 포그라운드 핸들러 설정
 */
const setupForegroundHandler = (): void => {
  messaging().onMessage(async (remoteMessage: any) => {
    console.log('포그라운드에서 FCM 메시지 수신:', remoteMessage);

    // 포그라운드에서도 로컬 알림 생성
    if (remoteMessage.notification) {
      const notificationId = remoteMessage.data?.id || Date.now().toString();
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
      await notifee.displayNotification({
        id: notificationId,
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        data: remoteMessage.data,
        android: {
          channelId: channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
          foregroundPresentationOptions: {
            badge: true,
            sound: true,
            banner: true,
            list: true,
          },
        },
      });

      console.log('포그라운드에서 로컬 알림 생성 완료:', notificationId);
    }

    console.log('포그라운드 메시지 처리 완료');
  });
};

/**
 * 백그라운드 핸들러 설정
 */
const setupBackgroundHandler = (): void => {
  messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
    console.log('백그라운드에서 FCM 메시지 수신:', remoteMessage);

    // 백그라운드에서는 로컬 알림 표시
    if (remoteMessage.notification) {
      await showLocalNotification({
        title: remoteMessage.notification.title || '새 알림',
        body: remoteMessage.notification.body || '',
        data: remoteMessage.data,
      });
    }

    console.log('백그라운드 메시지 처리 완료');
  });
};

/**
 * 알림 이벤트 리스너 설정
 */
export const setupNotificationListeners = (): void => {
  console.log('=== 알림 이벤트 리스너 설정 시작 ===');
  console.log('네비게이션 참조 존재:', !!navigationRef);
  console.log('네비게이션 current 존재:', !!navigationRef?.current);
  console.log('네비게이션 준비 상태:', navigationRef?.current?.isReady());

  // 포그라운드 이벤트 리스너
  notifee.onForegroundEvent(({type, detail}) => {
    if (type === EventType.PRESS) {
      console.log('detail', detail);
      console.log('=== 포그라운드 알림 터치 ===');
      console.log('알림 데이터:', detail.notification);
      handleNotificationPress(detail.notification);
    }
  });

  // 백그라운드 이벤트 리스너
  notifee.onBackgroundEvent(async ({type, detail}) => {
    if (type === EventType.PRESS) {
      console.log('=== 백그라운드 알림 터치 ===');
      console.log('알림 데이터:', detail.notification);
      handleNotificationPress(detail.notification);
    }
  });

  console.log('=== 알림 이벤트 리스너 설정 완료 ===');
};

/**
 * 알림 클릭 시 네비게이션 처리
 */
const handleNotificationPress = async (notification: any): Promise<void> => {
  // 여기서 notification은 포그라운드 이벤트 리스너에서 호출 시 파라미터인 detail.notification 임.
  // 강력한 중복 처리 방지
  const currentTime = Date.now();
  const notificationId =
    notification?.data?.notificationId || notification?.id || '';

  if ((global as any).notificationHandlers.isProcessing) {
    console.log('이미 처리 중인 알림이 있습니다. 중복 처리 방지.');
    return;
  }

  if (
    (global as any).notificationHandlers.lastProcessedId === notificationId &&
    currentTime - (global as any).notificationHandlers.lastProcessedTime < 2000
  ) {
    console.log('2초 내 같은 알림 처리 방지:', notificationId);
    return;
  }

  // 처리 시작
  (global as any).notificationHandlers.isProcessing = true;
  (global as any).notificationHandlers.lastProcessedId = notificationId;
  (global as any).notificationHandlers.lastProcessedTime = currentTime;

  try {
    console.log('=== 알림 클릭 처리 시작 ===');
    // console.log('알림 ID:', notificationId);
    console.log(
      '알림 데이터123123123:',
      JSON.stringify(notification?.data, null, 2),
    );

    // 알림 읽음 처리
    if (notification?.data) {
      console.log('노티피케이션아이디', notification.data.notificationId);
      console.log('알림 읽음 여부', notification.data.isRead);
      try {
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(notification.data.notificationId)) {
          await handleNotificationRead(
            notification.data.notificationId,
            notification.data.isRead,
          );
          console.log('알림 읽음 처리 완료');
        }
      } catch (error) {
        console.error('알림 읽음 처리 실패:', error);
      }
    }

    // 네비게이션 처리
    const notificationType = notification?.data?.notificationType;
    const notificationData = notification;

    console.log('알림 타입:', notificationType);
    console.log('알림 데이터:', notificationData);

    if (notificationType && notificationData) {
      console.log('네비게이션 타겟 확인 시작');
      const navigationTarget = getNavigationTarget(
        notificationType,
        notificationData,
      );
      console.log('네비게이션 타겟:', navigationTarget);

      if (navigationTarget) {
        // 네비게이션 실행 - 포그라운드에서는 즉시 실행
        console.log('네비게이션 실행 시작');
        await executeNavigation(navigationTarget);
      } else {
        console.log('네비게이션 타겟이 없습니다.');
      }
    } else {
      console.log('알림 타입 또는 데이터가 없습니다.');
      console.log('사용 가능한 데이터:', Object.keys(notification?.data || {}));
    }

    console.log('=== 알림 클릭 처리 완료 ===');
  } catch (error) {
    console.error('알림 클릭 처리 중 오류:', error);
  } finally {
    // 처리 완료
    (global as any).notificationHandlers.isProcessing = false;
  }
};

/**
 * 네비게이션 실행
 */
const executeNavigation = async (navigationTarget: any): Promise<void> => {
  try {
    console.log('네비게이션 실행 시작');
    console.log('대상 화면:', navigationTarget.screen);
    console.log('대상 파라미터:', navigationTarget.params);
    console.log('네비게이션 참조 존재:', !!navigationRef);
    console.log('네비게이션 current 존재:', !!navigationRef?.current);

    // 네비게이션이 준비될 때까지 대기
    let attempts = 0;
    const maxAttempts = 60; // 30초 대기
    const waitTime = 500; // 0.5초씩 대기

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`네비게이션 준비 확인 ${attempts}/${maxAttempts}`);

      // 네비게이션 참조와 current 상태 확인
      if (
        navigationRef &&
        navigationRef.current &&
        navigationRef.current.isReady()
      ) {
        console.log('네비게이션이 준비되었습니다.');

        // 짧은 지연 후 네비게이션 실행 (React Native 렌더링 완료 대기)
        // setTimeout(() => {
        //   try {
        //     if (navigationRef.current && navigationRef.current.isReady()) {
        //       navigationRef.current.navigate(
        //         navigationTarget.screen,
        //         navigationTarget.params,
        //       );
        //       console.log('네비게이션 실행 완료:', navigationTarget.screen);
        //     } else {
        //       console.log('네비게이션 실행 시점에 준비되지 않음');
        //     }
        //   } catch (navError) {
        //     console.error('네비게이션 실행 중 오류:', navError);
        //   }
        // }, 100);

        if (navigationRef.current && navigationRef.current.isReady()) {
          navigationRef.current.navigate(
            navigationTarget.screen,
            navigationTarget.params,
          );
          console.log('네비게이션 실행 완료:', navigationTarget.screen);
        } else {
          console.log('네비게이션 준비 안됨 → 최대 30초 대기');
          // while-loop으로 최대 30초 대기 로직을 이미 구현하신 상태이므로 그 안에서 navigate 실행
        }

        return;
      }

      // 0.5초 대기
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    console.log('네비게이션 준비 시간 초과');
  } catch (error) {
    console.error('네비게이션 실행 중 오류:', error);
  }
};

/**
 * 알림 읽음 처리 함수
 * 알림을 읽고, notificationIsRead 로 배지 카운트 감소 여부를 결정해서 처리.
 */
export const handleNotificationRead = async (
  notificationId: string,
  IsRead: boolean,
) => {
  try {
    if (!IsRead) {
      await api.put(`/common/notification/${notificationId}/read`);
      await notifee.decrementBadgeCount();
    } else {
      await api.put(`/common/notification/${notificationId}/read`);
    }
  } catch (error) {
    console.error('알림 읽음 처리 실패:', error);
  }
};

/**
 * 모든 알림 취소
 */
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await notifee.cancelAllNotifications();
    console.log('모든 알림 취소됨');
  } catch (error) {
    console.error('알림 취소 실패:', error);
  }
};

/**
 * 특정 알림 취소
 */
export const cancelNotification = async (
  notificationId: string,
): Promise<void> => {
  try {
    await notifee.cancelNotification(notificationId);
    console.log('알림 취소됨:', notificationId);
  } catch (error) {
    console.error('알림 취소 실패:', error);
  }
};

/**
 * 예약된 알림 취소
 */
export const cancelTriggerNotification = async (
  notificationId: string,
): Promise<void> => {
  try {
    await notifee.cancelTriggerNotification(notificationId);
    console.log('예약 알림 취소됨:', notificationId);
  } catch (error) {
    console.error('예약 알림 취소 실패:', error);
  }
};

// 기본 내보내기 객체 (기존 코드와의 호환성을 위해)
const notificationService = {
  initialize,
  getFCMToken,
  registerFCMTokenToServer,
  getCurrentToken,
  showLocalNotification,
  showImmediateNotification,
  scheduleNotification,
  setupNotificationListeners,
  cancelAllNotifications,
  cancelNotification,
  cancelTriggerNotification,
};

export default notificationService;
