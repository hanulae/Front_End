import api from '../../api/config';

interface SearchFuneralParams {
  keyword?: string;
  sido?: string;
  sigungu?: string;
  page?: number;
  limit?: number;
}

interface FuneralData {
  funeralListId: string;
  funeralId: string;
  funeralName: string;
  funeralAddress: string;
}

interface FuneralDetail {
  funeralListId: string;
  funeralId: string;
  funeralName: string;
  funeralAddress: string;
  funeralScale: string;
  funeralTotalRooms: number;
  funeralOperationType: string;
  funeralStyle: string;
  funeralParkingLot: boolean;
  funeralStore: boolean;
  funeralFamilyWaitingRoom: boolean;
  funeralDisabledFacility: boolean;
  funeralJoin: boolean;
  funeralImageUrl: string;
  funeralPhoneNumber: string;
  funeralHomepageUrl: string;
}

interface FuneralDetailResponse {
  success: boolean;
  data: FuneralDetail;
}

interface PageInfo {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  isLast: boolean;
}

interface SearchFuneralResponse {
  success: boolean;
  data: FuneralData[];
  pageInfo: PageInfo;
}

export const funeralService = {
  // 장례식장 검색 API 호출 (전체검색, 키워드, 시/도, 시도+시군구, 모든검색)
  searchFunerals: async (
    params: SearchFuneralParams,
  ): Promise<SearchFuneralResponse> => {
    try {
      const response = await api.get('/manager/funeral/search', {
        params: {
          keyword: params.keyword,
          sido: params.sido,
          sigungu: params.sigungu,
          page: params.page,
          limit: params.limit,
        },
      });

      const data: SearchFuneralResponse = response.data;

      return data;
    } catch (error: any) {
      if (error.response) {
        // 서버가 응답했지만 에러 상태코드
        console.error('❌ 서버 응답 에러:', {
          상태코드: error.response.status,
          응답데이터: error.response.data,
          URL: error.config?.url,
        });
        throw new Error(
          `서버 에러: ${error.response.status} - ${
            error.response.data?.message || '알 수 없는 오류'
          }`,
        );
      } else if (error.request) {
        // 요청이 전송되었지만 응답을 받지 못함
        console.error('❌ 네트워크 에러:', error.request);
        throw new Error('네트워크 연결을 확인해주세요');
      } else {
        // 요청 설정 중 에러 발생
        console.error('❌ 요청 설정 에러:', error.message);
        throw new Error(`요청 에러: ${error.message}`);
      }
    }
  },

  getFuneralDetail: async (
    funeralListId: string,
  ): Promise<FuneralDetailResponse> => {
    try {
      const response = await api.get(
        `/manager/funeral/detail/${funeralListId}`,
      );

      const data: FuneralDetailResponse = response.data;

      return data;
    } catch (error: any) {
      if (error.response) {
        console.error('❌ 장례식장 상세 조회 서버 에러:', {
          상태코드: error.response.status,
          응답데이터: error.response.data,
          URL: error.config?.url,
        });
        throw new Error(
          `상세 조회 실패: ${error.response.status} - ${
            error.response.data?.message || '장례식장 정보를 찾을 수 없습니다'
          }`,
        );
      } else if (error.request) {
        console.error('❌ 장례식장 상세 조회 네트워크 에러:', error.request);
        throw new Error('네트워크 연결을 확인해주세요');
      } else {
        console.error('❌ 장례식장 상세 조회 요청 에러:', error.message);
        throw new Error(`요청 에러: ${error.message}`);
      }
    }
  },
};

export type {
  SearchFuneralParams,
  FuneralData,
  PageInfo,
  SearchFuneralResponse,
  FuneralDetailResponse,
  FuneralDetail,
};
