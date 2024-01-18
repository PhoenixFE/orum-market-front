import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IProduct } from '../type';
import { api } from '../api/api';
import { PRICE_BOUNDARIES, SHIPPING_FEE_BOUNDARIES } from '../constants';

export const useSort = (
  products: IProduct[],
  initialSortOrder: string,
  initialFilteredCategory: string,
  initialFilteredPrice: string,
  initialFilteredShippingFee: string,
) => {
  const [sortedProducts, setSortedProducts] = useState(products);
  const [currentSortOrder, setCurrentSortOrder] = useState(initialSortOrder);
  const [currentFilteredCategory, setCurrentFilteredCategory] = useState(
    initialFilteredCategory,
  );
  const [currentFilteredPrice, setCurrentFilteredPrice] =
    useState(initialFilteredPrice);
  const [currentFilteredShippingFee, setCurrentFilteredShippingFee] = useState(
    initialFilteredShippingFee,
  );
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  let productsSort = '';
  const getCurrentPath = () => {
    const path = location.pathname;

    if (path === '/') {
      productsSort = path;
      return productsSort;
    } else {
      const pathnames = path.split('/');
      productsSort = pathnames[pathnames.length - 1];
      return productsSort;
    }
  };

  getCurrentPath();

  let sortQuery = '';
  switch (currentSortOrder) {
    case 'latest':
      sortQuery = `sort={"createdAt": -1}`;
      break;
    case 'oldest':
      sortQuery = `sort={"createdAt": 1}`;
      break;
    case 'maxPrice':
      sortQuery =
        productsSort === '/' ? `sort={"price": -1}` : `sort={"cost": -1}`;
      break;
    case 'minPrice':
      sortQuery =
        productsSort === '/' ? `sort={"price": 1}` : `sort={"cost": 1}`;
      break;
  }

  let filteredQuery = '';
  const selectedPriceRange = PRICE_BOUNDARIES[currentFilteredPrice];
  const selectedShippingFee =
    SHIPPING_FEE_BOUNDARIES[currentFilteredShippingFee];

  const categoryQuery = `custom={"extra.category.1": "${currentFilteredCategory}"}`;
  const priceQuery = `minPrice=${selectedPriceRange.min}&maxPrice=${selectedPriceRange.max}`;
  const shippingFeeQuery = `minShippingFees=${selectedShippingFee.min}&maxShippingFees=${selectedShippingFee.max}`;

  if (currentFilteredCategory !== 'all' || currentFilteredPrice !== '전체') {
    if (currentFilteredCategory === 'all') {
      filteredQuery += '&' + priceQuery;
      +'&' + shippingFeeQuery;
    } else {
      filteredQuery +=
        '&' + categoryQuery + '&' + priceQuery + '&' + shippingFeeQuery;
    }
  } else {
    filteredQuery = '';
  }

  let query = sortQuery + filteredQuery;

  useEffect(() => {
    if (!Array.isArray(products)) {
      setSortedProducts([]);
      return;
    }

    // path === '/'면 getProductList, 'order'이면 getOrderState
    const fetchSortedProducts = async (path: string) => {
      try {
        setIsLoading(true);
        let response = null;

        switch (path) {
          case '/':
            response = await api.getProductList(query);
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

    fetchSortedProducts(productsSort);
  }, [
    products,
    currentSortOrder,
    currentFilteredCategory,
    currentFilteredPrice,
    currentFilteredShippingFee,
  ]);

  return [
    sortedProducts,
    setCurrentSortOrder,
    isLoading,
    setCurrentFilteredCategory,
    setCurrentFilteredPrice,
    setCurrentFilteredShippingFee,
  ];
};
