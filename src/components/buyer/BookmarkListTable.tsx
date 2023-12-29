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
import { IBookmarkItem, IProduct } from '../../type';

export default function BookmarkListTable({
  myBookmarkList,
}: {
  myBookmarkList: IBookmarkItem[];
}) {
  // 아이템 사이즈를 계산하는 함수
  const getItemSize = () => {
    return { xs: 12, sm: 6, md: 4, lg: 3, xl: 3 };
  };

  // 장바구니 추가를 위한 상품 api 조회
  const handleSearchProduct = async (productId: number) => {
    const response = await api.getProductList();
    console.log('response', response);
    const products: IProduct[] = response.data.item;
    const product = products.find((item) => item._id === productId);

    product && handleAddToCart(product);
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
                to={`/products/${bookmark.product_id}`}
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
