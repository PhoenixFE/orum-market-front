import { useEffect, useState } from 'react';
import { api } from '../../api/api';
import {
  Box,
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
        console.log(response.data.item);
      } catch (error) {
        console.log('북마크 조회를 실패했습니다.');
      }
    };

    fetchBookmark();
  }, []);

  return (
    <Container>
      {myBookMarkList.map((bookmark) => (
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
          <ProductActions></ProductActions>
        </StyledCard>
      ))}
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

const ProductActions = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: '8px',
});
