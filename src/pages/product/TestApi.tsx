import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import {
  CATEGORY,
  PRICE_BOUNDARIES,
  PRICE_RANGE,
  SHIPPING_FEE,
} from '../../constants';
import { api } from '../../api/api';
import { IProduct } from '../../type';

export default function TestApi() {
  const [queryCategory, setQueryCategory] = useState('');
  const [queryPrice, setQueryPrice] = useState('');
  const [queryShippingFee, setQueryShippingFee] = useState('');
  const [selectedFilter, setSelectedFilter] = useState({
    category: 'all',
    price: '전체',
    shippingFee: '전체',
  });
  const [isSelectedCategory, setIsSelectedCategory] = useState('all');
  const [isSelectedPrice, setIsSelectedPrice] = useState('전체');
  const [isSelectedShippingFee, setIsSelectedShippingFee] = useState('전체');
  const [products, setProducts] = useState([]);

  const onCategoryButtonClick = (value: string) => {
    setSelectedFilter({ ...selectedFilter, category: value });
    setIsSelectedCategory(value);

    if (value === 'all') {
      setQueryCategory('');
    } else {
      setQueryCategory(`&custom={"extra.category.1": "${value}"}`);
    }
  };

  const onPriceButtonClick = (priceValue: string) => {
    setSelectedFilter({ ...selectedFilter, price: priceValue });
    setIsSelectedPrice(priceValue);

    const selectedPriceRange = PRICE_BOUNDARIES[priceValue];
    setQueryPrice(
      `&minPrice=${selectedPriceRange.min}&maxPrice=${selectedPriceRange.max}`,
    );
  };

  const onShippingFeeButtonClick = (shippingFeeValue: string) => {
    setSelectedFilter({ ...selectedFilter, shippingFee: shippingFeeValue });
    setIsSelectedShippingFee(shippingFeeValue);

    if (shippingFeeValue === '무료배송') {
      setQueryShippingFee(`&minShippingFees=0&maxShippingFees=0`);
    } else if (shippingFeeValue === '유료배송') {
      setQueryShippingFee(`&minShippingFees=1&maxShippingFees=Infinity`);
    } else {
      setQueryShippingFee(`&minShippingFees=0&maxShippingFees=Infinity`);
    }
  };

  const handleFilteredCategory = async () => {
    try {
      let response;
      let queryData = queryCategory + queryPrice + queryShippingFee;

      if (
        selectedFilter.category !== 'all' ||
        selectedFilter.price !== '전체' ||
        selectedFilter.shippingFee !== '전체'
      ) {
        response = await api.getProductList(queryData);
        setProducts(response.data.item);
      } else {
        response = await api.getProductList();
        setProducts(response.data.item);
      }
    } catch (error) {
      console.error('error: ', error);
    }
  };

  useEffect(() => {
    handleFilteredCategory();
  }, [queryCategory, queryPrice, queryShippingFee]);

  return (
    <>
      <Button
        key="all"
        variant="text"
        color="inherit"
        onClick={() => onCategoryButtonClick('all')}
        sx={{
          fontWeight: isSelectedCategory === 'all' ? 'bold' : 'light',
        }}
      >
        전체
      </Button>
      {CATEGORY.depth2.map((category) => (
        <Button
          type="button"
          variant="text"
          color="inherit"
          key={category.id}
          onClick={() => onCategoryButtonClick(category.dbCode)}
          sx={{
            fontWeight:
              isSelectedCategory === category.dbCode ? 'bold' : 'light',
          }}
        >
          {category.name}
        </Button>
      ))}
      {PRICE_RANGE.map((price) => (
        <Button
          key={price.id}
          variant="text"
          color="inherit"
          onClick={() => onPriceButtonClick(price.label)}
          sx={{
            fontWeight: isSelectedPrice === price.label ? 'bold' : 'light',
          }}
        >
          {price.label}
        </Button>
      ))}
      {SHIPPING_FEE.map((fee) => (
        <Button
          key={fee.label}
          variant="text"
          color="inherit"
          onClick={() => onShippingFeeButtonClick(fee.value)}
          sx={{
            fontWeight: isSelectedShippingFee === fee.value ? 'bold' : 'light',
          }}
        >
          {fee.label}
        </Button>
      ))}
      {products.map((product: IProduct) => (
        <ul key={product._id}>
          <li>{product.name}</li>
        </ul>
      ))}
    </>
  );
}
