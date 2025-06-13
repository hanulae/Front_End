import api from '../../../api/config.ts';

interface CreateManagerFormParams {
  funeralList: string[]; // 견적서 발송 장례식 리스트
  chiefMournerName: string; // 상주 이름
  numberOfMourners: number; // 예상 조문객 수
  checkInDate: string; // 입실일자 (YYYY-MM-DD)
  checkOutDate: string; // 퇴실일자 (YYYY-MM-DD)
  deceasedName?: string; // 고인 이름 (선택)
  roomSize?: number; // 평수 (선택)
}

interface ManagerFormResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const managerFormService = {
  // 견적서 발송 (견적서 생성)
  createManagerForm: async (
    params: CreateManagerFormParams,
  ): Promise<ManagerFormResponse> => {
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

  // 모든 견적 리스트 조회

  // 단일 상주 견적 조회

  // 견적 입찰 상세 조회
};

export type {CreateManagerFormParams, ManagerFormResponse};
