import {
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Typography,
  Table,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  Card,
  Box,
  CardMedia,
  CardContent,
  styled,
} from '@mui/material';
import formatDate from '../../lib/formatDate';
import { ORDER_STATE } from '../../constants';
import { useTheme } from '@emotion/react';
import { ChevronRight } from '@mui/icons-material';

export default function OrderListTable({ orderList }) {
  console.log('주문내역', orderList);

  function ResponseWidth() {
    const theme: any = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));

    return (
      <>
        {matches ? (
          <>
            <TableContainer component={Paper}>
              <Table aria-label="결제내역">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      결제일
                      <br /> (주문번호)
                    </TableCell>
                    <TableCell align="center">상품명</TableCell>
                    <TableCell align="center">수량</TableCell>
                    <TableCell align="center">
                      총 결제금액 <br />
                      (배송비)
                    </TableCell>
                    <TableCell align="center">주문처리상태</TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderList.map((rows) => (
                    <TableRow key={rows._id}>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(rows.createdAt)}
                        </Typography>
                        ({rows._id})
                      </TableCell>
                      <TableCell align="center">
                        {rows.products[0].name} 포함 총 {rows.products.length}건
                      </TableCell>
                      <TableCell align="center">
                        {rows.products.length}
                      </TableCell>
                      <TableCell align="center">
                        {rows.cost.total.toLocaleString()}원<br /> (
                        {rows.cost.shippingFees.toLocaleString()}원)
                      </TableCell>
                      <TableCell align="center">
                        {ORDER_STATE.codes
                          .filter((state) => state.code === rows.state)
                          .map((stateValue) => (
                            <Typography key={stateValue.code} variant="body2">
                              {stateValue.value}
                            </Typography>
                          ))}
                      </TableCell>
                      <TableCell align="center">
                        <Button type="button" variant="outlined">
                          별점평가
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <>
            {orderList.map((list) => (
              <Card sx={{ marginBottom: '20px' }} key={list._id}>
                <OrderListBox>
                  <Typography variant="body1" fontWeight={700}>
                    {formatDate(list.createdAt)}
                  </Typography>
                  <Button sx={{ padding: '0', margin: '0' }}>
                    상세보기 <ChevronRight />
                  </Button>
                </OrderListBox>
                {list.products.map((product) => (
                  <OrderProductList key={product._id}>
                    <CardMedia
                      component="img"
                      height="180"
                      style={{ width: '200px', objectFit: 'cover' }}
                      image={product.image.path}
                      alt={product.name}
                      sx={{ padding: '15px' }}
                    />
                    <CardContent
                      sx={{
                        padding: '15px 0 0 0 ',
                        margin: '0',
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontStyle={{ color: '#646464' }}
                      >
                        주문번호: {product._id}
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={700}
                        textOverflow={'ellipsis'}
                        marginTop={0.3}
                      >
                        {product.name}
                      </Typography>
                      <Typography variant="body1" marginTop={0.5}>
                        {product.price.toLocaleString()}원
                      </Typography>

                      {ORDER_STATE.codes
                        .filter((state) => state.code === list.state)
                        .map((stateValue) => (
                          <Box key={stateValue.code}>
                            <Typography
                              key={stateValue.code}
                              variant="body2"
                              marginTop={1.5}
                              marginBottom={1.5}
                              fontStyle={{ color: 'red' }}
                            >
                              {stateValue.value}
                            </Typography>
                            <OrderReviewBox>
                              {stateValue.value === '배송 완료' ? (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                >
                                  별점평가
                                </Button>
                              ) : (
                                ''
                              )}
                            </OrderReviewBox>
                          </Box>
                        ))}
                    </CardContent>
                  </OrderProductList>
                ))}
                <Card>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px',
                    }}
                  >
                    <Typography variant="body2">
                      총 결제 금액 <br />
                      <Typography variant="caption">
                        상품금액 {list.cost.products.toLocaleString()} + 배송비{' '}
                        {list.cost.shippingFees.toLocaleString()}
                      </Typography>
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {list.cost.total.toLocaleString()}원
                    </Typography>
                  </Box>
                </Card>
              </Card>
            ))}
          </>
        )}
      </>
    );
  }

  const theme = createTheme();

  return (
    <>
      <ThemeProvider theme={theme}>
        <ResponseWidth />
      </ThemeProvider>
    </>
  );
}

const OrderListBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '15px',
  borderBottom: '1px solid #e2e2e2',
});

const OrderProductList = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  borderBottom: '1px solid #e2e2e2',
});

const OrderReviewBox = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingRight: '10px',
});
