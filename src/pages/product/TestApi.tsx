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

const queryParams = {};

function getFilterRangeFromKeyword(queryKey: string, filterName: string) {
  if (queryKey === 'category') {
    return filterName !== 'all'
      ? { ...queryParams, category: { category: filterName } }
      : { ...queryParams, category: { category: 'all' } };
  } else if (queryKey === 'price') {
    const priceRange = PRICE_BOUNDARIES[filterName];
    console.log(priceRange.min);
    return {
      ...queryParams,
      price: {
        ...queryParams,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
      },
    };
  } else if (queryKey === 'shippingFee') {
    const shippingFeeRange = SHIPPING_FEE_BOUNDARIES[filterName];
    return {
      ...queryParams,
      shippingFee: {
        ...queryParams,
        minShippingFees: shippingFeeRange.min,
        maxShippingFees: shippingFeeRange.max,
      },
    };
  }
}

export default function TestApi() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSelectedSort, setIsSelectedSort] = useState('latest');
  const [isSelectedFilter, setIsSelectedFilter] = useState({
    category: 'all',
    price: '전체',
    shippingFee: '전체',
  });
  const [filterQueryName, setFilterQueryName] = useState({
    category: 'all',
    minPrice: 0,
    maxPrice: 0,
    minShippingFees: 0,
    maxShippingFees: 0,
  });
  const [products, setProducts] = useState([]);

  // sorting query keyword check
  const sortQueryParams = (queryKey: string, sortName: string) => {
    // const isExist = searchParams.toString().includes(queryKey);
    const isExistInSortQuery = searchParams.has(queryKey);

    if (!isExistInSortQuery) {
      // 예시) ?sortOption=maxPrice
      searchParams.set(queryKey, sortName);
      setSearchParams(searchParams);
    } else {
      searchParams.set(queryKey, sortName);
      setSearchParams(searchParams);
    }
  };

  // filtering query keyword check
  const filterQueryParams = (queryKey: string, filterName: string) => {
    // 선택된 필터 버튼에 대한 쿼리 스트링 키워드를 받아옴(객체 형태)
    // 가격과 배송료 API는 min, max 범위가 있기 때문.
    const filterQueryKeyword = getFilterRangeFromKeyword(queryKey, filterName);

    // 현재 페이지의 쿼리 스트링 값과 선택한 필터 값 비교를 위해
    // 현재 쿼리 스트링 key=value값을 배열 형태로 받아옴
    const getAllSearchParams = Array.from(searchParams.entries());
    // 그 중에서 sort 쿼리를 제외한 filter 관련 쿼리 스트링값만 새배열로 반환
    // 형식 : [key, value, key, value ...]
    const getFilterParams = getAllSearchParams
      .filter(([key]) => key != 'sort')
      .flat();

    // 현재 페이지에 쿼리 스트링이 존재하지 않는 경우 제일 처음 누른 필터에 대한 쿼리 추가
    if (!getFilterParams.length && filterQueryKeyword) {
      // 조건 처리를 위해 key, value 추출
      const paramsValue = Object.values(filterQueryKeyword)[0];

      // 필터값에 따른 쿼리 처리
      Object.entries(paramsValue).forEach(([key, value]) => {
        searchParams.set(`${key}`, `${value}`);
        setSearchParams(searchParams);
      });
    }
  };

  const location = useLocation()?.search;
  const queryString = new URLSearchParams(location);
  const sortOption = queryString.get('sort') || 'latest';

  let sortQuery = {};
  switch (sortOption) {
    case 'latest':
      sortQuery = `sort={"createdAt": -1}`;
      break;
    case 'oldest':
      sortQuery = `sort={"createdAt": 1}`;
      break;
    case 'maxPrice':
      sortQuery = `sort={"price": -1}`;
      break;
    case 'minPrice':
      sortQuery = `sort={"price": 1}`;
      break;
    default:
      break;
  }

  const fetchSortedProducts = async () => {
    try {
      let response;
      // response = await api.getProductList(sortQuery);
      // setProducts(response.data.item);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchSortedProducts();

    if (sortOption !== null) {
      setIsSelectedSort(sortOption);
    }
  }, [location]);

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
