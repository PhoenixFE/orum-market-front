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
  const [query, setQuery] = useState({
    categoryQuery: '',
    priceQuery: '',
    shippingFeeQuery: '',
  });
  const [selectedFilter, setSelectedFilter] = useState({
    category: 'all',
    price: '전체',
    shippingFee: '전체',
  });
  const [isSelectedCategory, setIsSelectedCategory] = useState('all');
  const [isSelectedPrice, setIsSelectedPrice] = useState('전체');
  const [isSelectedShippingFee, setIsSelectedShippingFee] = useState('전체');
  const [products, setProducts] = useState([]);

  const updateCategoryQuery = (value: string) => {
    if (value !== 'all') {
      setQuery({
        ...query,
        categoryQuery: `&custom={"extra.category.1": "${value}"}`,
      });
    } else {
      setQuery({
        ...query,
        categoryQuery: '',
      });
    }
  };

  const updatePriceQuery = (priceValue: string) => {
    const selectedPriceRange = PRICE_BOUNDARIES[priceValue];
    if (priceValue !== '전체') {
      setQuery({
        ...query,
        priceQuery: `&minPrice=${selectedPriceRange.min}&maxPrice=${selectedPriceRange.max}`,
      });
    } else {
      setQuery({
        ...query,
        priceQuery: '',
      });
    }
  };

  const updateShippingFeeQuery = (shippingFeeValue: string) => {
    if (shippingFeeValue === '무료배송') {
      setQuery({
        ...query,
        shippingFeeQuery: `&minShippingFees=0&maxShippingFees=0`,
      });
    } else if (shippingFeeValue === '유료배송') {
      setQuery({
        ...query,
        shippingFeeQuery: `&minShippingFees=1&maxShippingFees=Infinity`,
      });
    } else {
      setQuery({
        ...query,
        shippingFeeQuery: '',
      });
    }
  };

  const onFilterButtonClick = (filterType: string, value: string) => {
    const newFilter = { ...selectedFilter, [filterType]: value };
    setSelectedFilter(newFilter);

    switch (filterType) {
      case 'category':
        setIsSelectedCategory(value);
        updateCategoryQuery(value);
        break;
      case 'price':
        setIsSelectedPrice(value);
        updatePriceQuery(value);
        break;
      case 'shippingFee':
        setIsSelectedShippingFee(value);
        updateShippingFeeQuery(value);
        break;
      default:
        break;
    }
  };

  const handleFilteredProducts = async () => {
    try {
      let response;
      const queryValues = Object.values(query).join('');

      if (
        selectedFilter.category !== 'all' ||
        selectedFilter.price !== '전체' ||
        selectedFilter.shippingFee !== '전체'
      ) {
        response = await api.getProductList(queryValues);
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
    handleFilteredProducts();
  }, [selectedFilter]);

  return (
    <>
      <Button
        key="all"
        variant="text"
        color="inherit"
        onClick={() => onFilterButtonClick('category', 'all')}
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
          onClick={() => onFilterButtonClick('category', category.dbCode)}
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
          onClick={() => onFilterButtonClick('price', price.label)}
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
          onClick={() => onFilterButtonClick('shippingFee', fee.value)}
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
