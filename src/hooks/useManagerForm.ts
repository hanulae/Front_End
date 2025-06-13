import {useState, useCallback} from 'react';
import {
  managerFormService,
  CreateManagerFormParams,
  ManagerFormResponse,
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

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    createManagerForm,
    clearError,
  };
};
