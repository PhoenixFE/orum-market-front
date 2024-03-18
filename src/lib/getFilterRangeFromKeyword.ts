import { PRICE_BOUNDARIES, SHIPPING_FEE_BOUNDARIES } from '../constants';

export default function getFilterRangeFromKeyword(
  queryKey: string,
  filterName: string,
) {
  let filterQuery: {
    allQuery?: {
      queryKey?: string;
      filterName?: string;
    };
    categoryQuery?: {
      category?: string;
    };
    priceQuery?: {
      minPrice?: number;
      maxPrice?: number;
    };
    shippingFeeQuery?: {
      minShippingFees?: number;
      maxShippingFees?: number;
    };
  } = {};
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
}
