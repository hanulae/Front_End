import {useEffect, useState} from 'react';
import {IDistrict, IRegion} from '../interface/location';

export const useAddressSelector = () => {
  const [regions, setRegions] = useState<IRegion[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<IRegion | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<IDistrict | null>(
    null,
  );

  const fetchRegions = async () => {
    // Fetch regions from API
    try {
      // const response = await fetch("https://api.example.com/regions");
      // setRegions(await response.json());
    } catch (error) {
      console.error('Error fetching regions:', error);
    }
  };

  const fetchDistricts = async (regionId: number) => {
    try {
      // const response = await fetch(`https://api.example.com/districts?regionId=${regionId}`);
      // setDistricts(await response.json());
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const handleRegionSelect = (region: IRegion) => {
    setSelectedRegion(region);
    setSelectedDistrict(null); // Reset selected district when region changes
    fetchDistricts(region.regionId);
  };

  const handleDistrictSelect = (district: IDistrict) => {
    setSelectedDistrict(district);
  };

  const resetSelection = () => {
    setSelectedRegion(null);
    setSelectedDistrict(null);
    setDistricts([]);
    setRegions([]);
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  return {
    regions,
    districts,
    selectedRegion,
    selectedDistrict,
    handleRegionSelect,
    handleDistrictSelect,
    resetSelection,
  };
};
