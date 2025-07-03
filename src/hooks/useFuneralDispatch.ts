import {useState, useCallback} from 'react';
import {
  funeralDispatchService,
  DispatchListItem,
  DispatchDetail,
  FuneralHallInfo,
} from '../services/api/funeral/funeralDispatchService';

export const useFuneralDispatch = () => {
  const [dispatchList, setDispatchList] = useState<DispatchListItem[]>([]);
  const [dispatchDetail, setDispatchDetail] = useState<DispatchDetail | null>(
    null,
  );
  const [funeralHallInfo, _setFuneralHallInfo] =
    useState<FuneralHallInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 출동 대기 내역 조회
  const fetchDispatchList = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await funeralDispatchService.getDispatchList();
      console.log('출동 대기 내역 조회 성공 In hook: ', response);

      const listData = response.data || [];

      setDispatchList(listData);
      console.log('출동 대기 내역 조회 성공 In hook: ', listData);
      return listData;
    } catch (err: any) {
      setError(err.message);
      console.error('출동 대기 내역 조회 에러 In hook: ', err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // 출동 요청 상세 조회
  const fetchDispatchDetail = useCallback(async (dispatchRequestId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await funeralDispatchService.getDispatchDetail(
        dispatchRequestId,
      );
      const detailData = response.data || null;

      setDispatchDetail(detailData);
      console.log('출동 요청 상세 조회 성공 In hook: ', detailData);
      return detailData;
    } catch (err: any) {
      setError(err.message);
      console.error('출동 요청 상세 조회 에러 In hook: ', err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 출동 승인
  const approveDispatch = useCallback(async (dispatchRequestId: string) => {
    setLoading(true);
    setError(null);

    try {
      await funeralDispatchService.approveDispatch(dispatchRequestId);
      console.log('출동 승인 요청 성공');
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('출동 승인 요청 에러 In hook: ', err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // 장례식장 호실 정보 조회 by managerFormBidId
  const fetchFuneralHallInfo = useCallback(async (managerFormBidId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await funeralDispatchService.getFuneralHallInfoByBidId(
        managerFormBidId,
      );

      console.log('장례식장 호실 정보 조회 성공 In hook: ', response.data);
      return response.data;
    } catch (err: any) {
      setError(err.message);
      console.error('장례식장 호실 정보 조회 에러 In hook: ', err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 장례식장 거래 확정
  const confirmTransaction = useCallback(async (dispatchRequestId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await funeralDispatchService.confirmTransaction(
        dispatchRequestId,
      );

      console.log('장례식장 거래 확정 성공 In hook: ', response);
      return response;
    } catch (err: any) {
      setError(err.message);
      console.error('장례식장 거래 확정 에러 In hook: ', err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    dispatchList,
    loading,
    error,
    fetchDispatchList,
    fetchDispatchDetail,
    dispatchDetail,
    approveDispatch,
    fetchFuneralHallInfo,
    funeralHallInfo,
    confirmTransaction,
  };
};
