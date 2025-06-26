import {useState, useCallback} from 'react';
import {
  funeralService,
  SearchFuneralParams,
  FuneralData,
  PageInfo,
} from '../services/api/funeralService';

interface UseFuneralSearchReturn {
  funerals: FuneralData[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  pageInfo: PageInfo | null;
  currentPage: number;
  searchFunerals: (params: SearchFuneralParams) => Promise<void>;
  loadMoreFunerals: () => Promise<void>;
  resetSearch: () => void;
}

export const useFuneralSearch = (): UseFuneralSearchReturn => {
  const [funerals, setFunerals] = useState<FuneralData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastSearchParams, setLastSearchParams] = useState<SearchFuneralParams>(
    {},
  );

  const searchFunerals = useCallback(async (params: SearchFuneralParams) => {
    setLoading(true);
    setError(null);
    setCurrentPage(1);

    try {
      const searchParamsWithPage = {...params, page: 1};
      const response = await funeralService.searchFunerals(
        searchParamsWithPage,
      );

      if (response.success) {
        setFunerals(response.data);
        setPageInfo(response.pageInfo);
        setLastSearchParams(params);
        setCurrentPage(1);
      } else {
        setError('검색 결과를 가져오는데 실패했습니다.');
        setFunerals([]);
        setPageInfo(null);
      }
    } catch (err) {
      console.error('❌ 검색 오류:', err);
      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      setFunerals([]);
      setPageInfo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMoreFunerals = useCallback(async () => {
    if (loadingMore || loading || !pageInfo?.hasNext) {
      return;
    }

    const nextPage = currentPage + 1;

    setLoadingMore(true);
    setError(null);

    try {
      const searchParamsWithPage = {
        ...lastSearchParams,
        page: nextPage,
        limit: 20,
      };

      const response = await funeralService.searchFunerals(
        searchParamsWithPage,
      );

      if (response.success) {
        setFunerals(prevFunerals => [...prevFunerals, ...response.data]);
        setPageInfo(response.pageInfo);
        setCurrentPage(nextPage);
      } else {
        console.log('❌ 다음 페이지 로드 실패:', response);
        setError('추가 데이터를 가져오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('❌ 다음 페이지 로드 오류:', err);
      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, loading, pageInfo?.hasNext, currentPage, lastSearchParams]);

  const resetSearch = useCallback(() => {
    setFunerals([]);
    setError(null);
    setPageInfo(null);
    setCurrentPage(1);
    setLastSearchParams({});
  }, []);

  return {
    funerals,
    loading,
    loadingMore,
    error,
    pageInfo,
    currentPage,
    searchFunerals,
    loadMoreFunerals,
    resetSearch,
  };
};
