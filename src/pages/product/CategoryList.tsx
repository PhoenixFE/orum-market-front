import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { IProduct } from '../../type';
import { useEffect, useState } from 'react';
import { api } from '../../api/api';
import ProductCard from './ProductCard';

export const CategoryList = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [sortOrder, setSortOrder] = useState('최신순');

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await api.getProductList();
      let filteredProducts = response.data.item.filter(
        (product: IProduct) => product.extra.category[1] === category,
      );

      switch (sortOrder) {
        case '최신순':
          filteredProducts.sort(
            (a: IProduct, b: IProduct) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          break;
        case '오래된순':
          filteredProducts.sort(
            (a: IProduct, b: IProduct) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );
          break;
        case '가-하':
          filteredProducts.sort(
            (a: IProduct, b: IProduct) => a.price - b.price,
          );
          break;
        case '하-가':
          filteredProducts.sort(
            (a: IProduct, b: IProduct) => b.price - a.price,
          );
          break;
        default:
          break;
      }

      setProducts(filteredProducts);
    };

    fetchProducts();
  }, [category, sortOrder]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <h1>{category}</h1>
        <FormControl>
          <InputLabel id="sort-label">정렬</InputLabel>
          <Select
            labelId="sort-label"
            id="sort-select"
            value={sortOrder}
            label="정렬"
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <MenuItem value="최신순">최신순</MenuItem>
            <MenuItem value="오래된순">오래된순</MenuItem>
            <MenuItem value="가-하">가격: 낮은 순</MenuItem>
            <MenuItem value="하-가">가격: 높은 순</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={2}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </Grid>
    </>
  );
};
