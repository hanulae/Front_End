import {useState, useCallback} from 'react';
import {
  funeralEstimateService,
  EstimateListItem,
  EstimateDetail,
  FuneralHallInfo,
  SubmitBidParams,
} from '../services/api/funeral/funeralEstimateService';

export const useFuneralEstimate = () => {
  const [estimateList, setEstimateList] = useState<EstimateListItem[]>([]);
  const [estimateDetail, setEstimateDetail] = useState<EstimateDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEstimateList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await funeralEstimateService.getEstimateList();
      console.log('전체 응답:', response);

      // 장례식장용 API 응답 처리
      const listData = response.data || [];

      setEstimateList(listData);
      console.log('처리된 견적 리스트:', listData);
      return listData;
    } catch (err: any) {
      setError(err.message);
      console.error('견적 내역 리스트 조회 실패:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEstimateDetail = useCallback(async (managerFormBidId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await funeralEstimateService.getEstimateDetail(
        managerFormBidId,
      );
      setEstimateDetail(response.data);
      return response;
    } catch (err: any) {
      setError(err.message);
      console.error('견적 상세 정보 조회 실패:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    estimateList,
    estimateDetail,
    loading,
    error,
    fetchEstimateList,
    fetchEstimateDetail,
    clearError,
  };
};

// 견적 제안서용 훅
export const useQuoteProposal = () => {
  const [hallList, setHallList] = useState<FuneralHallInfo[]>([]);
  const [estimateDetail, setEstimateDetail] = useState<EstimateDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 호실 목록 조회 (JWT 토큰에서 funeralId 자동 추출)
  const fetchHallList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await funeralEstimateService.getFuneralHallList();
      setHallList(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.message);
      console.error('호실 목록 조회 실패:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // 견적 상세 정보 조회
  const fetchEstimateDetail = useCallback(async (managerFormBidId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await funeralEstimateService.getEstimateDetail(
        managerFormBidId,
      );
      setEstimateDetail(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.message);
      console.error('견적 상세 정보 조회 실패:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 입찰 제출
  const submitBid = useCallback(async (bidData: SubmitBidParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await funeralEstimateService.submitBid(bidData);
      return response;
    } catch (err: any) {
      setError(err.message);
      console.error('입찰 제출 실패:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 장례식장 입찰 상세 내용 조회
  const fetchManagerFormBidDetail = useCallback(
    async (managerFormBidId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await funeralEstimateService.getManagerFormBidDetail(
          managerFormBidId,
        );
        return response.data;
      } catch (err: any) {
        setError(err.message);
        console.error('장례식장 입찰 상세 내용 조회 실패:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    hallList,
    estimateDetail,
    loading,
    error,
    fetchHallList,
    fetchEstimateDetail,
    submitBid,
    fetchManagerFormBidDetail,
  };
};
