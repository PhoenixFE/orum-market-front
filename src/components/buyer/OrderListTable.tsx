import {
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Typography,
  Table,
  useMediaQuery,
  Card,
  Box,
  CardMedia,
  CardContent,
  styled,
} from '@mui/material';
import formatDate from '../../lib/formatDate';
import { ORDER_STATE } from '../../constants';
import { ChevronRight } from '@mui/icons-material';
import { IOrderItem } from '../../type';
import { Link } from 'react-router-dom';

export default function OrderListTable({
  orderList,
}: {
  orderList: IOrderItem[];
}) {
  const matches = useMediaQuery('(min-width:1200px)');
  const id = localStorage.getItem('_id');

  const orderState = (list: string) =>
    ORDER_STATE.codes
      .filter((state) => state.code === list)
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
              <Button variant="outlined" size="small" fullWidth>
                별점평가
              </Button>
            ) : (
              ''
            )}
          </OrderReviewBox>
        </Box>
      ));

  return (
    <>
      {matches ? (
        <>
          <TableContainer>
            <Table aria-label="구매내역">
              <TableHead>
                <TableRow>
                  <TableHeaderCell align="center" sx={{ width: '160px' }}>
                    결제일
                    <br />
                    <Typography variant="caption">[주문번호]</Typography>
                  </TableHeaderCell>
                  <TableHeaderCell align="center" sx={{ width: '100px' }}>
                    이미지
                  </TableHeaderCell>
                  <TableHeaderCell align="center">상품정보</TableHeaderCell>
                  <TableHeaderCell align="center">상품금액</TableHeaderCell>
                  <TableHeaderCell align="center">주문상태</TableHeaderCell>
                  <TableHeaderCell align="center"></TableHeaderCell>
                </TableRow>
              </TableHead>
              {orderList.map((list) => (
                <TableBody key={list._id}>
                  {list.products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell align="center" sx={{ minWidth: '80px' }}>
                        {formatDate(list.createdAt)} <br />
                        <Typography variant="caption">
                          [주문번호 : {list._id}]
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <CardMedia
                          component="img"
                          height="150"
                          style={{ width: '150px', objectFit: 'cover' }}
                          image={product.image.path}
                          alt={product.name}
                        />
                      </TableCell>
                      <TableCell align="left">
                        <Link
                          to={`/product/${product._id}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          {product.name}
                        </Link>
                      </TableCell>
                      <TableCell align="center">
                        {product.price.toLocaleString()}원
                      </TableCell>
                      <TableCell align="center">
                        {orderState(list.state)}
                      </TableCell>
                      <TableCell align="center">
                        <Link
                          to={`/user/${id}/buyer-orderlist/${list._id}`}
                          state={{ productId: list._id }}
                        >
                          <Button sx={{ padding: '0', margin: '0' }}>
                            상세보기 <ChevronRight />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      sx={{ padding: '0' }}
                      variant="footer"
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          padding: '6px 16px 40px 16px',
                        }}
                      >
                        <Typography variant="body2" fontWeight={700}>
                          총 결제 금액 :
                        </Typography>
                        <Typography variant="body2">
                          &nbsp;상품금액 {list.cost.products.toLocaleString()} +
                          {list.cost.shippingFees === 0
                            ? ' 배송비 무료 ='
                            : ` 배송비 ${list.cost.shippingFees.toLocaleString()} =`}
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>
                          &nbsp;{list.cost.total.toLocaleString()}원
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ))}
            </Table>
          </TableContainer>
        </>
      ) : (
        <>
          {orderList.map((list) => (
            <Card
              sx={{ marginBottom: '20px', boxShadow: 'none' }}
              key={list._id}
            >
              <OrderListBox>
                <Typography variant="body1" fontWeight={700}>
                  {formatDate(list.createdAt)}
                </Typography>
                <Link
                  to={`/user/${id}/buyer-orderlist/${list._id}`}
                  state={{ productId: list._id }}
                >
                  <Button sx={{ padding: '0', margin: '0' }}>
                    상세보기 <ChevronRight />
                  </Button>
                </Link>
              </OrderListBox>
              {list.products.map((product) => (
                <OrderProductList key={product._id}>
                  <CardMedia
                    component="img"
                    height="180"
                    style={{ width: '180px', objectFit: 'cover' }}
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
                    {orderState(list.state)}
                  </CardContent>
                </OrderProductList>
              ))}
              <Card>
                <OrderPriceBox>
                  <Typography variant="body2" fontWeight={700}>
                    총 결제 금액 <br />
                    <Typography variant="caption">
                      상품금액 {list.cost.products.toLocaleString()} +
                      {list.cost.shippingFees === 0
                        ? ' 배송비 무료'
                        : ` 배송비 ${list.cost.shippingFees.toLocaleString()}`}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {list.cost.total.toLocaleString()}원
                  </Typography>
                </OrderPriceBox>
              </Card>
            </Card>
          ))}
        </>
      )}
    </>
  );
}

const OrderListBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '15px 0 15px 15px ',
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

const TableHeaderCell = styled(TableCell)({
  fontWeight: '700',
});

const OrderPriceBox = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px',
  marginBottom: '15px',
  borderBottom: '1px solid #e2e2e2',
});
