import {CommonActions, useNavigation} from '@react-navigation/native';
import React, {JSX} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomButton from './CustomButton';
import Typo from './Typo';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LogoutButtonBlack from '../../assets/Header/Header_DoorBlack.svg';
import LogoutButtonWhite from '../../assets/Header/Header_DoorWhite.svg';
import BackIcon from '../../assets/Header/Header_Back.svg';
import HomeIcon from '../../assets/Header/Header_Home.svg';
import CloseIcon from '../../assets/Icon/Icon_BtnClose01.svg';

interface IFuneralHeaderProps {
  title?: string;
  homeButton?: boolean;
  logoutButton?: boolean;
  homeRouteName?: string;
  onLogoutPress: () => void;
  color?: string;
  backButtonVisible?: boolean;
  logoutColor?: string;
  closeButton?: boolean;
}

const FuneralHeader = ({
  title,
  color,
  logoutColor,
  homeButton = false,
  logoutButton = false,
  homeRouteName,
  onLogoutPress,
  backButtonVisible = false,
  closeButton = false,
}: IFuneralHeaderProps): JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const goBack = navigation.goBack;
  const goHome = () => {
    if (homeRouteName) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: homeRouteName}],
        }),
      );
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Main'}],
        }),
      );
    }
  };
  return (
    <View style={[styles.header, {backgroundColor: color}]}>
      {backButtonVisible && (
        <CustomButton onPress={goBack}>
          <BackIcon width={24} height={24} />
        </CustomButton>
      )}

      <Typo style={styles.title}>{title}</Typo>
      {homeButton && (
        <CustomButton onPress={goHome}>
          <HomeIcon width={24} height={24} />
        </CustomButton>
      )}
      {logoutButton && (
        <CustomButton onPress={onLogoutPress}>
          {logoutColor ? (
            <LogoutButtonBlack width={24} height={24} />
          ) : (
            <LogoutButtonWhite width={24} height={24} />
          )}
        </CustomButton>
      )}
      {closeButton && (
        <CustomButton onPress={goBack}>
          <CloseIcon width={24} height={24} />
        </CustomButton>
      )}
    </View>
  );
};

export default FuneralHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Pretendard-Bold',
  },
});
