import {useRoute} from '@react-navigation/native';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import FuneralLayout from '../../layout/FuneralLayout';
import Typo from '../../components/common/Typo';
import CustomButton from '../../components/common/CustomButton';
import ButtonIcon from '../../assets/Icon/Icon_DropDown01.svg';
import {useState} from 'react';

const {height} = Dimensions.get('window');

const QuoteProposalPage = () => {
  const route = useRoute();
  const {id, status} = route.params as {id: number; status: string};
  console.log('QuoteProposalPage', id, status);

  const [isSelectRoomSheetVisible, setSelectRoomSheetVisible] = useState(false);

  // status가 '대기중' 일 때는 견적 제안서의 input을 활성화
  // status가 '완료' 일 때는 견적 제안서의 input을 비활성화
  return (
    <FuneralLayout
      headerShown={true}
      headerTitle="견적 제안서"
      backButtonVisible={true}
      homeButton={true}
      homeRouteName="FuneralMain"
      color="#FFFFFF"
      top={true}>
      <View style={styles.wrapper}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          style={styles.scrollViewStyle}>
          <View style={styles.inputContainer}>
            <Typo style={styles.titleText}>호실 선택</Typo>
            <CustomButton
              onPress={() => {
                console.log('버튼클릭');
              }}
              style={styles.inputDisabled}>
              <Typo style={styles.inputText}>호실 선택</Typo>
              <ButtonIcon width={24} height={24} />
            </CustomButton>
          </View>
          <View style={styles.inputContainer}>
            <Typo style={styles.titleText}>평수</Typo>
            <View style={styles.inputDisabled}>
              <Typo style={styles.inputText}>70</Typo>
              <Typo style={styles.inputValueText}>평</Typo>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Typo style={styles.titleText}>수용인원</Typo>
            <View style={styles.inputDisabled}>
              <Typo style={styles.inputText}>100</Typo>
              <Typo style={styles.inputValueText}>명</Typo>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Typo style={styles.titleText}>식장지불금액</Typo>
            <View style={styles.inputDisabled}>
              <Typo style={styles.inputText}>100</Typo>
              <Typo style={styles.inputValueText}>만원</Typo>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Typo style={styles.titleText}>호실사용료</Typo>
            <View style={styles.inputDisabled}>
              <Typo style={styles.inputText}>50</Typo>
              <Typo style={styles.inputValueText}>만원</Typo>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Typo style={styles.titleText}>
              합계 (식장지불금액 + 호실사용료)
            </Typo>
            <View style={styles.inputDisabled}>
              <Typo style={styles.inputText}>150</Typo>
              <Typo style={styles.inputValueText}>만원</Typo>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Typo style={styles.titleText}>제안가</Typo>
            <TextInput
              style={styles.inputDisabled}
              value="100"
              placeholder="입력"
            />
          </View>
        </ScrollView>
        <View style={styles.bottomContainer}>
          <View style={styles.inputContainer}>
            <Typo style={styles.titleText}>할인률</Typo>
            <View style={styles.inputDisabled}>
              <Typo style={styles.inputText}></Typo>
              <Typo style={styles.inputValueText}>%</Typo>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton onPress={() => {}} style={styles.button}>
              <Typo style={styles.buttonText}>입찰</Typo>
            </CustomButton>
          </View>
        </View>
      </View>
    </FuneralLayout>
  );
};

export default QuoteProposalPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  scrollViewStyle: {
    borderBottomWidth: 5,
    borderBottomColor: '#F5F6F8',
  },
  bottomContainer: {
    // flex: 1,
    minHeight: height * 0.25,
    // borderWidth: 1,
  },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  titleText: {
    fontSize: 18,
    marginLeft: 20,
    fontWeight: '700',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
    marginBottom: 20,
  },
  inputDisabled: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginHorizontal: 10,
    paddingVertical: 18,
    borderRadius: 10,
    backgroundColor: '#F5F6F8',
    fontSize: 16,
    fontWeight: '500',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },
  inputText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#AFB3BB',
    fontFamily: 'Pretendard-Black',
  },
  inputValueText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#283042',
    fontFamily: 'Pretendard-Black',
  },
  buttonContainer: {
    // flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  button: {
    borderRadius: 10,
    backgroundColor: '#2D81F1',
    paddingVertical: 18,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Black',
    textAlign: 'center',
  },
});
