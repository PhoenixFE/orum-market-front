import { useEffect, useState } from 'react';
import { IProduct } from '../type';
import { api } from '../api/api';

export const useFilter = (
  products: IProduct[],
  initialSelectedCategory: string,
) => {
  const [filterProducts, setFilterProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState(
    initialSelectedCategory,
  );

  useEffect(() => {
    const fetchFilterProducts = async () => {
      try {
        const response = await api.getProductList(
          `custom={"price":{"$lte":100000}}`,
        );
        console.log('응답', response.data.item);
      } catch (error) {
        console.log('데이터를 받아오지 못했습니다.', error);
      }
    };
    fetchFilterProducts();
  }, [selectedCategory]);

  return [selectedCategory, setSelectedCategory];
};
