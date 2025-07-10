import {useState, useCallback} from 'react';
import {
  CreateManagerDispatchRequestParams,
  managerDispatchRequestService,
} from '../services/api/manager/managerDispatchRequestService';
import {managerFormService} from '../services/api/manager/managerFormService';

export const useManagerDispatchRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 출동 신청
  const createManagerDispatchRequest = useCallback(
    async (dispatchRequestData: CreateManagerDispatchRequestParams) => {
      if (
        !dispatchRequestData.managerFormBidId ||
        !dispatchRequestData.managerFormId ||
        !dispatchRequestData.funeralId
      ) {
        setError('필수 정보가 누락되었습니다.');
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const result =
          await managerDispatchRequestService.createManagerDispatchRequest(
            dispatchRequestData,
          );

        if (result.success) {
          console.log('출동신청 성공: ', result);
          return result;
        } else {
          setError(result.message || '출동신청에 실패 했습니다.');
          return false;
        }
      } catch (err: any) {
        console.error('출동신청 에러 발생:', err);
        setError(err.message || '출동신청 중 오류가 발생했습니다.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // 출동 신청 내역
  const getManagerDispatchRequestList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result =
        await managerDispatchRequestService.getManagerDispatchRequestList();
      if (result.success) {
        return result;
      } else {
        setError(result.message || '출동 신청 내역 조회에 실패했습니다.');
        return false;
      }
    } catch (err: any) {
      console.error('출동 신청 내역 조회 에러 발생:', err);
      setError(err.message || '출동 신청 내역 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 출동 신청 내역 상세
  const getManagerDispatchRequestDetail = useCallback(
    async (dispatchRequestId: string) => {
      setLoading(true);
      setError(null);
      try {
        // 1. 출동 신청 내역 상세 조회
        const result =
          await managerDispatchRequestService.getManagerDispatchRequestDetail(
            dispatchRequestId,
          );

        // 2. 거래 흐름 상태 조회
        const transactionStatus =
          await managerDispatchRequestService.getManagerDispatchRequestTransactionStatus(
            dispatchRequestId,
          );

        // 3. 입찰 내용 조회
        const getManagerFormBidDetail =
          await managerFormService.getManagerFormBidDetail(
            result.data.managerFormBidId,
          );

        if (result.success && transactionStatus !== null) {
          return {
            dispatchRequest: result.data,
            transactionStatus: transactionStatus,
            managerFormBidDetail: getManagerFormBidDetail,
          };
        } else if (transactionStatus === null) {
          return {
            dispatchRequest: result,
            transactionStatus: null,
            managerFormBidDetail: getManagerFormBidDetail,
          };
        } else {
          setError(
            result.message || '출동 신청 내역 상세 조회에 실패했습니다.',
          );
          return false;
        }
      } catch (err: any) {
        console.error('출동 신청 내역 상세 조회 에러 발생:', err);
        setError(
          err.message || '출동 신청 내역 상세 조회 중 오류가 발생했습니다.',
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // 출동 취소
  const cancelManagerDispatchRequest = useCallback(
    async (dispatchRequestId: string) => {
      setLoading(true);
      setError(null);
      try {
        const result =
          await managerDispatchRequestService.cancelManagerDispatchRequest(
            dispatchRequestId,
          );
        if (result.success) {
          console.log('출동 취소 성공:', result);
          return result;
        } else {
          setError(result.message || '출동 취소에 실패했습니다.');
          return false;
        }
      } catch (err: any) {
        console.error('출동 취소 에러 발생:', err);
        setError(err.message || '출동 취소 중 오류가 발생했습니다.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // 거래 확정
  const completeManagerDispatchRequest = useCallback(
    async (dispatchRequestId: string) => {
      setLoading(true);
      setError(null);
      try {
        const result =
          await managerDispatchRequestService.completeManagerDispatchRequest(
            dispatchRequestId,
          );
        if (result.success) {
          console.log('거래 확정 성공:', result);
          return result;
        } else {
          setError(result.message || '거래 확정에 실패했습니다.');
          return false;
        }
      } catch (err: any) {
        console.error('거래 확정 에러 발생:', err);
        setError(err.message || '거래 확정 중 오류가 발생했습니다.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    createManagerDispatchRequest,
    getManagerDispatchRequestList,
    getManagerDispatchRequestDetail,
    cancelManagerDispatchRequest,
    completeManagerDispatchRequest,
    clearError,
  };
};
