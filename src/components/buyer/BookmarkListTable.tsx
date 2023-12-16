import {
  CardActionArea,
  Container,
  Typography,
  IconButton,
  styled,
  Card,
  CardMedia,
  Box,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from 'react-router-dom';

import deleteBookmark from '../../lib/deleteBookmark';

export default function BookmarkListTable({ myBookmarkList }) {
  return (
    <Container>
      {myBookmarkList
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
            <ProductActions>
              <IconButton onClick={() => deleteBookmark(bookmark._id)}>
                <FavoriteIcon />
              </IconButton>
            </ProductActions>
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

const ProductActions = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: '4px',
});
