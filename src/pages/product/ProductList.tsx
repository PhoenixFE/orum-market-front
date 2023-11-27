import { useEffect, useState } from 'react';
import { ICategoryPreview, IProduct } from '../../type';
import { api } from '../../api/api';
import { Button, Box, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const categories = ['tops', 'bottoms', 'backpacks', 'shoes', 'gear'];

export default function ProductList() {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await api.getProductList();
    setProducts(response.data.item);
  };

  return (
    <main>
      <h1>제품 전체 목록 페이지</h1>
      {categories.map((category) => (
        <CategoryPreview
          key={category}
          category={category}
          products={products.filter(
            (product) => product.extra.category[1] === category,
          )}
        />
      ))}
    </main>
  );
}

const CategoryPreview = ({ category, products }: ICategoryPreview) => {
  return (
    <Box sx={{ marginBottom: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <Typography variant="h5">{category}</Typography>
        <Button component={Link} to={`/category/${category}`}>
          더보기
        </Button>
      </Box>
      <Grid container spacing={2}>
        {products.slice(0, 5).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </Grid>
    </Box>
  );
};
