import api from '../../../api/config';

interface FuneralHallList {
  funeralHallId: string;
  funeralHallName: string;
}

export interface GetFuneralHallListResponse {
  success: boolean;
  message?: string;
  data: FuneralHallList[];
}

export interface GetAddFuneralHallResponse {
  success: boolean;
  message: string;
}

export interface GetUpdateFuneralHallResponse {
  success: boolean;
  message: string;
}

export interface GetDeleteFuneralHallResponse {
  success: boolean;
  message: string;
}

export interface FuneralHallDetail {
  funeralHallId: string;
  funeralId: string;
  funeralHallName: string;
  funeralHallSize: number;
  funeralHallNumberOfMourners: number;
  funeralHallPrice: number;
  funeralHallDetailPrice: number;
  funeralHallStatus: string;
  createdAt: string;
  updatedAt: string;
  version?: number; // 버전 정보 추가 (선택적)
}

export interface GetFuneralHallDetailResponse {
  success: boolean;
  message?: string;
  data: FuneralHallDetail;
}

export const funeralHallInfoService = {
  // 장례식장 호실 정보 조회
  getFuneralHallList: async (): Promise<GetFuneralHallListResponse> => {
    try {
      const response = await api.get('/funeral/hall/list');

      console.log('장례식장 호실 정보 조회 성공:', response.data);

      return response.data;
    } catch (error: any) {
      console.error('장례식장 호실 정보 조회 에러:', error.message);
      throw new Error(`장례식장 호실 정보 조회 에러: ${error.message}`);
    }
  },
  // 장례식장 호실 정보 상세 조회
  getFuneralHallDetail: async (
    funeralHallId: string,
  ): Promise<GetFuneralHallDetailResponse> => {
    try {
      const response = await api.get(`/funeral/hall/detail/${funeralHallId}`);

      console.log('장례식장 호실 정보 상세 조회 성공:', response.data);

      return response.data;
    } catch (error: any) {
      console.error('장례식장 호실 정보 상세 조회 에러:', error.message);
      throw new Error(`장례식장 호실 정보 상세 조회 에러: ${error.message}`);
    }
  },
  // 장례식장 호실 정보 추가
  addFuneralHallInfo: async (data: any): Promise<GetAddFuneralHallResponse> => {
    try {
      const response = await api.post('/funeral/hall/create', data);

      console.log('장례식장 호실 정보 추가 성공:', response.data);

      return response.data;
    } catch (error: any) {
      console.error('장례식장 호실 정보 추가 에러:', error.message);
      throw new Error(`장례식장 호실 정보 추가 에러: ${error.message}`);
    }
  },
  // 장례식장 호실 정보 수정
  updateFuneralHallInfo: async (
    data: any,
  ): Promise<GetUpdateFuneralHallResponse> => {
    try {
      console.log('장례식장 호실 정보 수정 요청: ', data);

      const requestData: any = {
        funeralHallId: data.funeralHallId,
        funeralHallName: data.funeralHallName,
        funeralHallSize: data.funeralHallSize,
        funeralHallNumberOfMourners: data.funeralHallNumberOfMourners,
        funeralHallPrice: data.funeralHallPrice,
        funeralHallDetailPrice: data.funeralHallDetailPrice,
      };

      // version이 있을 경우에만 포함
      if (data.version !== undefined && data.version !== null) {
        requestData.version = data.version;
      }

      const response = await api.put('/funeral/hall/update', requestData);

      console.log('장례식장 호실 정보 수정 완료: ', response.data);

      return response.data;
    } catch (error: any) {
      console.error('장례식장 호실 정보 수정 에러: ', error.message);
      throw new Error(`장례식장 호실 정보 수정 에러: ${error.message}`);
    }
  },
  // 장례식장 호실 정보 삭제
  deleteFuneralHallInfo: async (
    funeralHallId: string,
  ): Promise<GetDeleteFuneralHallResponse> => {
    try {
      const response = await api.delete(
        `/funeral/hall/delete/${funeralHallId}`,
      );

      console.log('장례식장 호실 정보 삭제 완료: ', response.data);

      return response.data;
    } catch (error: any) {
      console.error('장례식장 호실 정보 삭제 에러: ', error.message);
      throw new Error(`장례식장 호실 정보 삭제 에러: ${error.message}`);
    }
  },
};
