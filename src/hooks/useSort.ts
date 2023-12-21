import { useEffect, useState } from 'react';
import { IProduct } from '../type';

export const useSort = (products: IProduct[], initialSortOrder: string) => {
  const [sortedProducts, setSortedProducts] = useState(products);
  const [currentSortOrder, setCurrentSortOrder] = useState(initialSortOrder);

  useEffect(() => {
    if (!Array.isArray(products)) {
      setSortedProducts([]);
      return;
    }

    let sorted = [...products];
    switch (currentSortOrder) {
      case '최신순':
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case '오래된순':
        sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case '높은가격순':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case '낮은가격순':
        sorted.sort((a, b) => a.price - b.price);
        break;
      // 기타 케이스 추가 가능
    }
    setSortedProducts(sorted);
  }, [products, currentSortOrder]);

  return [sortedProducts, setCurrentSortOrder];
};
