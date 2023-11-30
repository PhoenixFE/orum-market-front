import { useEffect, useState } from 'react';
import { ICategoryPreview, IProduct } from '../../type';
import { api } from '../../api/api';
import { Button, Box, Grid, Typography, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { CATEGORY } from '../../constants/index';

export default function ProductList() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await api.getProductList();
      setProducts(response.data.item);
      setLoading(false);
    } catch (error) {
      console.error('상품 목록을 가져오는데 실패했습니다', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!products.length) {
    return <Typography>상품이 없습니다.</Typography>;
  }

  return (
    <Box sx={{ padding: '1rem' }}>
      <Typography variant="h4" gutterBottom>
        최근 올라온 상품
      </Typography>
      {CATEGORY.depth2.map((category) => (
        <CategoryPreview
          key={category.id}
          category={category}
          products={products.filter(
            (product) => product.extra.category[1] === category.dbCode,
          )}
        />
      ))}
    </Box>
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
        <Typography variant="h5">{category.name}</Typography>
        <Button component={Link} to={`/category/${category.dbName}`}>
          더보기
        </Button>
      </Box>

      {products.length === 0 && <div>제품이 없습니다.</div>}
      {products.length > 0 && (
        <Grid container spacing={2}>
          {products.slice(0, 5).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </Grid>
      )}
    </Box>
  );
};
