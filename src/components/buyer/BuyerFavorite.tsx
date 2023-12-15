import { useEffect, useState } from 'react';
import { api } from '../../api/api';
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

export default function BuyerFavorite() {
  const [myBookMarkList, setMyBookMarkList] = useState([]);

  useEffect(() => {
    const fetchBookmark = async () => {
      try {
        const response = await api.getMyBookMark();
        setMyBookMarkList(response.data.item);
      } catch (error) {
        console.log('북마크 조회를 실패했습니다.');
      }
    };

    fetchBookmark();
  }, []);

  if (!myBookMarkList || myBookMarkList?.length === 0) {
    return (
      <>
        <Typography variant="h6">북마크된 상품이 없습니다.</Typography>
        <Link to={`/`}>
          <Button type="button" variant="outlined" size="medium">
            상품 보러 가기
          </Button>
        </Link>
      </>
    );
  }

  return (
    <Container>
      {myBookMarkList
        .map((bookmark) => (
          <StyledCard key={bookmark._id}>
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
          </StyledCard>
        ))
        .sort()
        .reverse()}
    </Container>
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
