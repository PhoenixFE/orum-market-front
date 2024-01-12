import { useEffect, useState } from 'react';
import { IProduct } from '../type';
import { api } from '../api/api';
import { PRICE_BOUNDARIES, SHIPPING_FEE_BOUNDARIES } from '../constants';

export const useFilter = (
  products: IProduct[],
  initialSelectedCategory: string,
  initialSelectedPrice: string,
  initialSelectedShippingFee: string,
) => {
  const [filterProductData, setFilterProductData] = useState<IProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(
    initialSelectedCategory,
  );
  const [selectedPrice, setSelectedPrice] = useState(initialSelectedPrice);
  const [selectedShippingFee, setSelectedShippingFee] = useState(
    initialSelectedShippingFee,
  );

  const selectedPriceRange = PRICE_BOUNDARIES[selectedPrice];
  const seletedShippingFeeValue = SHIPPING_FEE_BOUNDARIES[selectedShippingFee];

  const filteredProducts = products.filter((product) => {
    const foundProduct = filterProductData.find(
      (items) => product._id === items._id,
    );

    // 동일한 id를 가진 객체가 존재하면 true를 반환하여 필터링에 포함시킴
    return foundProduct !== undefined;
  });

  let categoryQuery = {};
  categoryQuery =
    selectedCategory !== 'all'
      ? `?custom={"extra.category.1": "${selectedCategory}"}`
      : '';

  useEffect(() => {
    const fetchFilterProducts = async () => {
      try {
        const response = await api.getProductListByCategory(
          categoryQuery,
          selectedPriceRange.min,
          selectedPriceRange.max,
          seletedShippingFeeValue.min,
          seletedShippingFeeValue.max,
        );
        setFilterProductData(response.data.item);
      } catch (error) {
        console.log('데이터를 받아오지 못했습니다.', error);
      }
    };
    fetchFilterProducts();
  }, [selectedCategory, selectedPrice, selectedShippingFee]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedPrice('전체');
    setSelectedShippingFee('전체');
  };

  return [
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    selectedPrice,
    setSelectedPrice,
    selectedShippingFee,
    setSelectedShippingFee,
    resetFilters,
  ];
};
