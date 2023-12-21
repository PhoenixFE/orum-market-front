import {
  Box,
  Card,
  CardActionArea,
  IconButton,
  Typography,
  styled,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import { IProduct } from '../../type';
import { Link } from 'react-router-dom';
import useAddToCart from '../../hooks/useAddToCart';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { memo } from 'react';

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard = memo(function ProductCard({
  product,
}: ProductCardProps) {
  // export default function ProductCard({ product }: ProductCardProps) {
  const handleAddToCart = useAddToCart();

  return (
    <>
      <StyledCard>
        <CardActionArea component={Link} to={`/product/${product._id}`}>
          <LazyLoadImage
            src={product.mainImages[0].path}
            effect="blur"
            title={product.name}
            alt={product.name}
            width="100%"
            height="200px"
            style={{ objectFit: 'cover' }}
          />
          <ProductDetails>
            <Typography variant="h6">{product.name}</Typography>
            <Typography variant="h6" color="inherit" fontWeight={700}>
              {product.price.toLocaleString()} 원
            </Typography>
          </ProductDetails>
        </CardActionArea>
        <ProductActions>
          <ShippingFee>
            <Typography variant="body2">
              {product.shippingFees === 0
                ? '무료배송'
                : '배송료: ' + product.shippingFees.toLocaleString() + '원'}
            </Typography>
          </ShippingFee>
          <IconButton onClick={() => handleAddToCart(product)}>
            <ShoppingCartIcon />
          </IconButton>
          <IconButton>
            <PaymentIcon />
          </IconButton>
        </ProductActions>
      </StyledCard>
    </>
  );
});

const StyledCard = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
});

const ProductDetails = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  padding: '16px',
});

const ProductActions = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: '8px',
});

const ShippingFee = styled(Box)({
  flexGrow: 1,
  padding: '0 8px',
});
