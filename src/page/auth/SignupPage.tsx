import DefaultLayout from '../../layout/DefaultLayout';
import {useEffect, useState} from 'react';
import {useAtom} from 'jotai';
import {signupAtom} from '../../state/local_state/signupAtom';
import SignupStepOne from './signup/SignupStepOne';
import ManagerStepTwo from './signup/ManagerStepTwo';
import FuneralStepTwo from './signup/FuneralStepTwo';
import SignupStepThree from './signup/SignupStepThree';
import {useRoute} from '@react-navigation/native';
import StepIndicator from '../../components/common/\bStepIndicator';

/**
 * 회원가입 마법사 페이지 컴포넌트
 * - 사용자 유형(`manager` | `funeral`)에 따라 2단계 컴포넌트를 분기 렌더링
 * - 1/2/3단계 진행을 상태(`step`)로 관리하고 단계 이동 콜백을 하위 컴포넌트로 전달
 *
 * Props: 없음 (라우트 파라미터에서 userType 사용)
 * 주요 라이브러리: jotai(전역 회원가입 상태), @react-navigation/native(라우트 파라미터)
 */

const SignupPage = () => {
  const route = useRoute();
  const {userType} = route.params as {userType: 'manager' | 'funeral'};
  console.log('userType', userType);
  const [step, setStep] = useState(1);
  const [signupInfo, setSignupInfo] = useAtom(signupAtom);
  /**
   * 라우트로 전달된 userType을 전역 회원가입 상태에 반영
   * - 이미 동일한 userType이면 불필요한 상태 업데이트를 방지
   */
  useEffect(() => {
    if (!userType) {
      console.error('userType is null');
      return;
    }
    setSignupInfo(prev => {
      if (prev.userType === userType) {
        return prev;
      }
      return {
        ...prev,
        userType: userType,
      };
    });
  }, [userType, setSignupInfo]);
  /**
   * 회원가입 최종 제출 처리
   * - 각 단계에서 누적 저장된 `signupAtom` 값을 활용
   * - 실제 API 연동은 3단계 컴포넌트에서 수행하므로 이곳은 훅/전역 상태 디버깅용
   */
  const handleSignupSubmit = async () => {
    console.log('회원가입 정보:', signupInfo);
    // 여기에 회원가입 API 호출 로직 추가
  };
  /**
   * 사용자 유형에 따른 헤더 타이틀 반환
   */
  const getHeaderTitle = () => {
    return userType === 'manager' ? '상조팀장 회원가입' : '장례식장 회원가입';
  };

  return (
    <DefaultLayout
      headerShown={true}
      headerTitle={getHeaderTitle()}
      color="white"
      homeButton={true}
      logoutButton={false}
      homeRouteName="Main"
      backButton={step === 1}>
      {/* 진행 단계 표시 컴포넌트 */}
      <StepIndicator currentStep={step} />
      {/* 1단계: 아이디/비밀번호 입력 */}
      {step === 1 && <SignupStepOne onNext={() => setStep(2)} />}
      {/* 2단계: 사용자 유형 분기 - 상조팀장/장례식장 */}
      {step === 2 &&
        (userType === 'manager' ? (
          <ManagerStepTwo onNext={() => setStep(3)} onPrev={() => setStep(1)} />
        ) : (
          <FuneralStepTwo onNext={() => setStep(3)} onPrev={() => setStep(1)} />
        ))}
      {/* 3단계: 계좌 인증/약관 동의 및 최종 제출 */}
      {step === 3 && (
        <SignupStepThree
          onSubmit={handleSignupSubmit}
          onPrev={() => setStep(2)}
          userType={userType}
        />
      )}
    </DefaultLayout>
  );
};

export default SignupPage;
