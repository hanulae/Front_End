import { useEffect, useRef, useState, useCallback } from 'react';
import {Animated, Dimensions, Pressable, StyleSheet, View} from 'react-native';
import api from '../../../api/config';
import DistrictSelector from './DistrictSelector';

interface IFindGuBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (district: string) => void;
    selectedDistrict: string;
    selectedRegion: string;
}

const screenHeight = Dimensions.get('window').height;

const FindGuBottomSheet = ({visible, onClose, onSelect, selectedDistrict, selectedRegion}: IFindGuBottomSheetProps) => {
    const [districts, setDistricts] = useState<string[]>([]);
    
    // 군 / 구 데이터 받아오기
    const fetchGuData = useCallback(async () => {
        if (!selectedRegion || selectedRegion === '시 / 도') return;
        
        try {
            const response = await api.get('/manager/funeral/cities', {
                params: { region: selectedRegion }
            });
            setDistricts(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }, [selectedRegion]);

    useEffect(() => {
        if (visible && selectedRegion && selectedRegion !== '시 / 도') {
            fetchGuData();
        }
    }, [visible, selectedRegion, fetchGuData]);

    // 애니메이션 관련 설정
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
    }, [visible, translateY]);

    const handleSelect = (district: string) => {
        onSelect(district);
        onClose();
    };
    
    return (
        <Pressable style={styles.backdrop} onPress={onClose}>
            <Animated.View style={[styles.modalContainer, {transform: [{translateY}]}]}>
                <View style={styles.content}>
                    <DistrictSelector
                        districts={districts}
                        selectedDistrict={selectedDistrict}
                        onSelect={handleSelect}
                    />
                </View>
            </Animated.View>
        </Pressable>
    )
};

export default FindGuBottomSheet;

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
        height: screenHeight * 0.5,
    },
    content: {
        flex: 1,
        gap: 16,
    },
});