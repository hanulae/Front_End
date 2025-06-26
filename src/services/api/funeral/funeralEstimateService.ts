import api from '../../../api/config';

// 견적 내역 리스트 아이템 타입 (장례식장용)
export interface EstimateListItem {
  managerFormBidId: string;
  managerFormCreatedAt: string;
  bidSubmittedAt: string | null;
  bidStatus:
    | 'pending'
    | 'bid_submitted'
    | 'bid_selected'
    | 'bid_progress'
    | 'deceased_arrived'
    | 'transaction_completed'
    | 'rejected'
    | 'expired';
}

// 견적 내역 리스트 응답 타입 (장례식장용)
export interface GetEstimateListResponse {
  success: boolean;
  data: EstimateListItem[];
}

// 견적 상세 정보 타입 (managerFormBid 상세)
export interface EstimateDetail {
  chiefMournerName: string;
  deceasedName?: string;
  numberOfMourners: number;
  roomSize?: number;
  checkInDate: string;
  checkOutDate: string;
  formStatus: string;
}

// 견적 상세 응답 타입
export interface GetEstimateDetailResponse {
  success: boolean;
  data: EstimateDetail;
}

// 호실 정보 타입
export interface FuneralHallInfo {
  funeralHallId: string;
  funeralHallName: string;
  funeralHallSize: number;
  funeralHallNumberOfMourners: number;
  funeralHallPrice: number;
  funeralHallDetailPrice: number;
  funeralHallStatus: 'available' | 'unavailable' | 'reserved';
  version: number;
}

// 호실 목록 응답 타입
export interface GetFuneralHallListResponse {
  success: boolean;
  data: FuneralHallInfo[];
  pageInfo?: {
    currentPage: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    isLast: boolean;
    itemsPerPage: number;
  };
}

// 입찰 제출 파라미터 타입
export interface SubmitBidParams {
  managerFormBidId: string;
  funeralHallId: string;
  proponentMoney: number;
  discount: number;
}

// 입찰 제출 응답 타입
export interface SubmitBidResponse {
  success: boolean;
  message: string;
}

export const funeralEstimateService = {
  // 견적 내역 리스트 조회
  getEstimateList: async (): Promise<GetEstimateListResponse> => {
    try {
      const response = await api.get('/funeral/form/list');
      return response.data;
    } catch (error: any) {
      console.error('견적 내역 리스트 조회 에러:', error.message);
      throw new Error(`견적 내역 리스트 조회 에러: ${error.message}`);
    }
  },

  // 견적 상세 정보 조회 (managerFormBid 상세)
  getEstimateDetail: async (
    managerFormBidId: string,
  ): Promise<GetEstimateDetailResponse> => {
    try {
      const response = await api.get(
        `/funeral/form/detail?managerFormBidId=${managerFormBidId}`,
      );
      console.log('견적 상세 정보 조회 성공:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('견적 상세 정보 조회 에러:', error.message);
      throw new Error(`견적 상세 정보 조회 에러: ${error.message}`);
    }
  },

  // 호실 목록 조회 (JWT 토큰에서 funeralId 자동 추출)
  getFuneralHallList: async (
    page = 1,
    limit = 10,
  ): Promise<GetFuneralHallListResponse> => {
    try {
      const params = {page, limit};

      const response = await api.get('/funeral/hall/list', {params});
      console.log('호실 목록 조회 성공:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('호실 목록 조회 에러:', error.message);
      throw new Error(`호실 목록 조회 에러: ${error.message}`);
    }
  },

  // 입찰 제출
  submitBid: async (bidData: SubmitBidParams): Promise<SubmitBidResponse> => {
    try {
      const response = await api.put('/funeral/form/bid', bidData);
      console.log('입찰 제출 성공:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('입찰 제출 에러:', error.message);
      throw new Error(`입찰 제출 에러: ${error.message}`);
    }
  },
};
