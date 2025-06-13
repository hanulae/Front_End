import api from '../../../api/config';

interface AddToCartParams {
  funeralListId: string[];
}

interface deleteFromCartParams {
  managerCartId: string[];
}

interface CartResponse {
  success: boolean;
  message: string;
  addedCount: number;
  alreadyExistsCount?: number;
  data?: any;
}

export const managerCartService = {
  // 장바구니 추가
  addToCart: async (params: AddToCartParams): Promise<CartResponse> => {
    try {
      const response = await api.post('/manager/cart/add', {
        funeralListId: params.funeralListId,
      });

      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error('❌ 장바구니 추가 서버 에러:', {
          상태코드: error.response.status,
          응답데이터: error.response.data,
          URL: error.config?.url,
        });
        throw new Error(
          `장바구니 추가 실패: ${
            error.response.data?.message || '알 수 없는 오류'
          }`,
        );
      } else if (error.request) {
        console.error('❌ 장바구니 추가 네트워크 에러:', error.request);
        throw new Error('네트워크 연결을 확인해주세요');
      } else {
        console.error('❌ 장바구니 추가 요청 에러:', error.message);
        throw new Error(`요청 에러: ${error.message}`);
      }
    }
  },

  // 장바구니 목록 조회
  getCartList: async (): Promise<CartResponse> => {
    try {
      const response = await api.get('/manager/cart/list');

      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error('❌ 장바구니 조회 서버 에러:', error.response);
        throw new Error(
          `장바구니 조회 실패: ${
            error.response.data?.message || '알 수 없는 오류'
          }`,
        );
      } else if (error.request) {
        console.error('❌ 장바구니 조회 네트워크 에러:', error.request);
        throw new Error('네트워크 연결을 확인해주세요');
      } else {
        console.error('❌ 장바구니 조회 요청 에러:', error.message);
        throw new Error(`요청 에러: ${error.message}`);
      }
    }
  },

  // 장바구니 삭제
  deleteFromCart: async (
    params: deleteFromCartParams,
  ): Promise<CartResponse> => {
    try {
      const response = await api.delete('/manager/cart/delete', {
        data: {
          managerCartId: params.managerCartId,
        },
      });

      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error('❌ 장바구니 삭제 서버 에러:', error.response);
        throw new Error(
          `장바구니 삭제 실패: ${
            error.response.data?.message || '알 수 없는 오류'
          }`,
        );
      } else if (error.request) {
        console.error('❌ 장바구니 삭제 네트워크 에러:', error.request);
        throw new Error('네트워크 연결을 확인해주세요');
      } else {
        console.error('❌ 장바구니 삭제 요청 에러:', error.message);
        throw new Error(`요청 에러: ${error.message}`);
      }
    }
  },
};

export type {AddToCartParams, CartResponse, deleteFromCartParams};
