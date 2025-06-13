import {useState, useCallback} from 'react';
import {
  managerCartService,
  AddToCartParams,
  deleteFromCartParams,
} from '../services/api/manager/managerCartService';
import {FuneralData} from '../services/api/funeralService';

export const useManagerCart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 장바구니에 추가
  const addToCart = useCallback(async (selectedItems: FuneralData[]) => {
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
  }, []);

  // 장바구니 목록 조회
  const getCartList = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await managerCartService.getCartList();

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

  // 장바구니 삭제
  const deleteFromCart = useCallback(async (managerCartId: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const result = await managerCartService.deleteFromCart({
        managerCartId: managerCartId,
      });

      if (result.success) {
        console.log('✅ 장바구니 삭제 성공:', result);
        return result;
      } else {
        setError(result.message || '장바구니 삭제에 실패했습니다.');
        return false;
      }
    } catch (err: any) {
      console.error('❌ 장바구니 삭제 에러:', err);
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
    deleteFromCart,
    clearError,
  };
};
