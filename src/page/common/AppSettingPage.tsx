import {
  useFocusEffect,
  useNavigation,
  useRoute,
  CommonActions,
} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import ManagerLayout from '../../layout/ManagerLayout';
import FuneralLayout from '../../layout/FuneralLayout';
import Typo from '../../components/common/Typo';
import CustomButton from '../../components/common/CustomButton';
import CustomToggle from '../../components/common/CustomToggle';
import DeviceInfo from 'react-native-device-info';
import CheckOnIcon from '../../assets/Check/Check01=Check01_Active.svg';
import CheckOffIcon from '../../assets/Check/Check01=Check01_default.svg';
import {
  managerWithdrawalService,
  funeralWithdrawalService,
} from '../../services/api/withdrawalService';
import {clearTokens, getUserInfo} from '../../utils/tokenStorage';
import SMSInputModal from '../../components/common/SMSInputModal';
import api from '../../api/config';
import {userInfoAtom} from '../../state/local_state/userinfoAtom';
import {useSetAtom} from 'jotai';
import {scaleFontSize, scaleSize, isSmallDevice} from '../../utils/responsive';
import * as notificationApiService from '../../services/notificationService';

interface INotificationSettings {
  appNotification: boolean;
  smsNotification: boolean;
  emailNotification: boolean;
}

