import { useEffect, useState } from 'react';
import { IProduct } from '../type';
import { api } from '../api/api';
import { PRICE_BOUNDARIES } from '../constants';

export const useFilter = (
  products: IProduct[],
  initialSelectedCategory: string,
  initialSelectedPrice: string,
) => {
  const [filterProducts, setFilterProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState(
    initialSelectedCategory,
  );
  const [selectedPrice, setSelectedPrice] = useState(initialSelectedPrice);

  let categoryQuery = {};
  categoryQuery = `{"extra.category.1": "${selectedCategory}"}`;

  const selectedPriceRange = PRICE_BOUNDARIES[selectedPrice];

  useEffect(() => {
    const fetchFilterProducts = async () => {
      try {
        const response = await api.getProductListByCategory(
          categoryQuery,
          selectedPriceRange.min,
          selectedPriceRange.max,
          1,
          Infinity,
        );
        console.log('응답', response.data.item);
      } catch (error) {
        console.log('데이터를 받아오지 못했습니다.', error);
      }
    };
    fetchFilterProducts();
  }, [selectedCategory, selectedPrice]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedPrice('전체');
    // setSelectedShippingFee('전체');
  };

  return [
    selectedCategory,
    setSelectedCategory,
    selectedPrice,
    setSelectedPrice,
    resetFilters,
  ];
};
