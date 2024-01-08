import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IProduct } from '../type';
import { api } from '../api/api';

export const useSort = (products: IProduct[], initialSortOrder: string) => {
  const [sortedProducts, setSortedProducts] = useState(products);
  const [currentSortOrder, setCurrentSortOrder] = useState(initialSortOrder);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  let currnetQuery = '';
  const getCurrentPath = () => {
    const path = location.pathname;

    if (path === '/') {
      currnetQuery = path;
      return currnetQuery;
    } else {
      const pathSplit = path.split('/');
      currnetQuery = pathSplit[pathSplit.length - 1];
      return currnetQuery;
    }
  };

  getCurrentPath();

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
        sortQuery =
          currnetQuery === '/' ? `sort={"price": -1}` : `sort={"cost": -1}`;
        break;
      case 'minPrice':
        sortQuery =
          currnetQuery === '/' ? `sort={"price": 1}` : `sort={"cost": 1}`;
        break;
    }

    // path === '/'면 getProductList, 'order'이면 getOrderState
    const sortFetchProducts = async (path: string) => {
      try {
        setIsLoading(true);
        let response;

        switch (path) {
          case '/':
            response = await api.getProductList(sortQuery);
            break;
          case 'orders':
            response = await api.getOrderState(sortQuery);
            break;
        }

        setSortedProducts(response?.data.item);
        setIsLoading(false);
      } catch (error) {
        console.log('데이터를 받아오지 못했습니다.', error);
        setIsLoading(false);
      }
    };

    sortFetchProducts(currnetQuery);
  }, [products, currentSortOrder]);

  return [sortedProducts, setCurrentSortOrder, isLoading];
};
