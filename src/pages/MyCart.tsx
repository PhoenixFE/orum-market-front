import { Link } from 'react-router-dom';
import { useCartStore } from '../lib/store';
import { CartItem } from '../type';
import {
  Box,
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

export default function MyCart() {
  const { items, removeFromCart, clearCart } = useCartStore() as {
    items: CartItem[];
    removeFromCart: (id: number) => void;
    clearCart: () => void;
  };

  const currencyFormatter = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  });

  const totalCost = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        장바구니
      </Typography>
      {items.length === 0 && <p>장바구니가 비었습니다.</p>}
      {items.length > 0 && (
        <p>장바구니에 {items.length} 개의 아이템이 있습니다.</p>
      )}
      {items.length > 0 && (
        <Box>
          <List>
            {items.map((item: CartItem) => (
              <ListItem key={item._id} divider>
                <img
                  src={item.mainImages[0]}
                  alt={item.name}
                  style={{ width: '100px', marginRight: '20px' }}
                />
                <ListItemText primary={item.name} />
                <ListItemSecondaryAction>
                  {/* {item.quantity} */}

                  <Typography variant="body1" style={{ minWidth: '60px' }}>
                    {currencyFormatter.format(item.price)}
                  </Typography>
                  <IconButton onClick={() => removeFromCart(item._id)}>
                    <ClearIcon />
                    <Typography variant="button">삭제</Typography>
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              총 금액: {currencyFormatter.format(totalCost)}
            </Typography>
            <Button onClick={clearCart} variant="outlined" color="secondary">
              전체 삭제
            </Button>
          </Box>
          <Button
            component={Link}
            to="/checkout"
            variant="contained"
            color="primary"
          >
            구매하기
          </Button>
        </Box>
      )}
      {/* <button onClick={clearCart}>Clear Cart</button>
      <Link to="/checkout">
        <button>Check Out</button>
      </Link> */}
    </Container>
  );
}
