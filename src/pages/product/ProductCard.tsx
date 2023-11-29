import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Tooltip,
  Typography,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { IProduct } from '../../type';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAddToCart } from '../../hooks/useAddToCart';

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleAddToCart = useAddToCart();

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
      <Card>
        <Tooltip title="상품 페이지로 이동하기" arrow>
          <CardActionArea component={Link} to={`/product/${product._id}`}>
            <CustomCardMedia
              component="img"
              height="140"
              image={product.mainImages[0]}
              alt={product.name}
            />
          </CardActionArea>
        </Tooltip>
        <CardContent>
          <Link
            to={`/product/${product._id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Typography gutterBottom variant="h5" component="div">
              {product.name}
            </Typography>
          </Link>
          <Typography variant="body2" color="text.secondary">
            Price: {product.price}원
            <br />
            Shipping Fees: {product.shippingFees}원
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            startIcon={<ShoppingCartIcon />}
            onClick={() => handleAddToCart(product)}
          >
            장바구니
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}

const CustomCardMedia = styled(CardMedia)`
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;
