import { Link } from 'react-router-dom';
import { useCartStore } from '../lib/store';
import { ICartItem } from '../type';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CustomTooltip from '../components/CustomTooltip';
import { useScrollToTop } from '../hooks/useScrollToTop';

export default function MyCart() {
  const { items, removeFromCart, clearCart } = useCartStore() as {
    items: ICartItem[];
    removeFromCart: (id: number) => void;
    clearCart: () => void;
  };

  console.log('장바구니 아이템', items);

  const currencyFormatter = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  });

  const sumShippingfees = items.reduce(
    (sum, item) => sum + item.shippingFees,
    0,
  );
  const sumPrice = items.reduce((sum, item) => sum + item.price, 0);
  const totalCost = sumShippingfees + sumPrice;
  // const totalCost = items.reduce(
  //   (total, item) => total + item.price + item.shippingFees * item.quantity,
  //   0,
  // );
  useScrollToTop();

  return (
    <Container sx={{ marginY: '50px' }}>
      <Typography variant="h4" fontWeight={700} mb={5}>
        장바구니
      </Typography>
      <Typography variant="body1">
        {items.length === 0 && <p>장바구니가 비었습니다.</p>}
        {items.length > 0 &&
          `장바구니에 ${items.length}개의 아이템이 있습니다.`}
      </Typography>
      <Grid container rowGap={10} m={0}>
        <Grid item xs={12} md={12} sx={{ margin: 0 }}>
          {items.length > 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <CustomTooltip title="장바구니 전부 비우기">
                  <Button
                    onClick={clearCart}
                    variant="text"
                    color="info"
                    style={{ height: '56px' }}
                  >
                    전체 삭제
                  </Button>
                </CustomTooltip>
              </Box>
              <Divider />
              <List>
                {items.map((item: ICartItem) => (
                  <ListItem key={item._id} divider sx={{ margin: 0 }}>
                    {item.mainImages.length === 0 ? (
                      <img
                        src="/assets/no-image.jpg"
                        alt={item.name}
                        style={{
                          width: '80px',
                          height: '80px',
                          marginRight: '20px',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <img
                        src={item.mainImages[0]?.path}
                        alt={item.name}
                        style={{
                          width: '80px',
                          height: '80px',
                          marginRight: '20px',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                    <ListItemText>
                      <Link
                        to={`/product/${item._id}`}
                        style={{
                          textDecoration: 'none',
                          color: 'inherit',
                        }}
                      >
                        <CustomTooltip title="해당 상품 페이지로 이동">
                          <Button
                            variant="text"
                            color="inherit"
                            sx={{
                              fontSize: '1.2rem',
                              fontWeight: '700',
                              margin: '0',
                              padding: '0',
                            }}
                          >
                            {item.name}
                          </Button>
                        </CustomTooltip>
                      </Link>
                      <Typography
                        variant="body1"
                        style={{ minWidth: '60px', fontWeight: '700' }}
                        textAlign={'left'}
                      >
                        {currencyFormatter.format(item.price)}
                      </Typography>
                      {item.shippingFees != undefined &&
                        item.shippingFees === 0 && (
                          <Typography variant="body2">무료배송</Typography>
                        )}
                      {item.shippingFees != undefined &&
                        item.shippingFees > 0 && (
                          <Typography
                            variant="body1"
                            style={{ minWidth: '60px' }}
                            textAlign={'left'}
                          >
                            배송비 {currencyFormatter.format(item.shippingFees)}
                          </Typography>
                        )}
                    </ListItemText>
                    <ListItemSecondaryAction
                      sx={{
                        right: '0px',
                      }}
                    >
                      <CustomTooltip title="해당 상품만 장바구니에서 삭제">
                        <Button
                          type="button"
                          variant="text"
                          sx={{
                            color: 'inherit',
                          }}
                          onClick={() => removeFromCart(item._id)}
                        >
                          <ClearIcon sx={{ fontSize: '0.9rem' }} />
                          삭제
                        </Button>
                      </CustomTooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>

              <Box
                sx={{
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ marginTop: 1 }}>
                    상품금액 {currencyFormatter.format(sumPrice)} + 배송료{' '}
                    {currencyFormatter.format(sumShippingfees)}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ marginBottom: 0.5, fontWeight: '800' }}
                  >
                    총 금액: {currencyFormatter.format(totalCost)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex' }} gap={2}>
                  <CustomTooltip title="결제 페이지로 이동합니다">
                    <Button
                      component={Link}
                      to="/checkout"
                      color="primary"
                      variant="outlined"
                      style={{ height: '56px' }}
                    >
                      구매하기
                    </Button>
                  </CustomTooltip>
                </Box>
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
