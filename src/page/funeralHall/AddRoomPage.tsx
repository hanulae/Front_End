import {useRoute, useNavigation} from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import {useEffect, useCallback, useState} from 'react';
import {useInputBase} from '../../hooks/input/useInputBase';
import Typo from '../../components/common/Typo';
import {FuneralInput} from '../../components/common/input/FuneralInput';
import CustomButton from '../../components/common/CustomButton';
import {useFuneralHallInfo} from '../../hooks/useFuneralHallInfo';
import Toast from 'react-native-toast-message';
import {FuneralHallDetail} from '../../services/api/funeral/funeralHallInfoService';
import {scaleFontSize, scaleSize} from '../../utils/responsive';
/**
 * 📌 AddRoomPage
 * - 장례식장 호실(빈소) 정보를 추가/수정/조회하는 페이지
 * - 모드(purpose)에 따라 다음 동작 수행:
 *   - 'add'    : 신규 호실 정보 입력 후 저장
 *   - 'modify' : 기존 호실 정보 수정
 *   - 'detail' : 호실 상세 정보 조회 (읽기 전용)
 *
 * 🔹 주요 사용처:
 *   - 장례식장 관리 > 호실 관리 화면에서 진입
 *
 * 🔹 의존성:
 *   - useFuneralHallInfo(): API 호출 (상세 조회, 추가, 수정)
 *   - useInputBase(): 입력 상태 관리
 *   - FuneralLayout, FuneralInput, CustomButton, Toast
 *
 * 🔹 주의사항:
 *   - 수정 시 version 필드 포함 (동시 수정 충돌 방지)
 *   - iOS/Android 모두 Toast 위치를 상단으로 고정
 *   - 입력값 검증 후에만 API 호출
 */
const AddRoomPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {roomId, roomName, purpose} = route.params as {
    roomId?: string;
    roomName?: string;
    purpose: 'add' | 'modify' | 'detail';
  };

  const {
    loading,
    fetchFuneralHallDetail,
    addFuneralHallInfo,
    updateFuneralHallInfo,
  } = useFuneralHallInfo();

  const room_name = useInputBase();
  const room_space = useInputBase();
  const room_capacity = useInputBase();
  const room_sub_fee = useInputBase();
  const room_main_fee = useInputBase();

  // 호실 상세 정보 상태 (version 정보 포함)
  const [roomDetail, setRoomDetail] = useState<FuneralHallDetail | null>(null);

  const loadRoomDetail = useCallback(async () => {
    try {
      const response = await fetchFuneralHallDetail(roomId!);
      if (response) {
        // 상태에 호실 상세 정보 저장 (version 포함)
        setRoomDetail(response);

        // 폼에 데이터 입력
        room_name.onChangeText(response.funeralHallName || '');
        room_space.onChangeText(response.funeralHallSize?.toString() || '');
        room_capacity.onChangeText(
          response.funeralHallNumberOfMourners?.toString() || '',
        );
        room_sub_fee.onChangeText(
          response.funeralHallDetailPrice?.toString() || '',
        );
        room_main_fee.onChangeText(response.funeralHallPrice?.toString() || '');
      }
    } catch (error) {
      console.error('호실 상세 정보 로드 실패:', error);
      Toast.show({
        type: 'error',
        text1: '데이터 로드 실패',
        text2: '호실 정보를 불러오는데 실패했습니다.',
        position: 'top',
        topOffset: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFuneralHallDetail, roomId]);

  // 📌 페이지 마운트 시, 수정/상세 모드면 기존 호실 데이터 로드
  useEffect(() => {
    if ((purpose === 'modify' || purpose === 'detail') && roomId) {
      /**
       * 📌 loadRoomDetail
       * - API 호출로 특정 호실(roomId)의 상세 정보를 조회
       * - 응답 데이터를 상태(roomDetail)에 저장
       * - 입력 필드(useInputBase)에 초기값 주입
       * @async
       */
      loadRoomDetail();
    }
  }, [purpose, roomId, loadRoomDetail]);

  /**
   * 📌 validateInputs
   * - 필수 입력값(호실명, 평수, 수용인원) 검증
   * - 누락 시 Toast 알림 표시 후 false 반환
   * @returns {boolean}
   */
  const validateInputs = () => {
    if (!room_name.value.trim()) {
      Toast.show({
        type: 'error',
        text1: '입력 오류',
        text2: '호실 이름을 입력해주세요.',
        position: 'top',
        topOffset: 0,
      });
      return false;
    }

    if (!room_space.value.trim()) {
      Toast.show({
        type: 'error',
        text1: '입력 오류',
        text2: '평수를 입력해주세요.',
        position: 'top',
        topOffset: 0,
      });
      return false;
    }

    if (!room_capacity.value.trim()) {
      Toast.show({
        type: 'error',
        text1: '입력 오류',
        text2: '수용인원을 입력해주세요.',
        position: 'top',
        topOffset: 0,
      });
      return false;
    }

    return true;
  };

  /**
   * 📌 handleAddRoom
   * - 신규 호실 정보 추가 API 호출
   * - 성공 시 Toast 표시 및 이전 화면으로 이동
   * - 실패 시 에러 Toast 표시
   */
  const handleAddRoom = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const data = {
        funeralHallName: room_name.value.trim(),
        funeralHallSize: parseInt(room_space.value) || 0,
        funeralHallNumberOfMourners: parseInt(room_capacity.value) || 0,
        funeralHallDetailPrice: parseInt(room_sub_fee.value) || 0,
        funeralHallPrice: parseInt(room_main_fee.value) || 0,
      };

      const result = await addFuneralHallInfo(data);

      if (result) {
        Toast.show({
          type: 'success',
          text1: '호실 추가 완료',
          text2: '새로운 호실이 성공적으로 추가되었습니다.',
          position: 'top',
          topOffset: 0,
        });

        // 이전 화면으로 돌아가기
        navigation.goBack();
      }
    } catch (error: any) {
      console.error('호실 추가 실패:', error);
      Toast.show({
        type: 'error',
        text1: '호실 추가 실패',
        text2: error.message || '호실 추가 중 오류가 발생했습니다.',
        position: 'top',
        topOffset: 0,
      });
    }
  };

  /**
   * 📌 handleUpdateRoom
   * - 기존 호실 정보 수정 API 호출
   * - version 포함해 optimistic locking 처리
   * - 성공 시 Toast 표시 및 이전 화면으로 이동
   * - 실패 시 에러 Toast 표시
   */
  const handleUpdateRoom = async () => {
    if (!validateInputs()) return;

    try {
      const data = {
        funeralHallId: roomId,
        funeralHallName: room_name.value.trim(),
        funeralHallSize: parseInt(room_space.value) || 0,
        funeralHallNumberOfMourners: parseInt(room_capacity.value) || 0,
        funeralHallDetailPrice: parseInt(room_sub_fee.value) || 0,
        funeralHallPrice: parseInt(room_main_fee.value) || 0,
        version: roomDetail?.version, // 버전 정보 추가
      };

      const result = await updateFuneralHallInfo(data);

      if (result) {
        Toast.show({
          type: 'success',
          text1: '호실 수정 완료',
          text2: '호실 정보가 성공적으로 수정되었습니다.',
          position: 'top',
          topOffset: 0,
        });

        // 이전 화면으로 돌아가기
        navigation.goBack();
      }
    } catch (error: any) {
      console.error('호실 수정 실패:', error);
      Toast.show({
        type: 'error',
        text1: '호실 수정 실패',
        text2: error.message || '호실 수정 중 오류가 발생했습니다.',
        position: 'top',
        topOffset: 0,
      });
    }
  };

  /**
   * 📌 handleSave
   * - purpose 값에 따라 Add 또는 Update 실행
   */
  const handleSave = () => {
    if (purpose === 'add') {
      handleAddRoom();
    } else if (purpose === 'modify') {
      handleUpdateRoom();
    }
  };

  return (
    <FuneralLayout
      headerTitle={
        purpose === 'detail'
          ? roomName || '호실 상세'
          : purpose === 'modify'
          ? '호실 수정'
          : purpose === 'add'
          ? '호실 추가'
          : ''
      }
      backButtonVisible={true}
      homeButton={true}
      homeRouteName="FuneralMain"
      top={true}
      color="white"
      headerShown={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        style={{flex: 1}}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.wrapper}>
            <View style={styles.roomContainer}>
              <Typo style={styles.titleText}>호실이름</Typo>
              <FuneralInput
                input={room_name}
                placeholder="호실 이름을 입력하세요"
                disabled={purpose === 'detail'}
              />
            </View>
            <View style={styles.roomContainer}>
              <Typo style={styles.titleText}>평수</Typo>
              <FuneralInput
                input={room_space}
                placeholder="평수를 입력하세요"
                disabled={purpose === 'detail'}
                type="number"
                unit="평"
              />
            </View>
            <View style={styles.roomContainer}>
              <Typo style={styles.titleText}>수용인원</Typo>
              <FuneralInput
                input={room_capacity}
                placeholder="수용인원을 입력하세요"
                disabled={purpose === 'detail'}
                type="number"
                unit="명"
              />
            </View>
            <View style={styles.roomContainer}>
              <Typo style={styles.titleText}>호실사용료</Typo>
              <FuneralInput
                input={room_main_fee}
                placeholder="호실사용료를 입력하세요"
                disabled={purpose === 'detail'}
                type="number"
                unit="만원"
              />
            </View>
            <View style={styles.roomContainer}>
              <Typo style={styles.titleText}>식장지불금액(세부내역)</Typo>
              <FuneralInput
                input={room_sub_fee}
                placeholder="식장지불금액을 입력하세요"
                disabled={purpose === 'detail'}
                type="number"
                unit="만원"
              />
            </View>
          </View>
        </ScrollView>

        {purpose !== 'detail' && (
          <View style={styles.buttonContainer}>
            <CustomButton
              onPress={handleSave}
              style={[styles.button, loading && styles.buttonDisabled]}
              disabled={loading}>
              <Typo style={styles.buttonText}>
                {loading
                  ? '처리 중...'
                  : purpose === 'modify'
                  ? '호실 수정'
                  : '호실 추가'}
              </Typo>
            </CustomButton>
          </View>
        )}
      </KeyboardAvoidingView>
      <Toast />
    </FuneralLayout>
  );
};

export default AddRoomPage;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: scaleSize(20),
  },
  wrapper: {
    paddingHorizontal: scaleSize(20),
    paddingTop: scaleSize(20),
  },
  roomContainer: {
    marginBottom: scaleSize(24),
  },
  titleText: {
    fontSize: scaleFontSize(18),
    marginLeft: scaleSize(8),
    fontWeight: '700',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
    marginBottom: scaleSize(10),
  },
  buttonContainer: {
    paddingHorizontal: scaleSize(20),
    paddingVertical: scaleSize(16),
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  button: {
    backgroundColor: '#2D81F1',
    borderRadius: scaleSize(10),
    paddingVertical: scaleSize(18),
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    fontSize: scaleFontSize(16),
    textAlign: 'center',
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Black',
  },
});
