import { useEffect, useState } from 'react';
import { IProduct } from '../../type';
import { api } from '../../api/api';
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';

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
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
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
    </main>
  );
}
