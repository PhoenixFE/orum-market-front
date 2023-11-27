import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { IProduct } from '../../type';
import { useEffect, useState } from 'react';
import { api } from '../../api/api';

export const CategoryList = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await api.getProductList();
      const filteredProducts = response.data.item.filter(
        (product: IProduct) => product.extra.category[1] === category,
      );
      setProducts(filteredProducts);
    };
    fetchProducts();
  }, [category]);

  return (
    <div>
      <h1>{category}</h1>
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
    </div>
  );
};
