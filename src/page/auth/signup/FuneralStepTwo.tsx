import {useAtomValue, useSetAtom} from 'jotai';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TextInput,
} from 'react-native';
import {useState} from 'react';
import {signupAtom} from '../../../state/local_state/signupAtom';
import {usePhoneInput} from '../../../hooks/input/usePhoneInput';
import {useInputBase} from '../../../hooks/input/useInputBase';
import {Input} from '../../../components/common/input/Input';
import CustomButton from '../../../components/common/CustomButton';
import Typo from '../../../components/common/Typo';
import {useNavigation} from '@react-navigation/native';
import ImagePreviewList, {
  IImage,
} from '../../../components/common/ImagePreviewList';
import {getLocalFileCopies, LocalFile} from '../../../util/file';
import {convertUrisToFiles} from '../../../util/image';
import {pick} from '@react-native-documents/picker';
import AlbumBottomSheet from '../../../components/common/AlbumBottomSheet';
import AlbumIcon from '../../../assets/Attachment/Attach_ImageActive.svg';
import FileIcon from '../../../assets/Attachment/Attach_FileDisable.svg';
import FileList from '../../../components/common/FileList';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {myFuneralAtom} from '../../../state/local_state/myFuneralAtom';
interface Props {
  onNext: () => void;
  onPrev: () => void;
}

const FuneralStepTwo = ({onNext, onPrev}: Props) => {
  const setSignupInfo = useSetAtom(signupAtom);
  const phoneNumber = usePhoneInput();
  const authCode = useInputBase();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  // const myFuneralName = useInputBase();
  const myFuneral = useAtomValue(myFuneralAtom);
  const [selectedImages, setSelectedImages] = useState<IImage[]>([]);
  const [showAlbum, setShowAlbum] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<LocalFile[]>([]);

  const closeAlbum = () => {
    setShowAlbum(false);
    // setSelectedUris([]);
  };

  const handleNext = () => {
    setSignupInfo(prev => ({...prev, phoneNumber: phoneNumber.value}));
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
    setSelectedFiles(prev => [...prev, ...nonDuplicateFiles]);
  };

  const handleDeleteFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSelectImages = async (uris: string[]) => {
    const newUris = uris.filter(
      uri => !selectedImages.some(img => img.uri === uri),
    );
    if (newUris.length === 0) return;

    const converted = await convertUrisToFiles(newUris);
    const formatted: IImage[] = converted.map(item => ({
      uri: item.uri,
      name: item.name,
      type: item.type,
      file: item.file,
    }));

    setSelectedImages(prev => [...prev, ...formatted]);
  };

  const handleRequestCode = () => {
    // 인증 코드 요청 로직
    console.log('인증 코드 요청:', phoneNumber.value);
  };

  const handleVerifyCode = () => {
    // 인증 코드 확인 로직
    console.log('인증 코드 확인:', authCode.value);
  };

  const handlePickFiles = async () => {
    try {
      const picked = await pick({allowMultiSelection: true});

      const inputFiles = picked.map(file => ({
        uri: file.uri,
        fileName: file.name ?? '이름없는파일',
      }));

      const localFiles = await getLocalFileCopies(inputFiles);

      handleAddFile(localFiles); // 여러 개 전달
    } catch (err) {
      console.warn('파일 선택 실패:', err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView style={styles.wrapper}>
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
        <View style={styles.container}>
          <Typo fontSize={16} style={styles.containerTitle}>
            내 장례식장 찾기
          </Typo>
          <View style={styles.funeralNameContainer}>
            <View style={styles.funeralNameInputContainer}>
              <Typo style={styles.funeralNameText}>
                {myFuneral.funeralName}
              </Typo>
            </View>
            <CustomButton
              onPress={() => {
                navigation.navigate('FindFuneral', {
                  variant: 'signup',
                });
              }}
              style={styles.findButton}>
              <Typo color="white" fontSize={14} style={{fontWeight: '700'}}>
                장례식장 찾기
              </Typo>
            </CustomButton>
          </View>
        </View>
        <View style={styles.container}>
          <Typo fontSize={16} style={styles.containerTitle}>
            첨부파일 ({selectedImages.length}/10)
          </Typo>
          <ScrollView style={{flexGrow: 0, overflow: 'visible'}}>
            <ImagePreviewList
              images={selectedImages}
              onDelete={index => {
                setSelectedImages(prev => prev.filter((_, i) => i !== index));
              }}
            />
          </ScrollView>
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
        </View>

        {/* <Button
          title="내 장례식장 찾기"
          onPress={() => {
            console.log('장례식장 찾기 페이지 이동');
            navigation.navigate('FindFuneral');
          }}
        /> */}
        <View style={styles.bottomButtonContainer}>
          <CustomButton onPress={handlePrev} style={styles.button}>
            <Typo color="white" fontSize={14} style={{fontWeight: '700'}}>
              이전
            </Typo>
          </CustomButton>

          <CustomButton onPress={handleNext} style={styles.button}>
            <Typo color="white" fontSize={14} style={{fontWeight: '700'}}>
              다음
            </Typo>
          </CustomButton>
        </View>
        <AlbumBottomSheet
          onSelect={handleSelectImages}
          visible={showAlbum}
          onClose={closeAlbum}
        />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default FuneralStepTwo;

const styles = StyleSheet.create({
  wrapper: {
    // flex: 1,
    padding: 16,
  },
  container: {
    // borderWidth: 1,
  },
  containerTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard-Bold',
    // marginBottom: 5,
    marginLeft: 10,
  },
  funeralNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  funeralNameInputContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  funeralNameText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard-Bold',
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
    // paddingHorizontal: 16,
  },
  verifySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    // paddingHorizontal: 16,
  },
  requestButton: {
    backgroundColor: '#8990A0',
    padding: 10,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  findButton: {
    backgroundColor: '#2D81F1',
    padding: 10,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 16,
    // flex: 1,
  },
  button: {
    backgroundColor: '#2D81F1',
    padding: 10,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    // flex: 1,
  },
  bottomButtonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 20,
  },
});
