import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import CustomButton from '../../components/common/CustomButton';
import Typo from '../../components/common/Typo';
import StaffCard from '../../components/funeralHall/management/StaffCard';
import StaffBottomSheet from '../../components/funeralHall/management/StaffBottomSheet';
import { IStaff } from './StaffManagementPage.types';
import Toast from 'react-native-toast-message';
import api from '../../api/config';
import { useAtomValue } from 'jotai';
import { loginAtom } from '../../state/local_state/loginAtom';

const StaffManagementPage = () => {
  const loginInfo = useAtomValue(loginAtom);
  const [isEdit, setIsEdit] = useState(false);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [bottomSheetMode, setBottomSheetMode] = useState<'add' | 'edit' | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<IStaff | null>(null);
  const [staffList, setStaffList] = useState<IStaff[]>([]);

  // 상태바 설정
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#3287F8');
        StatusBar.setBarStyle('dark-content');
      } else {
        StatusBar.setBarStyle('dark-content');
      }
    }, [])
  );

  const fetchStaffList = async () => {
    try {
      const res = await api.get('/funeral/staff/list', {
        headers: {
          Authorization: `Bearer ${loginInfo.accessToken}`,
        },
      });

      const staffList = res.data.data.map((staff: any) => ({
        staffId: staff.funeralStaffId,
        staffName: staff.funeralStaffName,
        staffGrade: staff.funeralStaffRole,
        phone: staff.funeralStaffPhoneNumber,
      }));
      setStaffList(staffList);
    } catch (error: any) {
      console.error('직원 목록 조회 실패:', error.response?.data || error.message);
      Toast.show({
        type: 'error',
        text1: '직원 목록 조회 실패',
        text2: error.response?.data?.message || '오류가 발생했습니다.',
      });
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    try {
      await api.delete(`/funeral/staff/${staffId}`, {
        headers: {
          Authorization: `Bearer ${loginInfo.accessToken}`,
        },
      });
      Toast.show({
        type: 'success',
        text1: '직원 삭제 완료',
        position: 'top',
      });
      fetchStaffList(); // 삭제 후 목록 갱신
    } catch (error: any) {
      console.error('직원 삭제 실패:', error.response?.data || error.message);
      Toast.show({
        type: 'error',
        text1: '직원 삭제 실패',
        text2: error.response?.data?.message || '오류가 발생했습니다.',
      });
    }
  };

  useEffect(() => {
    fetchStaffList();
  }, []);

  const openAddSheet = () => {
    setBottomSheetMode('add');
    setBottomSheetVisible(true);
  };

  const openEditSheet = (staff: IStaff) => {
    setSelectedStaff(staff);
    setBottomSheetMode('edit');
    setBottomSheetVisible(true);
  };

  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
    setSelectedStaff(null);
    setBottomSheetMode(null);
  };

  const toggleEdit = () => {
    setIsEdit(!isEdit);
  };

  return (
    <FuneralLayout
      headerShown={true}
      backButtonVisible={true}
      homeButton={true}
      homeRouteName="FuneralMain"
      top={true}
      color="#F5F6F8"
      headerTitle="직원관리">
      <View style={styles.wrapper}>
        <View style={styles.editButtonContainer}>
          <CustomButton onPress={toggleEdit} style={styles.editButton}>
            <Typo style={styles.editButtonText}>{isEdit ? '완료' : '편집'}</Typo>
          </CustomButton>
        </View>
        <ScrollView
          contentContainerStyle={{ gap: 10 }}
          style={styles.cardContainer}>
          {staffList.map(staff => (
            <StaffCard
              key={staff.staffId}
              staffName={staff.staffName}
              staffGrade={staff.staffGrade}
              staffId={staff.staffId}
              isButtonVisible={isEdit}
              toggleEdit={() => openEditSheet(staff)}
              handleDelete={() => handleDeleteStaff(staff.staffId)}
              handleCancel={() => console.log('취소')}
            />
          ))}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <CustomButton onPress={openAddSheet} style={styles.addStaffButton}>
            <Typo style={styles.addStaffButtonText}>등록</Typo>
          </CustomButton>
        </View>
      </View>
      {isBottomSheetVisible && (
        <StaffBottomSheet
          visible={isBottomSheetVisible}
          mode={bottomSheetMode}
          staff={selectedStaff}
          onClose={closeBottomSheet}
          onConfirm={() => {
            fetchStaffList();
            closeBottomSheet();
          }}
        />
      )}
    </FuneralLayout>
  );
};

export default StaffManagementPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  editButtonContainer: {
    padding: 20,
  },
  editButton: {
    alignSelf: 'flex-end',
    borderRadius: 10,
    backgroundColor: '#283042',
    paddingHorizontal: 27,
    paddingVertical: 10,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Pretendard-Black',
  },
  cardContainer: {
    flexDirection: 'column',
    gap: 10,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  addStaffButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#2D81F1',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  addStaffButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Pretendard-Black',
  },
});
