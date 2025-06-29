import {useCallback, useState} from 'react';
import {funeralHallInfoService} from '../services/api/funeral/funeralHallInfoService';

export const useFuneralHallInfo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [funeralHallList, setFuneralHallList] = useState<any[]>([]);
  const [funeralHallDetail, setFuneralHallDetail] = useState<any>(null);

  // 장례식장 호실 정보 리스트 조회
  const fetchFuneralHallList = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await funeralHallInfoService.getFuneralHallList();

      console.log('✅ 장례식장 호실 정보 리스트 조회 성공:', response);

      if (response.success && response.data) {
        setFuneralHallList(response.data);
        return response.data;
      } else {
        throw new Error(response.message || '호실 정보 조회 중 오류 발생');
      }
    } catch (err: any) {
      const errorMessage =
        err.message || '호실 정보 조회 중 오류가 발생했습니다';
      setError(errorMessage);
      console.error('❌ 장례식장 호실 정보 리스트 조회 실패:', err);
      setFuneralHallList([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // 장례식장 호실 정보 상세 조회
  const fetchFuneralHallDetail = useCallback(async (funeralHallId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await funeralHallInfoService.getFuneralHallDetail(
        funeralHallId,
      );

      console.log('✅ 장례식장 호실 정보 상세 조회 성공:', response);

      if (response.success && response.data) {
        setFuneralHallDetail(response.data);
        return response.data;
      } else {
        throw new Error(response.message || '호실 상세 정보 조회 중 오류 발생');
      }
    } catch (err: any) {
      const errorMessage =
        err.message || '호실 상세 정보 조회 중 오류가 발생했습니다';
      setError(errorMessage);
      console.error('❌ 장례식장 호실 정보 상세 조회 실패:', err);
      setFuneralHallDetail(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 장례식장 호실 정보 추가
  const addFuneralHallInfo = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await funeralHallInfoService.addFuneralHallInfo(data);

      console.log('✅ 장례식장 호실 정보 추가 성공:', response);

      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || '호실 정보 추가 중 오류 발생');
      }
    } catch (err: any) {
      const errorMessage =
        err.message || '호실 정보 추가 중 오류가 발생했습니다';
      setError(errorMessage);
      console.error('❌ 장례식장 호실 정보 추가 중 실패: ', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 장례식장 호실 정보 수정
  const updateFuneralHallInfo = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await funeralHallInfoService.updateFuneralHallInfo(data);

      console.log('✅ 장례식장 호실 정보 수정 성공:', response);

      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || '호실 정보 수정 중 오류 발생');
      }
    } catch (err: any) {
      const errorMessage =
        err.message || '호실 정보 수정 중 오류가 발생했습니다';
      setError(errorMessage);
      console.error('❌ 장례식장 호실 정보 수정 중 실패: ', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 장례식장 호실 정보 삭제
  const deleteFuneralHallInfo = useCallback(async (funeralHallId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await funeralHallInfoService.deleteFuneralHallInfo(
        funeralHallId,
      );

      console.log('✅ 장례식장 호실 정보 삭제 성공:', response);

      if (response.success) {
        // 로컬 상태에서도 삭제된 항목 제거
        setFuneralHallList(prev =>
          prev.filter(hall => hall.funeralHallId !== funeralHallId),
        );
        return response;
      } else {
        throw new Error(response.message || '호실 정보 삭제 중 오류 발생');
      }
    } catch (err: any) {
      const errorMessage =
        err.message || '호실 정보 삭제 중 오류가 발생했습니다';
      setError(errorMessage);
      console.error('❌ 장례식장 호실 정보 삭제 중 실패: ', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    funeralHallList,
    funeralHallDetail,
    fetchFuneralHallList,
    fetchFuneralHallDetail,
    addFuneralHallInfo,
    updateFuneralHallInfo,
    deleteFuneralHallInfo,
    clearError,
  };
};
