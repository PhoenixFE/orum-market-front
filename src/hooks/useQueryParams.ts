import { useLocation, useSearchParams } from 'react-router-dom';
import getFilterRangeFromKeyword from '../lib/getFilterRangeFromKeyword';

export const useQueryParams = () => {
  const location = useLocation();
  const queryParams = location.search;
  const [searchParams, setSearchParams] = useSearchParams(queryParams);

  // sort query parameter
  const sortQueryParams = (queryKey: string, sortName: string) => {
    const isExistInSortQuery = searchParams.has(queryKey, sortName);

    if (!isExistInSortQuery) {
      // 예시) ?sortOption=maxPrice
      searchParams.set(queryKey, sortName);
    }
    setSearchParams(searchParams);
  };

  // filter query parameter
  const filterQueryParams = (queryKey: string, filterName: string) => {
    const filterQueryKeyword =
      getFilterRangeFromKeyword(queryKey, filterName) || {};

    const getAllSearchParams = Array.from(searchParams.entries()).filter(
      ([key]) => key !== 'sort',
    );

    const paramsKey = getAllSearchParams.map(([key, _]) => key);
    const paramsValue = getAllSearchParams.map(([_, value]) => value);

    const clickedFilterBtn = filterQueryKeyword?.allQuery?.filterName;

    if (clickedFilterBtn !== 'all' && clickedFilterBtn !== '전체') {
      // 조건 처리를 위해 key, value 추출
      const filterValue = Object.values(filterQueryKeyword)[0];

      // 현재 페이지에 쿼리 스트링이 존재하지 않는 경우 제일 처음 누른 필터에 대한 쿼리 추가
      if (!paramsKey.length && !paramsValue.length) {
        // 필터값에 따른 쿼리 처리
        Object.entries(filterValue).forEach(([key, value]) => {
          searchParams.set(`${key}`, `${value}`);
        });
        setSearchParams(searchParams);
      }
      // 쿼리 스트링이 존재하는 경우
      // 현재 페이지에 있는 쿼리 스트링의 key와 value가 클릭한 필터 값과 동일한지 확인
      const keysMatch = Object.keys(filterValue).every((key) =>
        paramsKey.includes(key),
      );
      const valuesMatch = Object.values(filterValue)
        .map((value) => String(value))
        .every((value) => paramsValue.includes(value));

      const isExistInFilterQuery = keysMatch && valuesMatch;

      // 동일한 값이 없을 경우 새로운 값으로 변경
      if (!isExistInFilterQuery) {
        Object.entries(filterValue).forEach(([key, value]) => {
          searchParams.set(`${key}`, `${value}`);
        });
        setSearchParams(searchParams);
      }
    } else {
      if (filterQueryKeyword?.allQuery?.queryKey === 'category') {
        searchParams.delete('category');
        setSearchParams(searchParams);
      } else if (filterQueryKeyword?.allQuery?.queryKey === 'price') {
        searchParams.delete('minPrice');
        searchParams.delete('maxPrice');
        setSearchParams(searchParams);
      } else if (filterQueryKeyword?.allQuery?.queryKey === 'shippingFee') {
        searchParams.delete('minShippingFees');
        searchParams.delete('maxShippingFees');
        setSearchParams(searchParams);
      }
    }
  };

  return [sortQueryParams, filterQueryParams];
};
