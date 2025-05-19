import React from 'react';
import {StyleSheet, View} from 'react-native';
import Typo from '../../common/Typo';
import {IDistrict, IRegion} from '../../../interface/location';

interface Props {
  selectedRegion: IRegion | null;
  selectedDistrict: IDistrict | null;
}

const SelectedAddressView = ({selectedRegion, selectedDistrict}: Props) => {
  return (
    <View style={styles.container}>
      <Typo fontSize={14} style={styles.text}>
        {selectedRegion?.name || '시/도'}
      </Typo>
      <Typo fontSize={14} style={styles.separator}>
        -
      </Typo>
      <Typo fontSize={14} style={styles.text}>
        {selectedDistrict?.name || '시/군/구'}
      </Typo>
    </View>
  );
};

export default SelectedAddressView;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginVertical: 10,
  },
  text: {
    fontWeight: '600',
    color: '#1A1B1F',
  },
  separator: {
    marginHorizontal: 8,
    color: '#999',
  },
});
