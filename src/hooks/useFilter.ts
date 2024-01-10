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

  let categoryQuery = `custom={"extra.category.1": "${selectedCategory}"}`;

  useEffect(() => {
    const fetchFilterProducts = async () => {
      try {
        const response = await api.getProductList(categoryQuery);
        console.log('응답', response.data.item);
      } catch (error) {
        console.log('데이터를 받아오지 못했습니다.', error);
      }
    };
    fetchFilterProducts();
  }, [selectedCategory]);

  return [selectedCategory, setSelectedCategory];
};
