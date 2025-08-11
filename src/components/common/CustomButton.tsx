import React, {JSX} from 'react';
import {Pressable, View} from 'react-native';

/**
 * CustomButton Props 인터페이스
 * @param onPress - 버튼 클릭 시 실행되는 콜백 함수
 * @param children - 버튼 내부에 렌더링할 React 컴포넌트들
 * @param hitSlop - 터치 영역 확장 설정 (상하좌우 픽셀, optional)
 *   - top/bottom/left/right: 각 방향으로 터치 영역을 확장할 픽셀 수
 * @param disabled - 버튼 비활성화 여부 (boolean, optional)
 * @param style - 버튼 컨테이너에 적용할 스타일 (View 스타일, optional)
 */
interface ICustomButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  hitSlop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  disabled?: boolean;
  style?: View['props']['style'];
}

/**
 * 커스텀 버튼 컴포넌트
 *
 * 주요 기능:
 * - Pressable을 래핑하여 일관된 버튼 인터페이스 제공
 * - hitSlop을 통한 터치 영역 확장 지원 (작은 버튼의 사용성 향상)
 * - disabled 상태 지원
 * - 유연한 스타일링 옵션
 *
 * 사용 목적:
 * - TouchableOpacity 대신 Pressable 기반의 모던한 터치 인터랙션
 * - 프로젝트 전반에서 일관된 버튼 동작 보장
 * - children을 통한 자유로운 버튼 콘텐츠 구성
 */
const CustomButton = ({
  onPress,
  children,
  hitSlop = {top: 0, bottom: 0, left: 0, right: 0},
  disabled,
  style,
}: ICustomButtonProps): JSX.Element => {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={hitSlop}
      disabled={disabled}
      style={style}>
      {children}
    </Pressable>
  );
};

export default CustomButton;
