import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Grid,
  Typography,
  styled,
} from '@mui/material';

import { Link } from 'react-router-dom';
import { IProduct } from '../../type';

export default function BuyerRecentlyView() {
  // 아이템 사이즈를 계산하는 함수
  const getItemSize = () => {
    return { xs: 12, sm: 6, md: 4, lg: 3, xl: 3 };
  };

  const recentlyViewedItems = localStorage?.getItem('recentlyViewed');
  const viewItems =
    recentlyViewedItems && JSON.parse(recentlyViewedItems)?.state?.viewItems;

  console.log(viewItems);

  if (!viewItems || viewItems?.length === 0) {
    return (
      <>
        <Typography variant="h5" fontWeight={700}>
          최근 본 상품
        </Typography>
        <Grid item xs={12} style={{ height: '100%' }}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            style={{ height: '100%' }}
          >
            <Typography variant="h6" color="textSecondary">
              최근 본 상품이 없습니다.
            </Typography>
            <Link to={`/`}>
              <Button
                type="button"
                variant="outlined"
                size="medium"
                sx={{ marginTop: '6px' }}
              >
                상품 보러 가기
              </Button>
            </Link>
          </Box>
        </Grid>
      </>
    );
  }

  return (
    <>
      <Typography variant="h5" fontWeight={700}>
        최근 본 상품
      </Typography>
      <Grid container spacing={4} rowSpacing={4}>
        {viewItems.map((product: IProduct) => (
          <Grid item {...getItemSize()} key={product._id} marginTop={3}>
            <StyledCard>
              <CardActionArea component={Link} to={`/products/${product._id}`}>
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
            </StyledCard>
          </Grid>
        ))}
      </Grid>
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
  padding: '12px 4px 6px',
});
