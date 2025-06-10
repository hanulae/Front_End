import {useState, useCallback} from 'react';
import {
  managerCartService,
  AddToCartParams,
} from '../services/api/manager/managerCartService';
import {FuneralData} from '../services/api/funeralService';

export const useManagerCart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 장바구니에 추가
  const addToCart = useCallback(
    async (selectedItems: FuneralData[], managerId: string) => {
      if (selectedItems.length === 0) {
        setError('선택된 장례식장이 없습니다.');
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const funeralListIds = selectedItems.map(item => item.funeralListId);

        const result = await managerCartService.addToCart({
          funeralListId: funeralListIds,
          managerId: managerId,
        });

        if (result.success) {
          console.log('✅ 장바구니 추가 성공:', result);
          return result;
        } else {
          setError(result.message || '장바구니 추가에 실패했습니다.');
          return false;
        }
      } catch (err: any) {
        console.error('❌ 장바구니 추가 에러:', err);
        setError(err.message || '장바구니 추가 중 오류가 발생했습니다.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // 장바구니 목록 조회
  const getCartList = useCallback(async (managerId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await managerCartService.getCartList(managerId);

      if (result.success) {
        console.log('✅ 장바구니 조회 성공:', result);
        return result.data;
      } else {
        setError(result.message || '장바구니 조회에 실패했습니다.');
        return null;
      }
    } catch (err: any) {
      console.error('❌ 장바구니 조회 에러:', err);
      setError(err.message || '장바구니 조회 중 오류가 발생했습니다.');
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
    addToCart,
    getCartList,
    clearError,
  };
};
