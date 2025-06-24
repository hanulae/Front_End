import {useState, useCallback} from 'react';
import {
  managerFormService,
  CreateManagerFormParams,
  CreateManagerFormResponse,
  ManagerFormList,
  GetManagerFormListResponse,
  UserManagerFormList,
  GetUserManagerFormResponse,
} from '../services/api/manager/managerFormService';

export const useManagerForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 견적서 발송
  const createManagerForm = useCallback(
    async (params: CreateManagerFormParams) => {
      setLoading(true);
      setError(null);

      try {
        const result = await managerFormService.createManagerForm(params);

        if (result.success) {
          console.log('견적서 발송 성공: ', result);
          return result;
        } else {
          setError(result.message || '견적서 발송에 실패했습니다.');
          return null;
        }
      } catch (err: any) {
        console.error('견적서 발송 에러: ', err);
        setError(err.message || '견적서 발송 중 오류가 발생하였습니다.');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // 견적 내역 리스트 조회
  const getManagerFormList = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await managerFormService.getManagerFormList();

      if (response.success) {
        console.log('견적 내역 불러오기 성공', response.data.managerFormList);
        return response.data.managerFormList;
      } else {
        setError(response.message || '견적 내역 불러오기에 실패했습니다.');
        return null;
      }
    } catch (err: any) {
      console.error('견적 내역 불러오기 에러: ', err);
      setError(err.message || '견적 내역 불러오기 중 오류가 발생하였습니다.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 고객 견적서 조회
  const getUserManagerFormList = useCallback(async (managerFormId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await managerFormService.getUserManagerFormList(
        managerFormId,
      );

      if (response.success) {
        console.log(
          '고객 견적서 리스트 불러오기 성공',
          response.data.managerFormDetail,
        );
        return response.data.managerFormDetail;
      } else {
        setError(
          response.message || '고객 견적서 리스트 불러오기에 실패했습니다.',
        );
        return null;
      }
    } catch (err: any) {
      console.error('고객 견적서 리스트 불러오기 에러: ', err);
      setError(
        err.message || '고객 견적서 리스트 불러오기 중 오류가 발생하였습니다.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 고객 견적 입찰 상세 조회
  const getManagerFormBidDetail = useCallback(
    async (managerFormBidId: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await managerFormService.getManagerFormBidDetail(
          managerFormBidId,
        );

        if (response.success) {
          console.log('고객 견적 입찰 상세 조회 성공', response.data);
          return response.data;
        } else {
          setError(
            response.message || '고객 견적 입찰 상세 조회에 실패했습니다.',
          );
          return null;
        }
      } catch (err: any) {
        console.error('고객 견적 입찰 상세 조회 에러: ', err);
        setError(
          err.message || '고객 견적 입찰 상세 조회 중 오류가 발생하였습니다.',
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    createManagerForm,
    getManagerFormList,
    getUserManagerFormList,
    clearError,
    getManagerFormBidDetail,
  };
};
