# 하늘애 Readme

## 장례 서비스 앱의 프론트엔드 저장소 입니다.

- React Native 기반으로 개발되었으며 ios와 android 크로스 플랫폼 앱입니다.

## 기술 스택

- React-Native (0.78.0)
- React Query
- Jotai
- Firebase
- Notifee

## 실행 방법

### node.js 버전

v.18.20.4

#### 1. 의존성 설치

```
npm install
```

#### ios pod 설치

```
cd ios && pod install && cd ..
```

#### Metro 실행

```
npx react-native start --reset-cache
```

#### ios 실행

1. xcode 에서, ios/FuneralProject.xcworkspace 확장자 파일 선택하여 실행
2. 시뮬레이터 선택 후, 좌측 상단의 빌드 버튼 클릭 (반드시, metro가 켜진 상태로 시작.)

#### android 실행

```
npm run android
```
