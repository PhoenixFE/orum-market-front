import { useLocation, useSearchParams } from 'react-router-dom';

export const useQueryParams = () => {
  const location = useLocation();
  const queryParams = location.search;
  const [searchParams, setSearchParams] = useSearchParams(queryParams);

  const sortQueryParams = (queryKey: string, sortName: string) => {
    const isExistInSortQuery = searchParams.has(queryKey, sortName);

    if (!isExistInSortQuery) {
      // 예시) ?sortOption=maxPrice
      searchParams.set(queryKey, sortName);
    }
    setSearchParams(searchParams);
  };

  return [sortQueryParams];
};
