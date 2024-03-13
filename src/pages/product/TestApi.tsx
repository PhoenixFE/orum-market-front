import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '@mui/material';

import {
  CATEGORY,
  PRICE_BOUNDARIES,
  PRICE_RANGE,
  SHIPPING_FEE,
  SHIPPING_FEE_BOUNDARIES,
  SORT_OPTIONS,
} from '../../constants';
import { IProduct } from '../../type';
import { api } from '../../api/api';

export default function TestApi() {
  const loaction = useLocation().search;
  const [searchParams, setSearchParams] = useSearchParams(loaction);
  const [isSelectedSort, setIsSelectedSort] = useState('latest');
  const [isSelectedFilter, setIsSelectedFilter] = useState({
    category: 'all',
    price: '전체',
    shippingFee: '전체',
  });

  const [products, setProducts] = useState([]);

  // sorting query keyword check
  const sortQueryParams = (queryKey: string, sortName: string) => {
    const isExistInSortQuery = searchParams.has(queryKey, sortName);

    if (!isExistInSortQuery) {
      // 예시) ?sortOption=maxPrice
      searchParams.set(queryKey, sortName);
    }
    setSearchParams(searchParams);
  };

  // filtering query keyword check
  const filterQueryParams = (queryKey: string, filterName: string) => {
    // 선택한 필터 버튼값 비교하여 객체로 반환하는 함수
    // price와 category API는 min, max 범위가 있기 때문.
    const getFilterRangeFromKeyword = (
      queryKey: string,
      filterName: string,
    ) => {
      let filterQuery = {};
      if (filterName !== 'all' && filterName !== '전체') {
        if (queryKey === 'category') {
          filterQuery = {
            ...filterQuery,
            categoryQuery: {
              category: filterName,
            },
          };
          return filterQuery;
        } else if (queryKey === 'price') {
          const priceRange = PRICE_BOUNDARIES[filterName];
          filterQuery = {
            ...filterQuery,
            priceQuery: {
              minPrice: priceRange.min,
              maxPrice: priceRange.max,
            },
          };
          return filterQuery;
        } else if (queryKey === 'shippingFee') {
          const shippingFeeRange = SHIPPING_FEE_BOUNDARIES[filterName];
          filterQuery = {
            ...filterQuery,
            shippingFeeQuery: {
              minShippingFees: shippingFeeRange.min,
              maxShippingFees: shippingFeeRange.max,
            },
          };
          return filterQuery;
        }
      } else {
        return (filterQuery = {
          ...filterQuery,
          allQuery: {
            queryKey,
            filterName,
          },
        });
      }
    };

    // 선택된 필터 버튼에 대한 쿼리 스트링 키워드를 받아옴(객체 형태)
    // 전체 버튼 클릭시에는 문자열 반환
    const filterQueryKeyword = getFilterRangeFromKeyword(queryKey, filterName);

    // 현재 페이지의 쿼리 스트링 값과 선택한 필터 값 비교를 위해
    // 현재 쿼리 스트링 key=value값 중에 sort를 제외한 값을 중첩 배열([[][]]) 형태로 받아옴
    const getAllSearchParams = Array.from(searchParams.entries())
      .filter(([key]) => key !== 'sort')
      .flat();

    // 쿼리 비교를 위해 sort 쿼리를 제외한 filter 관련 쿼리의 key, value 각각 새배열로 반환
    const paramsKey = getAllSearchParams.filter((_, idx) => idx % 2 === 0);
    const paramsValue = getAllSearchParams.filter((_, idx) => idx % 2 !== 0);

    const isNotAll =
      filterQueryKeyword?.allQuery?.filterName !== 'all' &&
      filterQueryKeyword?.allQuery?.filterName !== '전체';

    if (isNotAll) {
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
      // 선택한 필터값도 비교를 위해 key, value 배열로 반환
      const clickedFilterKey = Object.keys(filterValue);
      const clickedFilterValue = Object.values(filterValue).map((value) =>
        String(value),
      );

      // 현재 페이지에 있는 쿼리 스트링의 key와 value가 클릭한 필터 값과 동일한지 확인
      const compareFilterAndQueryKeys = (selectedFilter, params) => {
        let result = true;
        selectedFilter.forEach((elem) => {
          if (!params.includes(elem)) {
            return (result = false);
          }
        });
        return result;
      };

      const keysMatch = compareFilterAndQueryKeys(clickedFilterKey, paramsKey);
      const valuesMatch = compareFilterAndQueryKeys(
        clickedFilterValue,
        paramsValue,
      );
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

  // filter button active 유지를 위한 함수
  const findFilterKeyByValue = (obj, minValue, maxValue) => {
    for (const [key, value] of Object.entries(obj)) {
      if (
        value.min.toString() === minValue &&
        value.max.toString() === maxValue
      ) {
        return key;
      }
    }
  };

  const sortOption = searchParams.get('sort');
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const minShippingFees = searchParams.get('minShippingFees');
  const maxShippingFees = searchParams.get('maxShippingFees');

  let sortQuery = {};
  if (sortOption === 'latest') {
    sortQuery = {
      ...sortQuery,
      createdAt: -1,
    };
  } else if (sortOption === 'oldest') {
    sortQuery = {
      ...sortQuery,
      createdAt: 1,
    };
  } else if (sortOption === 'maxPrice') {
    sortQuery = {
      ...sortQuery,
      price: -1,
    };
  } else if (sortOption === 'minPrice') {
    sortQuery = {
      ...sortQuery,
      price: 1,
    };
  }

  let filterQuerys = {};
  if (category) {
    filterQuerys = {
      ...filterQuerys,
      category: category,
    };
  }
  if (minPrice && maxPrice) {
    filterQuerys = {
      ...filterQuerys,
      minPrice: minPrice,
      maxPrice: maxPrice,
    };
  }
  if (minShippingFees && maxShippingFees) {
    filterQuerys = {
      ...filterQuerys,
      minShippingFees: minShippingFees,
      maxShippingFees: maxShippingFees,
    };
  }

  // sort API 요청 쿼리 생성
  const sortApiQuery =
    Object.keys(sortQuery).length === 0
      ? ''
      : `sort=${JSON.stringify(sortQuery)}`;

  // filter API 요청 쿼리 생성
  const filterArray = Object.entries(filterQuerys);

  let filterObject: {
    category?: {
      'extra.category.1'?: string;
    };

    priceRange?: {
      minPrice?: string;
      maxPrice?: string;
    };
    shippingFeesRange?: {
      minShippingFees?: string;
      maxShippingFees?: string;
    };
  } = {};

  let categoryQuery = '';
  let priceQuery = '';
  let shippingFeeQuery = '';

  filterArray.forEach((entry: string) => {
    const [key, value] = entry;

    if (key === 'category') {
      filterObject = {
        ...filterObject,
        category: {
          [`extra.${key}.1`]: value,
        },
      };
      categoryQuery = `custom=${JSON.stringify(filterObject?.category)}`;
    } else if (key === 'minPrice' || key === 'maxPrice') {
      filterObject = {
        ...filterObject,
        priceRange: {
          ...filterObject.priceRange,
          [key]: value,
        },
      };
      priceQuery = `minPrice=${filterObject?.priceRange?.minPrice}&maxPrice=${filterObject?.priceRange?.maxPrice}`;
    } else if (key === 'minShippingFees' || key === 'maxShippingFees') {
      filterObject = {
        ...filterObject,
        shippingFeesRange: {
          ...filterObject.shippingFeesRange,
          [key]: value,
        },
      };

      shippingFeeQuery = `minShippingFees=${filterObject?.shippingFeesRange?.minShippingFees}&maxShippingFees=${filterObject?.shippingFeesRange?.maxShippingFees}`;
    }
  });

  let filterApiQuery = '';

  if (categoryQuery) {
    filterApiQuery += '&' + categoryQuery;
  }

  if (priceQuery) {
    filterApiQuery += '&' + priceQuery;
  }

  if (shippingFeeQuery) {
    filterApiQuery += '&' + shippingFeeQuery;
  }

  // 첫 번째 쿼리 뒤에는 &를 제거
  filterApiQuery = filterApiQuery.slice(1);

  const fetchProducts = async () => {
    try {
      let response;
      let sortFilterQuery = `${sortApiQuery}${
        sortApiQuery && filterApiQuery ? '&' : ''
      }${filterApiQuery}`;

      response = await api.getProductList(sortFilterQuery);
      setProducts(response.data.item);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchProducts();

    if (sortOption !== null) {
      setIsSelectedSort(sortOption);
    }
    if (category !== null) {
      setIsSelectedFilter((current) => ({
        ...current,
        category: category,
      }));
    }
    if (minPrice !== null && maxPrice !== null) {
      const price =
        findFilterKeyByValue(PRICE_BOUNDARIES, minPrice, maxPrice) || '';

      setIsSelectedFilter((current) => ({
        ...current,
        price: price,
      }));
    }
    if (minShippingFees !== null && maxShippingFees !== null) {
      const shippingFee =
        findFilterKeyByValue(
          SHIPPING_FEE_BOUNDARIES,
          minShippingFees,
          maxShippingFees,
        ) || '';

      setIsSelectedFilter((current) => ({
        ...current,
        shippingFee: shippingFee,
      }));
    }
  }, [searchParams]);

  return (
    <>
      {SORT_OPTIONS.map((option) => (
        <Button
          type="button"
          variant="text"
          color="inherit"
          key={option.value}
          onClick={() => sortQueryParams('sort', option.value)}
          sx={{
            fontWeight: isSelectedSort === option.value ? 'bold' : 'light',
          }}
        >
          {option.label}
        </Button>
      ))}

      <div>
        <Button
          key="all"
          variant="text"
          color="inherit"
          onClick={() => filterQueryParams('category', 'all')}
          sx={{
            fontWeight: isSelectedFilter.category === 'all' ? 'bold' : 'light',
          }}
        >
          전체
        </Button>
        {CATEGORY.depth2.map((category) => (
          <Button
            type="button"
            variant="text"
            color="inherit"
            key={category.id}
            onClick={() => filterQueryParams('category', category.dbCode)}
            sx={{
              fontWeight:
                isSelectedFilter.category === category.dbCode
                  ? 'bold'
                  : 'light',
            }}
          >
            {category.name}
          </Button>
        ))}
        <br />
        {PRICE_RANGE.map((price) => (
          <Button
            variant="text"
            color="inherit"
            key={price.id}
            onClick={() => filterQueryParams('price', price.label)}
            sx={{
              fontWeight:
                isSelectedFilter.price === price.label ? 'bold' : 'light',
            }}
          >
            {price.label}
          </Button>
        ))}
        <br />
        {SHIPPING_FEE.map((fee) => (
          <Button
            variant="text"
            color="inherit"
            key={fee.label}
            onClick={() => filterQueryParams('shippingFee', fee.value)}
            sx={{
              fontWeight:
                isSelectedFilter.shippingFee === fee.value ? 'bold' : 'light',
            }}
          >
            {fee.label}
          </Button>
        ))}
      </div>

      {products.map((product: IProduct) => (
        <ul key={product._id}>
          <li>
            {product.name} / {product.createdAt}/ {product.price}
          </li>
        </ul>
      ))}
    </>
  );
}
