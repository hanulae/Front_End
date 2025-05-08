import {CommonActions, useNavigation} from '@react-navigation/native';
import React, {JSX} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomButton from './CustomButton';
import Typo from './Typo';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LogoutButtonBlack from '../../assets/Header/Header_DoorBlack.svg';
import LogoutButtonWhite from '../../assets/Header/Header_DoorWhite.svg';

interface IFuneralHeaderProps {
  title?: string;
  homeButton?: boolean;
  logoutButton?: boolean;
  homeRouteName?: string;
  onLogoutPress?: () => void;
  color?: string;
  backButtonVisible?: boolean;
  logoutColor?: string;
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
          <Typo>Back</Typo>
        </CustomButton>
      )}

      <Typo fontSize={16} color="black">
        {title}
      </Typo>
      {homeButton && (
        <CustomButton onPress={goHome}>
          <Typo>Home</Typo>
        </CustomButton>
      )}
      {logoutButton && (
        <CustomButton onPress={() => onLogoutPress}>
          {logoutColor ? (
            <LogoutButtonBlack width={24} height={24} />
          ) : (
            <LogoutButtonWhite width={24} height={24} />
          )}
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
    // padding: 16,
    // borderWidth: 1,
    marginVertical: 8,
    backgroundColor: '#fff',
  },
});
