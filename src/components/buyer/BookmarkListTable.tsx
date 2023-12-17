import {
  CardActionArea,
  Typography,
  styled,
  Card,
  CardMedia,
  Box,
  Grid,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Close } from '@mui/icons-material';

import deleteBookmark from '../../lib/deleteBookmark';
import { api } from '../../api/api';
import useAddToCart from '../../hooks/useAddToCart';

export default function BookmarkListTable({ myBookmarkList }) {
  // 아이템 사이즈를 계산하는 함수
  const getItemSize = () => {
    return { xs: 12, sm: 6, md: 4, lg: 4, xl: 4 };
  };

  const handleSearchProduct = async (productId) => {
    console.log(productId);
    const response = await api.getProductList();
    const product = response.data.item.find((item) => item._id === productId);
    console.log(product);

    handleAddToCart(product);
  };

  const handleAddToCart = useAddToCart();

  return (
    <>
      {myBookmarkList
        .map((bookmark) => (
          <Grid item {...getItemSize()} key={bookmark._id} marginTop={3}>
            <StyledCard>
              <CardActionArea
                component={Link}
                to={`/product/${bookmark.product_id}`}
              >
                <ProductImage
                  image={bookmark.product.image.path}
                  title={bookmark.product.name}
                />
                <ProductDetails>
                  <Typography variant="h6">{bookmark.product.name}</Typography>
                  <Typography variant="h6" color="inherit" fontWeight={700}>
                    {bookmark.product.price.toLocaleString()} 원
                  </Typography>
                </ProductDetails>
              </CardActionArea>
              <ProductActions>
                <Button
                  variant="outlined"
                  style={{ flexGrow: '1' }}
                  onClick={() => handleSearchProduct(bookmark.product_id)}
                >
                  장바구니 담기
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => deleteBookmark(bookmark._id)}
                >
                  <Close />
                  삭제
                </Button>
              </ProductActions>
            </StyledCard>
          </Grid>
        ))
        .sort()
        .reverse()}
    </>
  );
}

const StyledCard = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  paddingBottom: '6px',
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

const ProductActions = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '6px',
  alignItems: 'center',
  padding: '4px',
  flexWrap: 'wrap',
});
