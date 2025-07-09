import {createNavigationContainerRef} from '@react-navigation/native';
import type {ParamListBase} from '@react-navigation/native';

// 전역 NavigationContainer 참조 객체 생성
export const navigationRef = createNavigationContainerRef<ParamListBase>();
