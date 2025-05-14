import {useEffect, useRef} from 'react';
import {useAddressSelector} from '../../../hooks/useAddressSelector';
import {Animated, Dimensions, Pressable, StyleSheet, View} from 'react-native';
import SelectedAddressView from './SelectedAddressView';
import Typo from '../../common/Typo';
import RegionSelector from './RegionSelector';
import DistrictSelector from './DistrictSelector';
import CustomButton from '../../common/CustomButton';

const screenHeight = Dimensions.get('window').height;

interface IFindLocationModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: (locationString: string) => void;
}

const FindLocationModal = ({
  visible,
  onClose,
  onComplete,
}: IFindLocationModalProps) => {
  const {
    regions,
    districts,
    selectedRegion,
    selectedDistrict,
    handleRegionSelect,
    handleDistrictSelect,
    resetSelection,
  } = useAddressSelector();

  const translateY = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleConfirm = () => {
    if (!selectedRegion || !selectedDistrict) {
      return;
    }
    const fullLocation = `${selectedRegion.name} ${selectedDistrict.name}`;
    onComplete(fullLocation);
    onClose();
  };

  return visible ? (
    <Pressable style={styles.backdrop} onPress={onClose}>
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{translateY}],
          },
        ]}>
        <View style={styles.content}>
          <SelectedAddressView
            selectedRegion={selectedRegion}
            selectedDistrict={selectedDistrict}
          />

          {!selectedRegion ? (
            <>
              <Typo fontSize={16} style={styles.title}>
                시/도 선택
              </Typo>
              <RegionSelector
                regions={regions}
                selectedRegion={selectedRegion}
                onSelect={handleRegionSelect}
              />
            </>
          ) : (
            <>
              <Typo fontSize={16} style={styles.title}>
                시/군/구 선택
              </Typo>
              <DistrictSelector
                districts={districts}
                selectedDistrict={selectedDistrict}
                onSelect={handleDistrictSelect}
              />
            </>
          )}

          <View style={styles.buttonRow}>
            <CustomButton onPress={resetSelection} style={styles.resetButton}>
              <Typo fontSize={14}>초기화</Typo>
            </CustomButton>
            <CustomButton
              onPress={handleConfirm}
              disabled={!selectedRegion || !selectedDistrict}
              style={[
                styles.confirmButton,
                !selectedRegion || !selectedDistrict ? styles.disabled : {},
              ]}>
              <Typo fontSize={14}>선택 완료</Typo>
            </CustomButton>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  ) : null;
};

export default FindLocationModal;

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 24,
    maxHeight: '80%',
  },
  content: {
    gap: 16,
  },
  title: {
    fontWeight: '600',
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 16,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#E1E3E6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#F8E334',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#ccc',
  },
});
