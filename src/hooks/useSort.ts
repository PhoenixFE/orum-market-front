import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IProduct } from '../type';
import { api } from '../api/api';

export const useSort = (products: IProduct[], initialSortOrder: string) => {
  const [sortedProducts, setSortedProducts] = useState(products);
  const [currentSortOrder, setCurrentSortOrder] = useState(initialSortOrder);
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    if (!Array.isArray(products)) {
      setSortedProducts([]);
      return;
    }

    let sortQuery = {};
    switch (currentSortOrder) {
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
    }

    // path === '/'면 getProductList, 'order'이면 getOrderState
    const sortFetchProducts = async (path: string) => {
      try {
        const response =
          path === '/'
            ? await api.getProductList(sortQuery)
            : await api.getOrderState(sortQuery);
        setSortedProducts(response.data.item);
      } catch (error) {
        console.log('데이터를 받아오지 못했습니다.', error);
      }
    };
    sortFetchProducts(path);
  }, [products, currentSortOrder]);

  return [sortedProducts, setCurrentSortOrder];
};
