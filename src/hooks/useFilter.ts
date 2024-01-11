import { useEffect, useState } from 'react';
import { IProduct } from '../type';
import { api } from '../api/api';
import { PRICE_BOUNDARIES } from '../constants';

export const useFilter = (
  products: IProduct[],
  initialSelectedCategory: string,
  initialSelectedPrice: string,
) => {
  const [selectedCategory, setSelectedCategory] = useState(
    initialSelectedCategory,
  );
  const [selectedPrice, setSelectedPrice] = useState(initialSelectedPrice);

  const selectedPriceRange = PRICE_BOUNDARIES[selectedPrice];

  // sort된 데이터인 products로 filter
  const filteredProducts = products.filter((product: IProduct) => {
    const withinCategory =
      selectedCategory === 'all' ||
      product.extra?.category?.includes(selectedCategory);

    const withinPriceRange =
      product.price >= selectedPriceRange.min &&
      product.price <= selectedPriceRange.max;

    return withinCategory && withinPriceRange;
  });

  console.log('filteredProducts', filteredProducts);

  let categoryQuery = {};
  categoryQuery = `{"extra.category.1": "${selectedCategory}"}`;

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
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    selectedPrice,
    setSelectedPrice,
    resetFilters,
  ];
};
