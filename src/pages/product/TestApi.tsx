import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { CATEGORY } from '../../constants';
import { api } from '../../api/api';
import { IProduct } from '../../type';

export default function TestApi() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState({
    category: 'all',
    price: '전체',
    shippingFee: '전체',
  });
  const [isSelectedCategory, setIsSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);

  const onCategoryButtonClick = (value: string) => {
    setSelectedCategory({ ...selectedCategory, category: value });
    setIsSelectedCategory(value);

    if (value === 'all') {
      setQuery('');
    } else {
      setQuery(`&custom={"extra.category.1": "${value}"}`);
    }
  };

  const handleFilteredCategory = async () => {
    try {
      let response;
      if (selectedCategory.category === 'all') {
        response = await api.getProductList();
        setProducts(response.data.item);
      } else {
        response = await api.getProductList(query);
        setProducts(response.data.item);
      }
    } catch (error) {
      console.error('error: ', error);
    }
  };

  useEffect(() => {
    handleFilteredCategory();
  }, [query]);

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
      {products.map((product: IProduct) => (
        <ul key={product._id}>
          <li>{product.name}</li>
        </ul>
      ))}
    </>
  );
}
