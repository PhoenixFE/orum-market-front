import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Container,
  Typography,
  styled,
} from '@mui/material';

import { Link } from 'react-router-dom';

export default function BuyerRecentlyView() {
  const recentlyViewedItems = localStorage?.getItem('recentlyViewed');
  const viewItems = JSON.parse(recentlyViewedItems)?.state?.viewItems;

  if (!viewItems || viewItems?.length === 0) {
    return (
      <>
        <Typography variant="h6">최근 본 상품이 없습니다.</Typography>
        <Link to={`/`}>
          <Button type="button" variant="outlined" size="medium">
            상품 보러 가기
          </Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <Container>
        {viewItems.map((product) => (
          <StyledCard key={product._id}>
            <CardActionArea component={Link} to={`/product/${product._id}`}>
              <ProductImage
                image={product.mainImages[0].path}
                title={product.name}
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
            </ProductActions>
          </StyledCard>
        ))}
      </Container>
    </>
  );
}

const StyledCard = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
});

const ProductImage = styled(CardMedia)({
  height: '200px',
  backgroundSize: 'cover',
  backgroundColor: 'grey.50',
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
