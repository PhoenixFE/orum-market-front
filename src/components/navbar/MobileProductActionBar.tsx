import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PaymentIcon from '@mui/icons-material/Payment';
import useBookmark from '../../hooks/useBookmark';
import useAddToCart from '../../hooks/useAddToCart';

const StyledButton = styled(Button)(({ theme }) => ({
  flexGrow: 1,
  margin: theme.spacing(1),
  maxWidth: '100%',
}));

interface ActionBarProps {
  product: any;
  userId: any;
  productId: any;
  handlePurchase: any;
  isLoggedIn: boolean;
}

export default function MobileProductActionBar({
  product,
  userId,
  productId,
  handlePurchase,
  isLoggedIn,
}: ActionBarProps) {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmark(
    userId,
    productId,
  );
  const addProductToCart = useAddToCart();

  const handleToggleBookmark = () => {
    if (!isLoggedIn) {
      return;
    } else {
      if (isBookmarked) {
        removeBookmark();
        alert('북마크가 삭제되었습니다.');
      } else {
        addBookmark();
        alert('북마크가 추가되었습니다.');
      }
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-around',
        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
        backgroundColor: 'white',
        zIndex: 1100,
      }}
    >
      <StyledButton
        variant="contained"
        startIcon={<PaymentIcon />}
        onClick={handlePurchase}
      >
        구매하기
      </StyledButton>
      <StyledButton
        variant="outlined"
        startIcon={<ShoppingCartOutlinedIcon />}
        onClick={() => addProductToCart(product)}
      >
        장바구니
      </StyledButton>

      <StyledButton
        variant="outlined"
        startIcon={isBookmarked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        onClick={handleToggleBookmark}
      >
        찜하기
      </StyledButton>
    </Box>
  );
}
