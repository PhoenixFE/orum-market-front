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
import { Link, useNavigate } from 'react-router-dom';
import useAddToCart from '../../hooks/useAddToCart';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { memo } from 'react';
import { useUserStore } from '../../lib/store';
import CustomTooltip from '../../components/CustomTooltip';

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard = memo(function ProductCard({
  product,
}: ProductCardProps) {
  const { isLoggedIn } = useUserStore() as { isLoggedIn: boolean };
  const navigate = useNavigate();

  const handleNotLoggedIn = () => {
    const confirmLogin = confirm(
      '로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?',
    );
    if (confirmLogin) {
      navigate('/sign-in');
    }
  };
  const handleAddToCart = useAddToCart();
  const perchaseProduct = () => {
    if (!isLoggedIn) {
      handleNotLoggedIn();
    } else {
      alert('결제 페이지로 이동합니다');
      navigate('/checkout', { state: { product } });
    }
  };

  return (
    <>
      <StyledCard>
        <CardActionArea component={Link} to={`/products/${product._id}`}>
          {product.mainImages.length > 0 && (
            <LazyLoadImage
              src={product.mainImages[0].path}
              alt={product.name}
              width="100%"
              height="200px"
              style={{ objectFit: 'cover' }}
              effect="blur"
            />
          )}

          {product.mainImages.length === 0 && (
            <LazyLoadImage
              src="/assets/no-image.jpg"
              alt={product.name}
              width="100%"
              height="200px"
              style={{ objectFit: 'cover' }}
              effect="blur"
            />
          )}
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
          <CustomTooltip title="장바구니에 담기">
            <IconButton onClick={() => handleAddToCart(product)}>
              <ShoppingCartIcon />
            </IconButton>
          </CustomTooltip>
          <CustomTooltip title="바로 구매하기">
            <IconButton onClick={perchaseProduct}>
              <PaymentIcon />
            </IconButton>
          </CustomTooltip>
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
