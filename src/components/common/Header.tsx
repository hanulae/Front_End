import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import React, {JSX} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomButton from './CustomButton';
import Typo from './Typo';

interface IHeaderProps {
  title: string;
  homeButton?: boolean;
  logoutButton?: boolean;
  homeRouteName?: string;
  onLogoutPress?: () => void;
}

const Header = ({
  title,
  homeButton = false,
  logoutButton = false,
  homeRouteName,
  onLogoutPress,
}: IHeaderProps): JSX.Element => {
  const navigation = useNavigation<NavigationProp<any>>();
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
    <View style={styles.header}>
      <CustomButton onPress={goBack}>
        <Typo>Back</Typo>
      </CustomButton>
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
          <Typo>Logout</Typo>
        </CustomButton>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
});
