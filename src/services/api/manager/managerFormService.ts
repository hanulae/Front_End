import api from '../../../api/config';

interface CreateManagerFormParams {
  funeralList: string[]; // 견적서 발송 장례식 리스트
  chiefMournerName: string; // 상주 이름
  numberOfMourners: number; // 예상 조문객 수
  checkInDate: string; // 입실일자 (YYYY-MM-DD)
  checkOutDate: string; // 퇴실일자 (YYYY-MM-DD)
  deceasedName?: string; // 고인 이름 (선택)
  roomSize?: number; // 평수 (선택)
}

interface CreateManagerFormResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface ManagerFormList {
  managerFormId: string;
  chiefMournerName: string;
  deceasedName: string;
  numberOfMourners: number;
  checkInDate: string;
  checkOutDate: string;
  formStatus: 'request' | 'completed' | 'cancelled';
  createdAt: string;
  bidCount: number;
  roomSize: number;
}

interface GetManagerFormListResponse {
  success: boolean;
  message?: string;
  data: {
    managerFormList: ManagerFormList[];
  };
}

interface UserManagerFormList {
  managerFormBidId: string;
  bidStatus:
    | 'pending'
    | 'bid_submitted'
    | 'bid_selected'
    | 'bid_progress'
    | 'transaction_completed'
    | 'rejected'
    | 'expired';
  funeralName: string;
  funeralAddress: string;
}

interface GetUserManagerFormResponse {
  success: boolean;
  message?: string;
  data: {
    managerFormDetail: UserManagerFormList[];
  };
}

interface GetManagerFormBidDetailResponse {
  success: boolean;
  message?: string;
  data: {
    managerFormBidId: string;
    managerFormId: string;
    funeralId: string;
    funeralName: string;
    funeralHallName: string;
    funeralHallSize: number;
    funeralHallNumberOfMourners: number;
    funeralHallPrice: number;
    funeralHallDetailPrice: number;
    funeralProponentMoney: number;
    funeralDiscount: number;
    bidStatus: string;
    bidSubmittedAt: string;
  };
}

export const managerFormService = {
  // 견적서 발송 (견적서 생성)
  createManagerForm: async (
    params: CreateManagerFormParams,
  ): Promise<CreateManagerFormResponse> => {
    try {
      const response = await api.post('/manager/form/create', params);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error('견적서 발송 서버 에러: ', {
          status: error.response.status,
          message: error.response.message,
        });
        throw new Error(
          `견적서 발송 실패: ${
            error.response.data?.message || '알 수 없는 오류 발생'
          }`,
        );
      } else {
        console.error('견적서 발송 요청 에러: ', error.message);
        throw new Error(`요청 에러: ${error.message}`);
      }
    }
  },

  // 견적 내역 리스트 조회
  getManagerFormList: async (): Promise<GetManagerFormListResponse> => {
    try {
      const response = await api.get('/manager/form/list');
      return response.data;
    } catch (error: any) {
      console.error('견적 내역 리스트 조회 에러: ', error.message);
      throw new Error(`견적 내역 리스트 조회  에러: ${error.message}`);
    }
  },

  // 고객 견적서 조회
  getUserManagerFormList: async (
    managerFormId: string,
  ): Promise<GetUserManagerFormResponse> => {
    try {
      const response = await api.get(`/manager/form/bid/list/${managerFormId}`);
      return response.data;
    } catch (error: any) {
      console.log('고객 견적서 조회 에러: ', error.message);
      throw new Error(`고객 견적서 조회 에러: ${error.message}`);
    }
  },

  // 견적 입찰 상세 조회
  getManagerFormBidDetail: async (
    managerFormBidId: string,
  ): Promise<GetManagerFormBidDetailResponse> => {
    try {
      const response = await api.get(
        `/manager/form/bid/detail/${managerFormBidId}`,
      );

      console.log('!!!! response: ', response.data);

      return response.data;
    } catch (error: any) {
      console.log('견적 입찰 상세 조회 에러: ', error.message);
      throw new Error(`견적 입찰 상세 조회 에러: ${error.message}`);
    }
  },
};

export type {
  CreateManagerFormParams,
  CreateManagerFormResponse,
  ManagerFormList,
  GetManagerFormListResponse,
  UserManagerFormList,
  GetUserManagerFormResponse,
  GetManagerFormBidDetailResponse,
};
