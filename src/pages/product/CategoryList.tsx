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
import { CATEGORY } from '../../constants/index';
import CategoryNavBar from '../../components/CategoryNavBar';

export const CategoryList = () => {
  const { category: categoryName } = useParams<{ category: string }>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [sortedProducts, setSortedProducts] = useState<IProduct[]>([]);
  const [sortOrder, setSortOrder] = useState('최신순');

  // API GET 카테고리 상품 목록 조회
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const categoryData = CATEGORY.depth2.find(
          (item) => item.dbName === categoryName,
        );
        const categoryCode = categoryData ? categoryData.dbCode : null;
        if (categoryCode) {
          const extraQuery = encodeURIComponent(
            JSON.stringify({ 'extra.category': ['H01', categoryCode] }),
          );
          const response = await api.getProductList(`extra=${extraQuery}`);
          setProducts(response.data.item);
        }
      } catch (error) {
        console.error('상품 목록을 가져오는데 실패했습니다', error);
      }
    };
    fetchProducts();
  }, [categoryName]);

  // SORT 정렬
  useEffect(() => {
    let sorted = [...products];
    switch (sortOrder) {
      case '최신순':
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case '오래된순':
        sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case '가-하':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case '하-가':
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    setSortedProducts(sorted);
  }, [products, sortOrder]);

  return (
    <>
      <CategoryNavBar />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <h1>{categoryName}</h1>
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
        {sortedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </Grid>
    </>
  );
};
