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
        <View style={styles.row}>
          <TextInput
            style={[styles.input, {flex: 1}]}
            placeholder="이메일을 입력하세요"
            value={input.id}
            onChangeText={input.setId}
          />

          <TouchableOpacity
            onPress={() => setShowSheet(true)}
            style={styles.domainButton}>
            <Typo style={styles.domainText}>
              {input.isDirectInput
                ? `@${input.customDomain || '직접입력'}`
                : `@${input.domain}`}
            </Typo>
          </TouchableOpacity>
        </View>
      )}

      {/* 직접입력 선택 시 도메인 입력창 */}
      {input.isDirectInput && (
        <TextInput
          style={[styles.input, {marginTop: 8}]}
          placeholder="도메인을 입력하세요 (예: mycompany.com)"
          value={input.customDomain}
          onChangeText={input.setCustomDomain}
        />
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
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 3,
    // height: 50,
    borderRadius: 10,
    backgroundColor: '#eaeaea',
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
  },
  domainText: {
    fontSize: 16,
    color: '#535353',
  },
  domainButton: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    justifyContent: 'center',
    marginLeft: 8,
    // height: 50,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
  },
});
