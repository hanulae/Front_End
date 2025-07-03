import api from '../../../api/config';

export interface DispatchListItem {
  dispatchRequestId: string;
  chiefMournerName: string;
  isApproved: string;
  createdAt: string;
}

export interface GetDispatchListResponse {
  success: boolean;
  data: DispatchListItem[];
}

export interface DispatchDetail {
  dispatchRequestId: string;
  address: string;
  addressDetail: string;
  famPhoneNumber: string | null;
  managerPhoneNumber: string;
  emergencyPhoneNumber: string | null;
  isApproved: 'pending' | 'approved' | 'rejected' | 'completed';
  managerId: string;
  funeralId: string;
  managerFormId: string;
  managerFormBidId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface GetDispatchDetailResponse {
  success: boolean;
  data: DispatchDetail;
}

export interface GetDispatchApproveResponse {
  success: boolean;
  message: string;
}

export interface FuneralHallInfo {
  funeralHallName: string;
  funeralHallPrice: number;
  funeralHallDetailPrice: number;
  proponentMoney: number;
  discount: number;
}

export interface GetFuneralHallInfoResponse {
  success: boolean;
  data: FuneralHallInfo;
}

export interface GetConfirmTransactionResponse {
  success: boolean;
  message: string;
  status: string;
}

export const funeralDispatchService = {
  // 출동 요청 내역 조회 (출동 대기 내역)
  getDispatchList: async (): Promise<GetDispatchListResponse> => {
    try {
      const response = await api.get('/funeral/request/list');

      return response.data;
    } catch (error: any) {
      console.error('출동 대기 내역 조회 에러: ', error.message);
      throw new Error(`출동 대기 내역 조회 에러: ${error.message}`);
    }
  },

  // 출동 요청 상세 조회
  getDispatchDetail: async (
    dispatchRequestId: string,
  ): Promise<GetDispatchDetailResponse> => {
    try {
      const response = await api.get(
        `/funeral/request/detail/${dispatchRequestId}`,
      );

      return response.data;
    } catch (error: any) {
      console.error('출동 요청 상세 조회 에러: ', error.message);
      throw new Error(`출동 요청 상세 조회 에러: ${error.message}`);
    }
  },

  // 출동 승인
  approveDispatch: async (
    dispatchRequestId: string,
  ): Promise<GetDispatchApproveResponse> => {
    try {
      const response = await api.post(
        `/funeral/request/approve/${dispatchRequestId}`,
      );

      return response.data;
    } catch (error: any) {
      console.error('출동 승인 에러: ', error.message);
      throw new Error(`출동 승인 에러: ${error.message}`);
    }
  },

  // 장례식장 호실 정보 조회 by managerFormBidId
  getFuneralHallInfoByBidId: async (
    managerFormBidId: string,
  ): Promise<GetFuneralHallInfoResponse> => {
    try {
      const response = await api.get(
        `/funeral/request/hall-info/${managerFormBidId}`,
      );

      return response.data;
    } catch (error: any) {
      console.error('장례식장 호실 정보 조회 에러: ', error.message);
      throw new Error(`장례식장 호실 정보 조회 에러: ${error.message}`);
    }
  },

  // 장례식장 거래 확정
  confirmTransaction: async (
    dispatchRequestId: string,
  ): Promise<GetConfirmTransactionResponse> => {
    try {
      const response = await api.post(
        `/funeral/request/complete/${dispatchRequestId}`,
      );

      return response.data;
    } catch (error: any) {
      console.error('장례식장 거래 확정 에러: ', error);

      // 서버 에러 메시지 추출
      let errorMessage = '장례식장 거래 확정 에러가 발생했습니다.';

      if (error.response?.data?.message) {
        // 서버에서 JSON 형태 에러 메시지
        errorMessage = error.response.data.message;
      } else if (error.message) {
        // 네트워크 에러 등
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
};
