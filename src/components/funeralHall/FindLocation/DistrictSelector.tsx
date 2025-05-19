import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {IDistrict} from '../../../interface/location';
import Typo from '../../common/Typo';

const formatList = (list: IDistrict[], numColumns: number) => {
  const remainder = list.length % numColumns;
  if (remainder === 0) return list;

  const emptySlots = numColumns - remainder;
  return [...list, ...Array(emptySlots).fill(null)];
};

interface IDistrictSelectorProps {
  districts: IDistrict[];
  selectedDistrict: IDistrict | null;
  onSelect: (district: IDistrict) => void;
}

const DistrictSelector = ({
  districts,
  selectedDistrict,
  onSelect,
}: IDistrictSelectorProps) => {
  const formattedList = formatList(districts, 3);

  return (
    <FlatList
      data={formattedList}
      numColumns={3}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({item}) =>
        item ? (
          <TouchableOpacity
            style={[
              styles.button,
              selectedDistrict?.districtId === item.districtId &&
                styles.selectedButton,
            ]}
            onPress={() => onSelect(item)}>
            <Typo fontSize={14}>{item.name}</Typo>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyButton} />
        )
      }
    />
  );
};

export default DistrictSelector;

const styles = StyleSheet.create({
  button: {
    flex: 1,
    padding: 10,
    margin: 2,
    borderWidth: 1,
    borderColor: '#E1E3E6',
    alignItems: 'center',
    borderRadius: 6,
  },
  selectedButton: {
    backgroundColor: '#F8E334',
  },
  emptyButton: {
    flex: 1,
    margin: 2,
    padding: 10,
    borderColor: 'transparent',
    borderWidth: 1,
  },
});
