import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import CameraIcon from '../../assets/Button/Button_Camera.svg';
import Typo from '../../components/common/Typo';
import ImagePreviewList, {
  IImage,
} from '../../components/common/ImagePreviewList';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import AlbumBottomSheet from '../../components/common/AlbumBottomSheet';
import {convertUrisToFiles} from '../../util/image';
import InfoTable from '../../components/common/InfoTable';
import ConvenienceSelector from '../../components/common/ConvenienceSelector';
import {useInputBase} from '../../hooks/input/useInputBase';
import {FuneralInput} from '../../components/common/input/FuneralInput';
import {usePhoneInput} from '../../hooks/input/usePhoneInput';
import CustomButton from '../../components/common/CustomButton';
import {
  fetchFuneralHomeInfo,
} from '../../services/api/funeralService';
import Toast from 'react-native-toast-message';
import api from '../../api/config';
import DaumPostcodeModal from '../../components/common/DaumPostcodeModal';

interface ImageData {
  imageUrl: string;
  // 다른 필요한 속성들...
}

const FuneralModiftyPage = () => {
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
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [selectedImages, setSelectedImages] = useState<IImage[]>([]);
  const [infoData, setInfoData] = useState({
    funeral_scale: '', // 장례식장 규모
    funeral_total_rooms: '', // 장례식장 총 호실 수
    funeral_operation_type: '', // 장례식장 운영 형태
    funeral_style: '', // 장례식장 유형
  });
  const funeralAddress = useInputBase();
  const funeralWebsite = useInputBase();
  const funeralPhone = usePhoneInput();
  const [convenienceData, setConvenienceData] = useState({
    funeral_parking_lot: false, // 주차장
    funeral_store: false, // 매점
    funeral_family_waiting_room: false, // 가족 대기실
    funeral_disabled_facility: false, // 장애인 시설
  });
  const [funeralHomeInfo, setFuneralHomeInfo] = useState(null);
  
  // 주소 검색 모달 상태 추가
  const [showPostcodeModal, setShowPostcodeModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');

  console.log('🏁 funeralHomeInfo:', funeralHomeInfo);

  // 임시로 데이터를 가져오는 useEffect
  // 실제로는 API 호출을 통해 데이터를 가져와야 함
  // useEffect(() => {
  //   const fetched = {
  //     funeral_scale: '대형',
  //     funeral_total_rooms: '5개',
  //     funeral_operation_type: '직영',
  //     funeral_style: '전통',
  //   };

  //   setInfoData(fetched);
  // }, []);

  const navigation = useNavigation();

  useEffect(() => {
    const loadFuneralHomeInfo = async () => {
      try {
        const response = await fetchFuneralHomeInfo();
        console.log("🚀 ~ loadFuneralHomeInfo ~ response:", response)
        if (response.data && response.data.length > 0) {
          const data = response.data[0];
          setFuneralHomeInfo(data);

          // 이미지 데이터 수신 및 상태 업데이트
          if (response.images) {
            const imageList = response.images.map((image: ImageData, index: number) => ({
              uri: image.imageUrl,
              name: `image-${index}.jpg`,
              type: 'image/jpeg',
            }));
            setSelectedImages(imageList);
          }

          console.log("🚀 ~ loadFuneralHomeInfo ~ imageList:", selectedImages)

          // API 데이터를 InfoTable 선택 옵션에 맞게 변환
          const convertScale = (scale: string) => {
            if (scale?.includes('소형')) {
              return '소형';
            }
            if (scale?.includes('중형')) {
              return '중형';
            }
            if (scale?.includes('대형')) {
              return '대형';
            }
            return '대형'; // 기본값
          };

          const convertOperation = (operation: string) => {
            if (operation?.includes('공설')) {
              return '공설';
            }
            if (operation?.includes('사설')) {
              return '사설';
            }
            return '사설'; // 기본값
          };

          const convertStyle = (style: string) => {
            if (style?.includes('병원')) {
              return '병원';
            }
            if (style?.includes('전문')) {
              return '전문';
            }
            return '전문'; // 기본값
          };

          // 기존 데이터 처리
          setInfoData({
            funeral_scale: convertScale(data.funeralScale),
            funeral_total_rooms: data.funeralTotalRooms?.toString() || '',
            funeral_operation_type: convertOperation(data.funeralOperationType),
            funeral_style: convertStyle(data.funeralStyle),
          });

          setConvenienceData({
            funeral_parking_lot: data.funeralParkingLot || false,
            funeral_store: data.funeralStore || false,
            funeral_family_waiting_room: data.funeralFamilyWaitingRoom || false,
            funeral_disabled_facility: data.funeralDisabledFacility || false,
          });

          // 주소 설정
          if (data.funeralAddress) {
            setSelectedAddress(data.funeralAddress);
          }

          // ✅ undefined 방지
          if (funeralAddress && 'setValue' in funeralAddress) {
            funeralAddress.setValue(data.funeralAddress || '');
          }
          if (funeralWebsite && 'setValue' in funeralWebsite) {
            funeralWebsite.setValue(data.funeralHomepage || '');
          }
          if (funeralPhone && 'setValue' in funeralPhone) {
            funeralPhone.setValue(data.funeralPhone || '');
          }
        }
      } catch (error) {
        console.error('Failed to load funeral home info:', error);
      }
    };

    loadFuneralHomeInfo();
  }, []); // dependency array는 비워두고 useCallback으로 안정화

  // 라벨과 키 매핑
  const labelToKey = {
    규모: 'funeral_scale',
    빈소: 'funeral_total_rooms',
    운영: 'funeral_operation_type',
    형태: 'funeral_style',
  } as const;

  // 라벨을 키로 변환하여 데이터 생성
  const labelData = Object.entries(labelToKey).reduce((acc, [label, key]) => {
    acc[label as keyof typeof labelToKey] = infoData[key];
    return acc;
  }, {} as Record<keyof typeof labelToKey, string>);

  // 라벨을 키로 변환하여 데이터 생성2
  const handleChange = (label: keyof typeof labelToKey, value: string) => {
    const key = labelToKey[label];
    setInfoData(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  // 바텀 시트 토글 함수
  const toggleAlbum = () => {
    setShowBottomSheet(!showBottomSheet);
  };

  //  이미지 선택 핸들러
  const handleSelectImages = async (uris: string[]) => {
    const newUris = uris.filter(
      uri => !selectedImages.some(img => img.uri === uri),
    );
    if (newUris.length === 0) {
      return;
    }

    const converted = await convertUrisToFiles(newUris);
    const formatted: IImage[] = converted.map(item => ({
      uri: item.uri,
      name: item.name,
      type: item.type,
      file: item.file,
    }));

    setSelectedImages(prev => [...prev, ...formatted]);
  };

  // 이미지 삭제 핸들러
  const handleDeleteImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  // 주소 검색 핸들러
  const handleAddressSearch = () => {
    setShowPostcodeModal(true);
  };

  // 주소 선택 핸들러
  const handleAddressSelected = (postcodeData: any) => {
    // 도로명주소가 있으면 도로명주소 사용, 없으면 지번주소 사용
    const selectedAddr = postcodeData?.roadAddress ||
                        postcodeData?.jibunAddress ||
                        postcodeData?.address ||
                        postcodeData?.autoRoadAddress ||
                        postcodeData?.autoJibunAddress;

    if (selectedAddr) {
      setSelectedAddress(selectedAddr);
      setShowPostcodeModal(false);
    } else {
      // 에러 토스트 표시
      Toast.show({
        type: 'error',
        text1: '주소 선택에 실패했습니다.',
        text2: '다시 시도해주세요.',
        position: 'top',
        topOffset: 0,
      });
    }
  };

  const handleSave = async () => {
    console.log("🚀 ~ handleSave ~ funeralHomeInfo:", funeralHomeInfo)
    if (!funeralHomeInfo) {
        Toast.show({
            type: 'error',
            text1: '정보 누락',
            text2: '장례식장 정보가 없습니다. 나중에 다시 시도해 주세요.',
        });
        return;
    }
console.log("🚀 ~ handleSave ~ funeralHomeInfo:", selectedImages.map(img => img.uri))

    const formData = new FormData();
    selectedImages.forEach((img, index) => {
      formData.append('funeralRoomFiles', {
        uri: img.uri,
        type: 'image/jpeg', // 이미지 타입에 맞게 설정
        name: `image-${index}.jpg`, // 파일 이름 설정
      });
    });

    // 기존 데이터도 formData에 추가
    formData.append('funeralScale', infoData.funeral_scale);
    formData.append('funeralTotalRooms', parseInt(infoData.funeral_total_rooms, 10));
    formData.append('funeralOperationType', infoData.funeral_operation_type);
    formData.append('funeralStyle', infoData.funeral_style);
    formData.append('funeralAddress', selectedAddress + ' ' + funeralAddress.value); // 선택된 주소 + 상세주소
    formData.append('funeralHomepage', funeralWebsite.value);
    formData.append('funeralPhone', funeralPhone.value);
    formData.append('funeralParkingLot', convenienceData.funeral_parking_lot);
    formData.append('funeralStore', convenienceData.funeral_store);
    formData.append('funeralFamilyWaitingRoom', convenienceData.funeral_family_waiting_room);
    formData.append('funeralDisabledFacility', convenienceData.funeral_disabled_facility);

    try {
      const response = await api.put('/funeral/funeralList/update/funeralList', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Update successful:', response);
      navigation.goBack();
      // 성공 메시지 표시 또는 다른 작업 수행
    } catch (error) {
      console.error('Failed to update funeral home info:', error);
      // 오류 메시지 표시
    }
  };

  return (
    <FuneralLayout
      headerShown={true}
      backButtonVisible={true}
      homeButton={true}
      homeRouteName="FuneralMain"
      top={true}
      color="white"
      headerTitle="장례식장 정보 수정">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 0} // 헤더 높이만큼 여백 조정
        style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={toggleAlbum} style={styles.cameraButton}>
              <CameraIcon width={35} height={35} />
              <Typo>
                <Typo style={styles.curImageCount}>
                  {selectedImages.length}
                </Typo>{' '}
                / <Typo style={styles.maxImageCount}>{10}</Typo>
              </Typo>
            </TouchableOpacity>
            <ImagePreviewList
              images={selectedImages}
              onDelete={handleDeleteImage}
            />
          </View>
          <View style={styles.facilityContainer}>
            <Typo style={styles.titleText}>시설정보</Typo>

            <InfoTable
              editable={true}
              data={labelData}
              onChange={handleChange}
            />
          </View>
          <View style={styles.convenienceContainer}>
            <Typo style={styles.titleText}>편의시설</Typo>
            <ConvenienceSelector
              data={convenienceData}
              onToggle={key => {
                setConvenienceData(prev => ({
                  ...prev,
                  [key]: !prev[key],
                }));
              }}
            />
          </View>
          <View style={styles.locationContainer}>
            <Typo style={styles.titleText}>위치</Typo>
            <View style={styles.locationInputContainer}>
              <View style={styles.addressRow}>
                <View style={styles.addressBox}>
                  <Typo style={[
                    styles.addressText,
                    selectedAddress && { color: '#283042' }
                  ]}>
                    {selectedAddress || '주소를 검색해주세요'}
                  </Typo>
                </View>
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={handleAddressSearch}>
                  <Typo style={styles.searchButtonText}>주소검색</Typo>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.addressDetail}>
              {/* <Typo style={styles.addressText}>상세주소</Typo> */}
              <FuneralInput
                input={funeralAddress}
                placeholder="상세주소를 입력하세요"
              />
            </View>
          </View>
          <View style={styles.contactContainer}>
            <Typo style={styles.titleText}>홈페이지 주소</Typo>
            <View style={styles.inputContainer}>
              <FuneralInput
                input={funeralWebsite}
                placeholder="홈페이지 주소를 입력하세요"
              />
            </View>

            <Typo style={styles.titleTextLast}>대표전화</Typo>
            <View style={styles.inputContainer}>
              <FuneralInput
                input={funeralPhone}
                placeholder="대표전화번호를 입력하세요"
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton onPress={handleSave} style={styles.saveButton}>
              <Typo style={styles.saveButtonText}>저장</Typo>
            </CustomButton>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <AlbumBottomSheet
        visible={showBottomSheet}
        onClose={toggleAlbum}
        onSelect={handleSelectImages}
      />
      
      {/* 주소검색 모달 */}
      <DaumPostcodeModal
        visible={showPostcodeModal}
        onClose={() => setShowPostcodeModal(false)}
        onSelected={handleAddressSelected}
      />
      
      <Toast />
    </FuneralLayout>
  );
};

export default FuneralModiftyPage;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 4,
    borderBottomColor: '#F5F6F8',
  },
  cameraButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(225, 228, 245, 0.2)',
    width: 100,
    height: 100,
  },
  curImageCount: {
    fontSize: 14,
    color: '#283042',
    fontWeight: '400',
    fontFamily: 'Pretendard-Medium',
  },
  maxImageCount: {
    fontSize: 14,
    color: '#6F717D',
    fontWeight: '400',
    fontFamily: 'Pretendard-Medium',
  },
  facilityContainer: {
    // flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 30,
    borderBottomWidth: 4,
    borderBottomColor: '#F5F6F8',
  },
  titleText: {
    fontSize: 18,
    marginLeft: 20,
    fontWeight: '700',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
    marginBottom: 10,
  },
  titleTextLast: {
    fontSize: 18,
    marginLeft: 20,
    fontWeight: '700',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
    marginTop: 20,
    marginBottom: 10,
  },
  convenienceContainer: {
    // flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 30,
    borderBottomWidth: 4,
    borderBottomColor: '#F5F6F8',
  },
  locationContainer: {
    // flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  locationInputContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    flexDirection: 'column',
    width: '100%',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressBox: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#F5F6F8',
    borderRadius: 8,
    justifyContent: 'center',
  },
  addressText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(175, 179, 187, 0.5)',
    fontFamily: 'Pretendard-Black',
  },
  addressDetail: {
    width: '100%',
    paddingHorizontal: 10,
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: '#8990A0',
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  searchButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Pretendard-Black',
  },
  contactContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 8,
  },
  buttonContainer: {
    flex: 1,
    marginBottom: 30,
    marginTop: 30,
    paddingHorizontal: 10,
  },
  saveButton: {
    width: '100%',
    backgroundColor: '#2D81F1',
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Black',
  },
});
