import { useEffect, useState } from 'react';
import { ICategoryPreview, IProduct } from '../../type';
import { api } from '../../api/api';
import {
  Button,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';

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
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={product._id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={product.mainImages[0]}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: {product.price}원
                  <br />
                  Shipping Fees: {product.shippingFees}원
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
