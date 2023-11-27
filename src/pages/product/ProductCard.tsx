import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { IProduct } from '../../type';

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
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
  );
}
