import { useEffect, useRef, useState } from 'react';
import {Animated, Dimensions, Pressable, StyleSheet, View} from 'react-native';
import api from '../../../api/config';
import RegionSelector from './RegionSelector';

interface IFindCityBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (region: string) => void;
    selectedRegion: string;
}

const screenHeight = Dimensions.get('window').height;

const FindCityBottomSheet = ({visible, onClose, onSelect, selectedRegion}: IFindCityBottomSheetProps) => {
    const [regions, setRegions] = useState<string[]>([]);
    
    // 시 / 도 데이터 받아오기
    const fetchCityData = async () => {
        try {
            const response = await api.get('/manager/funeral/regions');
            setRegions(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchCityData();
    }, []);

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

    const handleSelect = (region: string) => {
        onSelect(region);
        onClose();
    };
    
    return (
        <Pressable style={styles.backdrop} onPress={onClose}>
            <Animated.View style={[styles.modalContainer, {transform: [{translateY}]}]}>
                <View style={styles.content}>
                    <RegionSelector
                        regions={regions}
                        selectedRegion={selectedRegion}
                        onSelect={handleSelect}
                    />
                </View>
            </Animated.View>
        </Pressable>
    )
};

export default FindCityBottomSheet;

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