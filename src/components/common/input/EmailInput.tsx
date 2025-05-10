import React, {useState} from 'react';
import {View, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
// import Typo from '../common/Typo'; // 텍스트 스타일링 컴포넌트 (네가 쓰는 거)
// import {useEmailPartsInput} from '../../hooks/input/useEmailPartsInput';
// import EmailSelectBottomSheet from './EmailSelectBottomSheet'; // 다음 단계에서 구현할 예정
import Typo from '../Typo';
import useEmailPartsInput from '../../../hooks/input/useEmailPartsInput';
import EmailSelectBottomSheet from '../EmailSelectSheet';

interface EmailInputProps {
  input: ReturnType<typeof useEmailPartsInput>;
  userType?: 'manager' | 'funeral';
}

const EmailInput = ({input, userType}: EmailInputProps) => {
  const [showSheet, setShowSheet] = useState(false);
  const DomainList =
    userType === 'manager'
      ? [
          'naver.com',
          'gmail.com',
          'daum.net',
          'kakao.com',
          'hanmail.net',
          '직접입력',
        ]
      : [
          'naver.com',
          'gmail.com',
          'daum.net',
          'kakao.com',
          'hanmail.net',
          '직접입력',
          '직원',
        ];
  return (
    <View style={styles.container}>
      {/* 직원이면 이름만 입력 */}
      {input.isEmployee ? (
        <TextInput
          style={styles.input}
          placeholder="이름을 입력하세요"
          value={input.id}
          onChangeText={input.setId}
        />
      ) : (
        <View style={styles.inputWrapper}>
          {/* 이메일 아이디 입력 */}
          <TextInput
            style={styles.input}
            placeholder="이메일"
            value={input.id}
            onChangeText={input.setId}
          />

          {/* 도메인 선택 or 직접입력용 입력창 */}
          {input.isDirectInput ? (
            <TextInput
              style={styles.domainInput}
              placeholder="직접입력"
              value={input.customDomain}
              onChangeText={input.setCustomDomain}
            />
          ) : (
            <TouchableOpacity
              onPress={() => setShowSheet(true)}
              style={styles.domainButton}>
              <Typo style={styles.domainText}>
                {input.domain === '직접입력' ? '직접입력' : `@${input.domain}`}
              </Typo>
            </TouchableOpacity>
          )}
        </View>
      )}
      {/* 도메인 선택 팝업 */}
      <EmailSelectBottomSheet
        domainList={DomainList}
        visible={showSheet}
        onClose={() => setShowSheet(false)}
        onSelect={value => {
          input.setDomain(value);
          if (value !== '직접입력') {
            input.setCustomDomain('');
          }
        }}
      />
    </View>
  );
};

export default EmailInput;

const styles = StyleSheet.create({
  container: {
    // width: '100%',
    flex: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 52,
    // borderWidth: 1,
  },

  input: {
    flex: 1.3,
    fontSize: 16,
    paddingVertical: 0,
    paddingHorizontal: 10,
    color: '#000',
  },
  domainText: {
    fontSize: 16,
    color: '#535353',
  },
  domainButton: {
    // flex: 1,
    // height: '100%',
    width: '50%',
    marginLeft: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  domainInput: {
    // flex: 0.5,
    // height: '75%',
    width: '50%',
    marginLeft: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#000',
  },
});