const AppSettingPage = () => {
  const navigation = useNavigation();
  const setLogin = useSetAtom(userInfoAtom);
  // StatusBar 색상 변경
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#FFFFFF');
        StatusBar.setBarStyle('dark-content');
      } else {
        StatusBar.setBarStyle('dark-content');
      }
      return () => {
        // 화면 포커스 해제 시 필요하다면 초기화 작업
      };
    }, []),
  );

  // userType 분기 처리
  const route = useRoute();
  const {userType} = route.params as {userType: 'manager' | 'funeral' | 'staff'};

  // 알림 설정 상태 관리
  const [notifications, setNotifications] = useState<INotificationSettings>({
    appNotification: true,
    smsNotification: true,
    emailNotification: false,
  });

  // 컴포넌트 마운트 시 알림 설정 조회
  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        const settings = await notificationApiService.getNotificationSettings();
        setNotifications({
          appNotification: settings.notificationEnabled,
          smsNotification: settings.smsNotificationEnabled,
          emailNotification: false,
        });
      } catch (error) {
        console.error('알림 설정 조회 실패:', error);
      }
    };

    fetchNotificationSettings();
  }, []);

  // 회원탈퇴 동의 체크박스 상태
  const [withdrawalAgreed, setWithdrawalAgreed] = useState(false);

  // SMS 인증 모달 상태
  const [smsModalVisible, setSmsModalVisible] = useState(false);
  const [smsPhoneNumber, setSmsPhoneNumber] = useState('');

  // 앱 버전 가져오기 (라이브러리 설치 후 사용)
  const appVersion = DeviceInfo.getVersion();

  // 토글 변경 핸들러
  const toggleNotification = async (key: keyof INotificationSettings) => {
    try {
      const newValue = !notifications[key];

      // 서버에 업데이트할 설정 객체 생성
      const updateSettings: any = {};

      if (key === 'appNotification') {
        updateSettings.notificationEnabled = newValue;
      } else if (key === 'smsNotification') {
        updateSettings.smsNotificationEnabled = newValue;
      }

      // 앱 알림 또는 SMS 알림 설정인 경우 서버에 업데이트
      if (Object.keys(updateSettings).length > 0) {
        await notificationApiService.updateNotificationSettings(updateSettings);
      }

      // 성공 시 로컬 상태 업데이트
      setNotifications(prev => ({
        ...prev,
        [key]: newValue,
      }));
    } catch (error) {
      console.error('알림 설정 업데이트 실패:', error);
      Alert.alert('오류', '알림 설정 업데이트에 실패했습니다.');
    }
  };

  // 회원탈퇴 동의 체크박스 토글
  const toggleWithdrawalAgreement = () => {
    setWithdrawalAgreed(prev => !prev);
  };

  // 회원탈퇴 핸들러
  const handleWithdraw = async () => {
    if (!withdrawalAgreed) {
      Alert.alert('알림', '회원탈퇴에 동의해주세요.');
      return;
    }

    // 회원탈퇴 서비스 선택
    const withdrawalService =
      userType === 'manager'
        ? managerWithdrawalService
        : funeralWithdrawalService;

    try {
      // 1. 탈퇴 가능 여부 확인
      const eligibilityResult =
        await withdrawalService.checkDeletionEligibility();

      if (!eligibilityResult.data.canDelete) {
        Alert.alert('탈퇴 불가', eligibilityResult.data.message);
        return;
      }

      // 2. 탈퇴 확인 및 SMS 인증 진행
      Alert.alert(
        '회원탈퇴',
        `정말로 탈퇴하시겠습니까?\n${eligibilityResult.data.message}\n${
          eligibilityResult.data.cashMessage || ''
        }`,
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '탈퇴 진행',
            style: 'destructive',
            onPress: () => processSMSAuthentication(),
          },
        ],
      );
    } catch (error: any) {
      console.error('탈퇴 가능 여부 확인 실패:', error);
      Alert.alert('오류', '탈퇴 가능 여부 확인 중 오류가 발생했습니다.');
    }
  };

  // SMS 인증 처리
  const processSMSAuthentication = async () => {
    // 회원탈퇴 서비스 선택
    const withdrawalService =
      userType === 'manager'
        ? managerWithdrawalService
        : funeralWithdrawalService;

    try {
      // SMS 발송
      const smsResult = await withdrawalService.sendVerificationSMS();

      if (smsResult.success) {
        setSmsPhoneNumber(smsResult.phoneNumber || '');
        setSmsModalVisible(true);
      }
    } catch (error: any) {
      console.error('SMS 발송 실패:', error);
      Alert.alert(
        '오류',
        error.response?.data?.message ||
          '인증번호 발송 중 오류가 발생했습니다.',
      );
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      const userInfos = await getUserInfo();
      const deviceId = await DeviceInfo.getUniqueId();
      const response = await api.post('/manager/auth/logout', {
        userId: userInfos?.userId,
        userType: userInfos?.userType,
        deviceId: deviceId,
      });
      if (response.status === 200) {
        // AsyncStorage 정리
        await clearTokens();
        // 로그아웃 로직
        setLogin({
          userType: null,
          isLogin: false,
          userName: '',
          accessToken: '',
          refreshToken: '',
        });
        console.log('Logout');
      }
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }

    // navigation.navigate('ManagerMain');
  };

  // SMS 모달 닫기
  const handleSMSModalClose = () => {
    setSmsModalVisible(false);
    setSmsPhoneNumber('');
  };

  // SMS 인증번호 확인
  const handleSMSConfirm = (smsCode: string) => {
    setSmsModalVisible(false);
    setSmsPhoneNumber('');
    executeWithdrawal(smsCode);
  };

  // 회원탈퇴 실행
  const executeWithdrawal = async (smsCode: string) => {
    // 회원탈퇴 서비스 선택
    const withdrawalService =
      userType === 'manager'
        ? managerWithdrawalService
        : funeralWithdrawalService;

    try {
      const result = await withdrawalService.deleteAccount({smsCode});

      if (result.success) {
        Alert.alert('탈퇴 완료', '회원탈퇴가 완료되었습니다.', [
          {
            text: '확인',
            onPress: async () => {
              // 토큰 삭제 및 로그아웃 처리
              await clearTokens();
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Main'}],
                }),
              );
              console.log('로그아웃 처리 완료');
            },
          },
        ]);
      }
    } catch (error: any) {
      console.error('회원탈퇴 실패:', error);
      Alert.alert(
        '오류',
        error.response?.data?.message || '회원탈퇴 중 오류가 발생했습니다.',
      );
    }
  };

  // 공통 컨텐츠
  const renderContent = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typo style={styles.description}>
          하늘애 앱과 관련된 소식을 알려드립니다.
        </Typo>
      </View>

      {/* 알림 설정 섹션 */}
      <View style={styles.section}>
        <View style={styles.settingItem}>
          <Typo style={styles.settingLabel}>앱 알림</Typo>
          <CustomToggle
            isOn={notifications.appNotification}
            onToggle={() => toggleNotification('appNotification')}
          />
        </View>

        <View style={styles.settingItem}>
          <Typo style={styles.settingLabel}>SMS 알림</Typo>
          <CustomToggle
            isOn={notifications.smsNotification}
            onToggle={() => toggleNotification('smsNotification')}
          />
        </View>

        {/* <View style={styles.settingItem}>
          <Typo style={styles.settingLabel}>이메일 알림</Typo>
          <CustomToggle
            isOn={notifications.emailNotification}
            onToggle={() => toggleNotification('emailNotification')}
          />
        </View> */}
      </View>

      {/* 앱 정보 섹션 */}
      <View style={styles.infoSection}>
        <View style={styles.versionContainer}>
          <Typo style={styles.versionLabel}>앱버전</Typo>
          <Typo style={styles.versionText}>{appVersion}</Typo>
        </View>
        <Typo style={styles.versionSubText}>최신버전 사용중</Typo>
        <View style={styles.logoutContainer}>
          <CustomButton style={styles.logoutButton} onPress={logout}>
            <Typo style={styles.logoutText}>로그아웃</Typo>
          </CustomButton>
        </View>
      </View>

      {/* 회원탈퇴 섹션 - staff가 아닌 경우에만 표시 */}
      {userType !== 'staff' && (
        <View style={styles.withdrawSection}>
          {/* 회원탈퇴 동의 체크박스 */}
          <TouchableOpacity
            style={styles.agreementContainer}
            onPress={toggleWithdrawalAgreement}
            activeOpacity={0.7}>
            {withdrawalAgreed ? (
              <CheckOnIcon width={scaleSize(20)} height={scaleSize(20)} />
            ) : (
              <CheckOffIcon width={scaleSize(20)} height={scaleSize(20)} />
            )}
            <Typo style={styles.agreementText}>회원탈퇴에 동의합니다.</Typo>
          </TouchableOpacity>

          {/* 회원탈퇴 버튼 */}
          <CustomButton
            style={[
              styles.withdrawButton,
              withdrawalAgreed && styles.withdrawButtonActive,
            ]}
            onPress={handleWithdraw}
            disabled={!withdrawalAgreed}>
            <Typo
              style={[
                styles.withdrawText,
                withdrawalAgreed && styles.withdrawTextActive,
              ]}>
              회원탈퇴
            </Typo>
          </CustomButton>
        </View>
      )}
    </View>
  );

  // Layout 분기 처리
  if (userType === 'manager') {
    return (
      <>
        <ManagerLayout headerShown={true} color="#FFFFFF" backIconColor="black">
          {renderContent()}
        </ManagerLayout>
        <SMSInputModal
          visible={smsModalVisible}
          onClose={handleSMSModalClose}
          onConfirm={handleSMSConfirm}
          phoneNumber={smsPhoneNumber}
        />
      </>
    );
  } else {
    return (
      <>
        <FuneralLayout
          headerShown={true}
          headerColor="white"
          color="white"
          backButtonVisible={true}
          top={true}>
          {renderContent()}
        </FuneralLayout>
        <SMSInputModal
          visible={smsModalVisible}
          onClose={handleSMSModalClose}
          onConfirm={handleSMSConfirm}
          phoneNumber={smsPhoneNumber}
        />
      </>
    );
  }
};

