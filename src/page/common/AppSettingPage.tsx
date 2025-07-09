import {useFocusEffect, useRoute} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import {Platform, StatusBar, StyleSheet, View, Alert} from 'react-native';
import ManagerLayout from '../../layout/ManagerLayout';
import FuneralLayout from '../../layout/FuneralLayout';
import Typo from '../../components/common/Typo';
import CustomButton from '../../components/common/CustomButton';
import CustomToggle from '../../components/common/CustomToggle';
import DeviceInfo from 'react-native-device-info';
// import DeviceInfo from 'react-native-device-info'; // 앱 버전용 라이브러리

interface INotificationSettings {
  appNotification: boolean;
  smsNotification: boolean;
  emailNotification: boolean;
}

const AppSettingPage = () => {
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
  const {userType} = route.params as {userType: 'manager' | 'funeral'};

  // 알림 설정 상태 관리
  const [notifications, setNotifications] = useState<INotificationSettings>({
    appNotification: true,
    smsNotification: true,
    emailNotification: false,
  });

  // 앱 버전 가져오기 (라이브러리 설치 후 사용)
  const appVersion = DeviceInfo.getVersion();

  // 토글 변경 핸들러
  const toggleNotification = (key: keyof INotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // 회원탈퇴 핸들러
  const handleWithdraw = () => {
    Alert.alert(
      '회원탈퇴',
      '정말로 탈퇴하시겠습니까?\n탈퇴 시 모든 데이터가 삭제됩니다.',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '탈퇴',
          style: 'destructive',
          onPress: () => {
            // 회원탈퇴 로직 구현
            console.log('회원탈퇴 처리');
          },
        },
      ],
    );
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

        <View style={styles.settingItem}>
          <Typo style={styles.settingLabel}>이메일 알림</Typo>
          <CustomToggle
            isOn={notifications.emailNotification}
            onToggle={() => toggleNotification('emailNotification')}
          />
        </View>
      </View>

      {/* 앱 정보 섹션 */}
      <View style={styles.infoSection}>
        <View style={styles.versionContainer}>
          <Typo style={styles.versionLabel}>앱버전</Typo>
          <Typo style={styles.versionText}>{appVersion}</Typo>
        </View>
        <Typo style={styles.versionSubText}>최신버전 사용중</Typo>
      </View>

      {/* 회원탈퇴 버튼 */}
      <View style={styles.withdrawSection}>
        <CustomButton style={styles.withdrawButton} onPress={handleWithdraw}>
          <Typo style={styles.withdrawText}>회원탈퇴</Typo>
        </CustomButton>
      </View>
    </View>
  );

  // Layout 분기 처리
  if (userType === 'manager') {
    return (
      <ManagerLayout headerShown={true} color="#FFFFFF" backIconColor="black">
        {renderContent()}
      </ManagerLayout>
    );
  } else {
    return (
      <FuneralLayout
        headerShown={true}
        headerColor="white"
        color="white"
        backButtonVisible={true}
        top={true}>
        {renderContent()}
      </FuneralLayout>
    );
  }
};

export default AppSettingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F5F5F5',
    // paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 16,
    color: '#6F717D',
    fontWeight: '600',
    fontFamily: 'Pretendard-Medium',
  },
  section: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    // paddingHorizontal: 20,
    marginBottom: 20,
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(205, 209, 215, 0.25)',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#283042',
    fontFamily: 'Pretendard-Medium',
  },
  versionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#283042',
    fontFamily: 'Pretendard-Medium',
  },
  versionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3287F8',
    fontFamily: 'Pretendard-Medium',
  },
  versionSubText: {
    fontSize: 14,
    color: '#8990A0',
    fontWeight: '400',
    fontFamily: 'Pretendard-Regular',
    textAlign: 'center',
    paddingBottom: 16,
  },
  withdrawSection: {
    marginTop: 'auto',
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  withdrawButton: {
    backgroundColor: 'rgba(205, 209, 215, 0.25)',
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6EAF3',
  },
  withdrawText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(137, 144, 160, 0.75)',
    fontFamily: 'Pretendard-Medium',
  },
});
