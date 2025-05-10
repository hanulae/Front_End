import {StyleSheet} from 'react-native';
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

const SignupPage = () => {
  const route = useRoute();
  const {userType} = route.params as {userType: 'manager' | 'funeral'};
  console.log('userType', userType);
  const [step, setStep] = useState(1);
  const [signupInfo, setSignupInfo] = useAtom(signupAtom);
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
  const handleSignupSubmit = async () => {
    console.log('회원가입 정보:', signupInfo);
    // 여기에 회원가입 API 호출 로직 추가
  };
  return (
    <DefaultLayout
      headerShown={true}
      // headerTitle="회원가입"
      homeButton={true}
      logoutButton={false}
      homeRouteName="Main">
      <StepIndicator currentStep={step} />
      {step === 1 && <SignupStepOne onNext={() => setStep(2)} />}
      {step === 2 &&
        (userType === 'manager' ? (
          <ManagerStepTwo onNext={() => setStep(3)} onPrev={() => setStep(1)} />
        ) : (
          <FuneralStepTwo onNext={() => setStep(3)} onPrev={() => setStep(1)} />
        ))}
      {step === 3 && (
        <SignupStepThree
          onSubmit={handleSignupSubmit}
          onPrev={() => setStep(2)}
        />
      )}
    </DefaultLayout>
  );
};

export default SignupPage;

const styles = StyleSheet.create({});
