import { api } from '../api/api';
import { useQuery } from 'react-query';

export const useFetchProducts = ({ ...restQuery }) => {
  return useQuery(
    ['productList', { ...restQuery }],
    () => api.getProductList({ ...restQuery }),
    {
      keepPreviousData: true,
    },
  );
};
