import api from '../../../api/config';

interface CreateManagerDispatchRequestParams {
  managerFormBidId: string;
  managerFormId: string;
  funeralId: string;
  address: string;
  addressDetail: string;
  famPhoneNumber?: string;
  managerPhoneNumber: string;
  emergencyPhoneNumber?: string;
}

interface CreateManagerDispatchRequestResponse {
  success: boolean;
  message?: string;
  data?: {
    dispatchRequestId: string;
  };
}

interface ManagerDispatchRequestList {
  dispatchRequestId: string;
  chiefMournerName: string;
  isApproved: string;
  createdAt: string;
}

interface GetManagerDispatchRequestList {
  success: boolean;
  message?: string;
  data: ManagerDispatchRequestList[];
}

interface DispatchRequest {
  dispatchRequestId: string;
  address: string;
  addressDetail: string;
  famPhoneNumber?: string;
  managerPhoneNumber: string;
  emergencyPhoneNumber?: string;
  isApproved: string;
  managerId: string;
  funeralId: string;
  managerFormId: string;
  managerFormBidId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface GetManagerDispatchRequestDetail {
  success: boolean;
  message?: string;
  data: DispatchRequest;
}

// 출동 취소 응답 타입
interface CancelManagerDispatchResponse {
  success: boolean;
  message: string;
}

// 거래 확정 응답 타입
interface CompleteManagerDispatchResponse {
  success: boolean;
  message: string;
  status: 'waiting_counterpart' | 'already_completed' | 'completed';
}

export const managerDispatchRequestService = {
  // 출동 신청
  createManagerDispatchRequest: async (
    params: CreateManagerDispatchRequestParams,
  ): Promise<CreateManagerDispatchRequestResponse> => {
    try {
      const response = await api.post('/manager/request/create', params);
      console.log('출동신청 성공: ', response.data);
      return response.data;
    } catch (error: any) {
      console.error('출동신청 에러 발생: ', error.message);
      throw new Error(`출동신청 에러 발생: ${error.message}`);
    }
  },

  // 출동 신청 내역
  getManagerDispatchRequestList:
    async (): Promise<GetManagerDispatchRequestList> => {
      try {
        const response = await api.get('/manager/request/list');
        return response.data;
      } catch (error: any) {
        console.error('출동 신청 내역 조회 에러: ', error.message);
        throw new Error(`출동 신청 내역 조회 에러: ${error.message}`);
      }
    },

  // 출동 신청 내역 상세
  getManagerDispatchRequestDetail: async (
    dispatchRequestId: string,
  ): Promise<GetManagerDispatchRequestDetail> => {
    try {
      const response = await api.get(
        `/manager/request/detail/${dispatchRequestId}`,
      );
      return response.data;
    } catch (error: any) {
      console.error('출동 신청 내역 상세 조회 에러: ', error.message);
      throw new Error(`출동 신청 내역 상세 조회 에러: ${error.message}`);
    }
  },

  // 출동 취소
  cancelManagerDispatchRequest: async (
    dispatchRequestId: string,
  ): Promise<CancelManagerDispatchResponse> => {
    try {
      const response = await api.delete(
        `/manager/request/cancel/${dispatchRequestId}`,
      );
      console.log('출동 취소 성공: ', response.data);
      return response.data;
    } catch (error: any) {
      console.error('출동 신청 취소 에러: ', error.message);
      throw new Error(`출동 신청 취소 에러: ${error.message}`);
    }
  },

  // 거래 확정
  completeManagerDispatchRequest: async (
    dispatchRequestId: string,
  ): Promise<CompleteManagerDispatchResponse> => {
    try {
      const response = await api.post(
        `/manager/request/complete/${dispatchRequestId}`,
      );
      console.log('거래 확정 성공: ', response.data);
      return response.data;
    } catch (error: any) {
      console.error('거래 확정 에러: ', error.message);
      throw new Error(`거래 확정 에러: ${error.message}`);
    }
  },
};

export type {
  CreateManagerDispatchRequestParams,
  CreateManagerDispatchRequestResponse,
  CancelManagerDispatchResponse,
  CompleteManagerDispatchResponse,
  ManagerDispatchRequestList,
  GetManagerDispatchRequestList,
  DispatchRequest,
  GetManagerDispatchRequestDetail,
};