export default AppSettingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: scaleSize(20),
  },
  header: {
    marginBottom: scaleSize(32),
    paddingHorizontal: scaleSize(16),
  },
  description: {
    fontSize: scaleFontSize(16),
    color: '#6F717D',
    fontWeight: '600',
    fontFamily: 'Pretendard-Medium',
  },
  section: {
    backgroundColor: '#FFFFFF',
    paddingVertical: scaleSize(8),
    marginBottom: scaleSize(20),
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(205, 209, 215, 0.25)',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: scaleSize(8),
    paddingHorizontal: scaleSize(16),
    marginBottom: scaleSize(20),
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(16),
    alignItems: 'center',
    paddingVertical: scaleSize(20),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  settingLabel: {
    fontSize: scaleFontSize(isSmallDevice ? 14 : 16),
    fontWeight: '600',
    color: '#283042',
    fontFamily: 'Pretendard-Medium',
  },
  versionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scaleSize(20),
  },
  versionLabel: {
    fontSize: scaleFontSize(isSmallDevice ? 14 : 16),
    fontWeight: '600',
    color: '#283042',
    fontFamily: 'Pretendard-Medium',
  },
  versionText: {
    fontSize: scaleFontSize(isSmallDevice ? 14 : 16),
    fontWeight: '600',
    color: '#3287F8',
    fontFamily: 'Pretendard-Medium',
  },
  versionSubText: {
    fontSize: scaleFontSize(14),
    color: '#8990A0',
    fontWeight: '400',
    fontFamily: 'Pretendard-Regular',
    textAlign: 'center',
    paddingBottom: scaleSize(16),
  },
  logoutContainer: {
    // paddingHorizontal: 16,
  },
  logoutButton: {
    backgroundColor: '#8990A0',
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium',
  },
  withdrawSection: {
    marginTop: 'auto',
    paddingBottom: scaleSize(40),
    paddingHorizontal: scaleSize(16),
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaleSize(20),
    paddingVertical: scaleSize(10),
  },
  agreementText: {
    fontSize: scaleFontSize(14),
    fontWeight: '500',
    color: '#283042',
    fontFamily: 'Pretendard-Medium',
    marginLeft: scaleSize(8),
  },
  withdrawButton: {
    backgroundColor: 'rgba(205, 209, 215, 0.25)',
    borderRadius: scaleSize(10),
    paddingVertical: scaleSize(18),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6EAF3',
  },
  withdrawButtonActive: {
    backgroundColor: '#F04452',
    borderColor: '#F04452',
  },
  withdrawText: {
    fontSize: scaleFontSize(isSmallDevice ? 14 : 16),
    fontWeight: '600',
    color: 'rgba(137, 144, 160, 0.75)',
    fontFamily: 'Pretendard-Medium',
  },
  withdrawTextActive: {
    color: '#FFFFFF',
  },
});
