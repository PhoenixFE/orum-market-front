import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '@mui/material';

import { SORT_OPTIONS } from '../../constants';
import { IProduct } from '../../type';
import { api } from '../../api/api';

export default function TestApi() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSelectedSort, setIsSelectedSort] = useState('latest');
  const [products, setProducts] = useState([]);

  const sortQueryParams = (queryKey: string, sortName: string) => {
    const isExist = searchParams.toString().includes(queryKey);

    if (!isExist) {
      // 예시) ?sortOption=maxPrice
      searchParams.append(queryKey, sortName);
      setSearchParams(searchParams);
    } else {
      searchParams.delete(queryKey);
      searchParams.append(queryKey, sortName);
      setSearchParams(searchParams);
    }
  };

  const location = useLocation()?.search;
  const queryString = new URLSearchParams(location);
  const sortOption = queryString.get('sort');

  let sortQuery = {};
  switch (sortOption) {
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
    default:
      break;
  }

  const fetchSortedProducts = async () => {
    try {
      let response;
      response = await api.getProductList(sortQuery);
      setProducts(response.data.item);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchSortedProducts();

    if (sortOption !== null) {
      setIsSelectedSort(sortOption);
    }
  }, [location]);

  return (
    <>
      {SORT_OPTIONS.map((option) => (
        <Button
          type="button"
          variant="text"
          color="inherit"
          key={option.value}
          onClick={() => sortQueryParams('sort', option.value)}
          sx={{
            fontWeight: isSelectedSort === option.value ? 'bold' : 'light',
          }}
        >
          {option.label}
        </Button>
      ))}

      {products.map((product: IProduct) => (
        <ul key={product._id}>
          <li>
            {product.name} / {product.createdAt}/ {product.price}
          </li>
        </ul>
      ))}
    </>
  );
}
