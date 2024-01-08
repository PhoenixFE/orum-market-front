import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IProduct } from '../type';
import { api } from '../api/api';

export const useSort = (products: IProduct[], initialSortOrder: string) => {
  const [sortedProducts, setSortedProducts] = useState(products);
  const [currentSortOrder, setCurrentSortOrder] = useState(initialSortOrder);
  const location = useLocation();

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

  // console.log('currnetQuery:', currnetQuery);
  // console.log('sortedProducts: ', sortedProducts);

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
        const response =
          path === '/'
            ? await api.getProductList(sortQuery)
            : await api.getOrderState(sortQuery);
        setSortedProducts(response.data.item);
      } catch (error) {
        console.log('데이터를 받아오지 못했습니다.', error);
      }
    };
    sortFetchProducts(currnetQuery);
  }, [products, currentSortOrder]);

  return [sortedProducts, setCurrentSortOrder];
};
