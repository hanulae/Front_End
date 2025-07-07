import {useAtomValue, useSetAtom} from 'jotai';
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import {signupAtom, AttachedFile} from '../../../state/local_state/signupAtom';
import {Input} from '../../../components/common/input/Input';
import {usePhoneInput} from '../../../hooks/input/usePhoneInput';
import {useInputBase} from '../../../hooks/input/useInputBase';
import CustomButton from '../../../components/common/CustomButton';
import Typo from '../../../components/common/Typo';
import {useState, useMemo, useEffect} from 'react';
import AlbumBottomSheet from '../../../components/common/AlbumBottomSheet';
import AlbumIcon from '../../../assets/Attachment/Attach_ImageActive.svg';
import FileIcon from '../../../assets/Attachment/Attach_FileDisable.svg';
import ImagePreviewList, {
  IImage,
} from '../../../components/common/ImagePreviewList';
import {convertUrisToFiles} from '../../../util/image';
import {getLocalFileCopies, LocalFile} from '../../../util/file';
import {pick} from '@react-native-documents/picker';
import FileList from '../../../components/common/FileList';
import Toast from 'react-native-toast-message';
import api from '../../../api/config';

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

const ManagerStepTwo = ({onNext, onPrev}: Props) => {
  const signupInfo = useAtomValue(signupAtom);
  const setSignupInfo = useSetAtom(signupAtom);
  const phoneNumber = usePhoneInput();
  const authCode = useInputBase();

  const [selectedImages, setSelectedImages] = useState<IImage[]>([]);
  const [showAlbum, setShowAlbum] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<LocalFile[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 총 첨부파일 개수 계산
  const totalAttachedCount = useMemo(() => {
    return selectedImages.length + selectedFiles.length;
  }, [selectedImages.length, selectedFiles.length]);

  // 다음 버튼 활성화 여부
  const isNextEnabled = useMemo(() => {
    return signupInfo.isPhoneVerified === true;
  }, [signupInfo.isPhoneVerified]);

  // signupInfo에서 첨부파일 복원
  useEffect(() => {
    if (!isInitialized && signupInfo.attachedFiles.length > 0) {
      const images: IImage[] = [];
      const files: LocalFile[] = [];

      signupInfo.attachedFiles.forEach(file => {
        if (file.file) {
          // 이미지 파일
          images.push({
            uri: file.uri,
            name: file.name,
            type: file.type || '',
            file: file.file,
          });
        } else {
          // 일반 파일
          files.push({
            uri: file.uri,
            name: file.name,
            type: file.type || 'application/octet-stream',
            size: 0,
          });
        }
      });

      setSelectedImages(images);
      setSelectedFiles(files);
      setIsInitialized(true);
    }
  }, [signupInfo.attachedFiles, isInitialized]);

  console.log('selectedFiles', selectedFiles);
  const closeAlbum = () => {
    setShowAlbum(false);
    // setSelectedUris([]);
  };

  console.log('selectedImages', selectedImages);

  const handleNext = () => {
    console.log('handleNext');
    if (!signupInfo.isPhoneVerified) {
      Toast.show({
        type: 'error',
        text1: '인증 오류',
        text2: '전화번호 인증을 완료해주세요.',
        position: 'top',
      });
      return;
    }

    setSignupInfo(prev => ({
      ...prev,
      phoneNumber: phoneNumber.value,
    }));
    onNext();
  };

  const handlePrev = () => {
    setSignupInfo(prev => ({...prev, phoneNumber: phoneNumber.value}));
    onPrev();
  };

  const handleOpenAlbum = () => {
    setShowAlbum(true);
    // albumSheetRef.current?.snapToIndex(0); // BottomSheet 열기
  };

  const handleAddFile = (newFiles: LocalFile[]) => {
    const nonDuplicateFiles = newFiles.filter(
      newFile =>
        !selectedFiles.some(existingFile => existingFile.uri === newFile.uri),
    );

    if (nonDuplicateFiles.length === 0) {
      return;
    }

    // 최대 개수 체크
    if (totalAttachedCount + nonDuplicateFiles.length > 10) {
      Toast.show({
        type: 'error',
        text1: '첨부파일 개수 초과',
        text2: '최대 10개까지만 첨부할 수 있습니다.',
        position: 'top',
      });
      return;
    }

    const newSelectedFiles = [...selectedFiles, ...nonDuplicateFiles];
    setSelectedFiles(newSelectedFiles);

    // 즉시 signupInfo 업데이트
    const attachedFiles: AttachedFile[] = [
      ...selectedImages.map(img => ({
        uri: img.uri,
        name: img.name,
        type: img.type,
        file: img.file,
      })),
      ...newSelectedFiles.map(file => ({
        uri: file.uri,
        name: file.name,
        type: file.type,
      })),
    ];

    setSignupInfo(prev => ({
      ...prev,
      attachedFiles,
    }));
  };

  const handleDeleteFile = (index: number) => {
    const newSelectedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newSelectedFiles);

    // 즉시 signupInfo 업데이트
    const attachedFiles: AttachedFile[] = [
      ...selectedImages.map(img => ({
        uri: img.uri,
        name: img.name,
        type: img.type,
        file: img.file,
      })),
      ...newSelectedFiles.map(file => ({
        uri: file.uri,
        name: file.name,
        type: file.type,
      })),
    ];

    setSignupInfo(prev => ({
      ...prev,
      attachedFiles,
    }));
  };

  const handleSelectImages = async (uris: string[]) => {
    const newUris = uris.filter(
      uri => !selectedImages.some(img => img.uri === uri),
    );
    if (newUris.length === 0) return;

    // 최대 개수 체크
    if (totalAttachedCount + newUris.length > 10) {
      Toast.show({
        type: 'error',
        text1: '첨부파일 개수 초과',
        text2: '최대 10개까지만 첨부할 수 있습니다.',
        position: 'top',
      });
      return;
    }

    const converted = await convertUrisToFiles(newUris);
    const formatted: IImage[] = converted.map(item => ({
      uri: item.uri,
      name: item.name,
      type: item.type,
      file: item.file,
    }));

    const newSelectedImages = [...selectedImages, ...formatted];
    setSelectedImages(newSelectedImages);

    // 즉시 signupInfo 업데이트
    const attachedFiles: AttachedFile[] = [
      ...newSelectedImages.map(img => ({
        uri: img.uri,
        name: img.name,
        type: img.type,
        file: img.file,
      })),
      ...selectedFiles.map(file => ({
        uri: file.uri,
        name: file.name,
        type: file.type,
      })),
    ];

    setSignupInfo(prev => ({
      ...prev,
      attachedFiles,
    }));
  };

  const handleRequestCode = async () => {
    console.log('인증 코드 요청:', phoneNumber.value);
    try {
      const res = await api.post('/manager/sms/send', {
        phoneNumber: phoneNumber.value,
        userType: 'manager',
      });
      console.log('📨 인증번호 전송 성공:', res.data);
      Toast.show({
        type: 'success',
        text1: '인증번호가 발송되었습니다.',
        position: 'top',
      });
    } catch (error: any) {
      console.log(
        '❌ 인증번호 전송 실패:',
        error.response?.data || error.message,
      );
      Toast.show({
        type: 'error',
        text1: '인증번호 전송 실패',
        text2: error.response?.data?.message || '오류가 발생했습니다.',
        position: 'top',
      });
    }
  };

  const handleVerifyCode = async () => {
    console.log('인증 코드 확인:', authCode.value);

    if (!phoneNumber.value || !authCode.value) {
      Toast.show({
        type: 'error',
        text1: '입력 오류',
        text2: '전화번호와 인증코드를 모두 입력해주세요.',
        position: 'top',
      });
      return;
    }

    try {
      const res = await api.post('/manager/sms/verify', {
        phoneNumber: phoneNumber.value,
        code: authCode.value,
      });

      if (res.data.verified) {
        Toast.show({
          type: 'success',
          text1: '인증 성공',
          position: 'top',
        });

        // 인증 상태 저장
        setSignupInfo(prev => ({
          ...prev,
          phoneNumber: phoneNumber.value,
          isPhoneVerified: true,
        }));
      } else {
        Toast.show({
          type: 'error',
          text1: '인증 실패',
          text2: '인증코드가 틀렸거나 만료되었습니다.',
          position: 'top',
        });
      }
    } catch (error: any) {
      console.log('❌ 인증 실패:', error.response?.data || error.message);
      Toast.show({
        type: 'error',
        text1: '서버 오류',
        text2: error.response?.data?.message || '잠시 후 다시 시도해주세요.',
        position: 'top',
      });
    }
  };

  // const handlePickFiles = async () => {
  //   try {
  //     const picked = await pick({allowMultiSelection: true});

  //     const inputFiles = picked.map(file => ({
  //       uri: file.uri,
  //       fileName: file.name ?? '이름없는파일',
  //     }));

  //     const localFiles = await getLocalFileCopies(inputFiles);

  //     handleAddFile(localFiles); // 여러 개 전달
  //   } catch (err) {
  //     console.warn('파일 선택 실패:', err);
  //   }
  // };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.wrapper}>
        <View style={styles.formContainer}>
          {/* 휴대전화번호 인증 */}
          <View style={styles.container}>
            <Typo fontSize={16} style={styles.containerTitle}>
              휴대전화번호 인증
            </Typo>
            <View style={styles.authSection}>
              <Input
                input={phoneNumber}
                placeholder="전화번호를 입력하세요."
                type="phone"
              />
              <CustomButton
                onPress={handleRequestCode}
                style={styles.requestButton}>
                <Typo color="white" fontSize={14} style={{fontWeight: '700'}}>
                  인증코드받기
                </Typo>
              </CustomButton>
            </View>
          </View>
          {/* 인증코드 확인 */}
          <View style={styles.container}>
            <Typo fontSize={16} style={styles.containerTitle}>
              인증코드 확인
            </Typo>
            <View style={styles.verifySection}>
              <Input
                input={authCode}
                placeholder="인증코드를 입력하세요."
                type="number"
              />
              <CustomButton
                onPress={handleVerifyCode}
                style={styles.requestButton}>
                <Typo color="white" fontSize={14} style={{fontWeight: '700'}}>
                  인증코드확인
                </Typo>
              </CustomButton>
            </View>
          </View>
          {/* 첨부파일 */}
          {/* <View style={styles.container}>
          <Typo fontSize={16} style={styles.containerTitle}>
            첨부파일 ({totalAttachedCount}/10)
          </Typo>
          <View style={styles.imagePreviewContainer}>
            <ImagePreviewList
              images={selectedImages}
              onDelete={index => {
                const newSelectedImages = selectedImages.filter(
                  (_, i) => i !== index,
                );
                setSelectedImages(newSelectedImages);

                // 즉시 signupInfo 업데이트
                const attachedFiles: AttachedFile[] = [
                  ...newSelectedImages.map(img => ({
                    uri: img.uri,
                    name: img.name,
                    type: img.type,
                    file: img.file,
                  })),
                  ...selectedFiles.map(file => ({
                    uri: file.uri,
                    name: file.name,
                    type: file.type,
                  })),
                ];

                setSignupInfo(prev => ({
                  ...prev,
                  attachedFiles,
                }));
              }}
              scrollEnabled={true}
            />
          </View>
          <FileList files={selectedFiles} onDelete={handleDeleteFile} />
          <View style={styles.buttonContainer}>
            <CustomButton style={styles.imageButton} onPress={handleOpenAlbum}>
              <AlbumIcon width={24} height={24} />
              <Typo fontSize={14} style={styles.imageButtonText}>
                사진첨부
              </Typo>
            </CustomButton>
            <CustomButton style={styles.fileButton} onPress={handlePickFiles}>
              <FileIcon width={24} height={24} />
              <Typo fontSize={14} style={styles.fileButtonText}>
                파일첨부
              </Typo>
            </CustomButton>
          </View>
          <Toast />
        </View> */}
        </View>
        {/* 버튼 */}
        <View style={styles.bottomButtonContainer}>
          <CustomButton onPress={handlePrev} style={styles.button}>
            <Typo style={styles.buttonText}>이전</Typo>
          </CustomButton>

          <CustomButton
            onPress={handleNext}
            style={[
              styles.button,
              {backgroundColor: isNextEnabled ? '#2D81F1' : '#C0C0C0'}, // 비활성 시 회색
            ]}
            disabled={!isNextEnabled}>
            <Typo style={styles.buttonText}>다음</Typo>
          </CustomButton>
        </View>
        <AlbumBottomSheet
          onSelect={handleSelectImages}
          visible={showAlbum}
          onClose={closeAlbum}
        />
        <Toast />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ManagerStepTwo;

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    padding: 16,
  },
  container: {
    marginBottom: 24,
  },
  formContainer: {
    flex: 1,
  },
  imagePreviewContainer: {
    flexGrow: 0,
    overflow: 'visible',
  },
  containerTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard-Light',
    marginBottom: 16,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 20,
  },
  imageButton: {
    flex: 1,
    backgroundColor: 'rgba(226, 242, 255, 0.5)',
    paddingLeft: 20,
    paddingVertical: 20,
    flexDirection: 'row',
  },
  imageButtonText: {
    marginLeft: 22,
    fontSize: 16,
    fontWeight: '600',
    color: '#2D81F1',
    fontFamily: 'Pretendard-Light',
  },
  fileButton: {
    flex: 1,
    backgroundColor: 'rgba(250, 250, 251, 0.75)',
    paddingLeft: 20,
    paddingVertical: 20,
    flexDirection: 'row',
  },
  fileButtonText: {
    marginLeft: 22,
    fontSize: 16,
    fontWeight: '600',
    color: '#8990A0',
    fontFamily: 'Pretendard-Light',
  },
  authSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 0,
  },
  verifySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 0,
  },
  requestButton: {
    backgroundColor: '#8990A0',
    padding: 10,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2D81F1',
    padding: 10,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    // flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Pretendard-Light',
  },
  bottomButtonContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },
});
