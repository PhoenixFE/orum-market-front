import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { IProduct } from '../type';
import { useLocation, useSearchParams } from 'react-router-dom';

export default function useSortFilter() {
  const location = useLocation();
  const queryParams = location.search;
  const [searchParams, setSearchParams] = useSearchParams(queryParams);

  const [products, setProducts] = useState<IProduct[]>([]);
  const sortOption = searchParams.get('sort');
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const minShippingFees = searchParams.get('minShippingFees');
  const maxShippingFees = searchParams.get('maxShippingFees');

  let sortQuery: {
    createdAt?: number;
    price?: number;
  } = {};

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

  let filterQuerys: {
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    minShippingFees?: string;
    maxShippingFees?: string;
  } = {};

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

  filterArray.forEach((entry) => {
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

  useEffect(() => {
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

    fetchProducts();

    // 새로고침시 최신 location값 업데이트
    setSearchParams(() => queryParams);
  }, [queryParams, searchParams]);

  return [products];
}
