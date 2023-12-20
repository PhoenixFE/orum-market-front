import { api } from '../api/api';
import { useQuery } from 'react-query';
import { IProductListQuery } from '../type';

export const useFetchProducts = ({ page, limit, ...restQuery }) => {
  return useQuery(
    ['productList', { page, limit, ...restQuery }],
    () => api.getProductList({ page, limit, ...restQuery }),
    {
      keepPreviousData: true,
    },
  );
};
