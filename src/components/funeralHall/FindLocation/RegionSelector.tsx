import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import Typo from '../../common/Typo';

const formatList = (list: string[], numColumns: number) => {
  const remainder = list.length % numColumns;
  if (remainder === 0) {
    return list;
  }

  const emptySlots = numColumns - remainder;
  return [...list, ...Array(emptySlots).fill(null)];
};

interface IRegionSelectorProps {
  regions: string[];
  selectedRegion: string;
  onSelect: (region: string) => void;
}

const RegionSelector = ({
  regions,
  selectedRegion,
  onSelect,
}: IRegionSelectorProps) => {
  const formattedList = formatList(regions, 3);

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
              selectedRegion === item && styles.selectedButton,
            ]}
            onPress={() => onSelect(item)}>
            <Typo fontSize={14} style={[styles.buttonText, selectedRegion === item && styles.selectedButtonText]}>{item}</Typo>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyButton} />
        )
      }
    />
  );
};

export default RegionSelector;

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
  buttonText: {
    color: '#280342',
  },
  selectedButton: {
    backgroundColor: '#280342',
  },
  selectedButtonText: {
    color: '#fff',
  },
  emptyButton: {
    flex: 1,
    margin: 2,
    padding: 10,
    borderColor: 'transparent',
    borderWidth: 1,
  },
});
