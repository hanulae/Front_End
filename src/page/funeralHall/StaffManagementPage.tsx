import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import {Platform, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import CustomButton from '../../components/common/CustomButton';
import Typo from '../../components/common/Typo';
import StaffCard from '../../components/funeralHall/management/StaffCard';
import StaffBottomSheet from '../../components/funeralHall/management/StaffBottomSheet';

export interface IStaff {
  staffId: string;
  staffName: string;
  staffGrade: string;
  phone: string;
}

const DummyData: IStaff[] = [
  {
    staffId: '1',
    staffName: '홍길동',
    staffGrade: '사원',
    phone: '010-1234-5678',
  },
  {
    staffId: '2',
    staffName: '김철수',
    staffGrade: '대리',
    phone: '010-2345-6789',
  },
  {
    staffId: '3',
    staffName: '이영희',
    staffGrade: '과장',
    phone: '010-3456-7890',
  },
  {
    staffId: '4',
    staffName: '박민수',
    staffGrade: '부장',
    phone: '010-4567-8901',
  },
];

const StaffManagementPage = () => {
  // StatusBar 설정
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#3287F8');
        StatusBar.setBarStyle('dark-content');
      } else {
        StatusBar.setBarStyle('dark-content');
      }
      return () => {
        // 화면 포커스 해제 시 필요하다면 초기화 작업
        // 예: StatusBar.setStyle('default')
      };
    }, []),
  );

  // 상태 관리
  const [isEdit, setIsEdit] = useState(false);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [bottomSheetMode, setBottomSheetMode] = useState<'add' | 'edit' | null>(
    null,
  );
  const [selectedStaff, setSelectedStaff] = useState<IStaff | null>(null);

  // BottomSheet
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

  // 수정 버튼 클릭 핸들러
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
            <Typo style={styles.editButtonText}>
              {isEdit ? '완료' : '편집'}
            </Typo>
          </CustomButton>
        </View>
        <ScrollView
          contentContainerStyle={{gap: 10}}
          style={styles.cardContainer}>
          {DummyData.map(staff => (
            <StaffCard
              key={staff.staffId}
              staffName={staff.staffName}
              staffGrade={staff.staffGrade}
              staffId={staff.staffId}
              isButtonVisible={isEdit}
              toggleEdit={() => openEditSheet(staff)}
              handleDelete={() => console.log('삭제')}
              handleCancel={() => console.log('취소')}
            />
          ))}
        </ScrollView>
        {/* BottomSheet */}
        <View style={styles.buttonContainer}>
          <CustomButton onPress={openAddSheet} style={styles.addStaffButton}>
            <Typo style={styles.addStaffButtonText}>등록</Typo>
          </CustomButton>
        </View>
      </View>
      {isBottomSheetVisible && (
        <StaffBottomSheet
          visible={isBottomSheetVisible}
          mode={bottomSheetMode} // <--- props로 모드 전달
          staff={selectedStaff} // <--- 수정 모드일 경우 사용할 정보
          onClose={closeBottomSheet}
          onConfirm={() => {
            console.log('직원 등록 또는 수정 완료');
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
    // flex: 1,
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
