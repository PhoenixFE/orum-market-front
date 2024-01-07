import { useEffect, useState } from 'react';
import { IProduct } from '../type';
import { api } from '../api/api';

export const useSort = (products: IProduct[], initialSortOrder: string) => {
  const [sortedProducts, setSortedProducts] = useState(products);
  const [currentSortOrder, setCurrentSortOrder] = useState(initialSortOrder);

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

    const sortFetchProducts = async () => {
      try {
        const response = await api.getProductList(sortQuery);
        setSortedProducts(response.data.item);
      } catch (error) {
        console.log('데이터를 받아오지 못했습니다.', error);
      }
    };
    sortFetchProducts();
  }, [products, currentSortOrder]);

  return [sortedProducts, setCurrentSortOrder];
};
