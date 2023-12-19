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
  Card,
  Box,
  CardMedia,
  CardContent,
  styled,
} from '@mui/material';
import formatDate from '../../lib/formatDate';
import { ORDER_STATE } from '../../constants';
import { ChevronRight } from '@mui/icons-material';

export default function OrderListTable({ orderList }) {
  const matches = useMediaQuery('(min-width:1200px)');

  const dummyData = {
    ok: 1,
    item: [
      {
        _id: 3,
        user_id: 4,
        products: [
          {
            _id: 4,
            seller_id: 3,
            state: 'OS310',
            name: '레고 테크닉 42151 부가티 볼리드',
            image:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVeCj6YBnrra5lsjOGFCg0R5DGb8YRMOUvQw&usqp=CAU',
            quantity: 1,
            price: 45000,
            reply_id: 1,
            reply: {
              rating: 5,
              content: '아이가 좋아해요.',
              createdAt: '2023.12.14 10:23:21',
            },
          },
        ],
        cost: {
          products: 45000,
          shippingFees: 3500,
          discount: {
            products: 4500,
            shippingFees: 0,
          },
          total: 44000,
        },
        address: {
          name: '학교',
          value: '서울시 강남구 역삼동 234',
        },
        createdAt: '2023.12.15 04:23:21',
        updatedAt: '2023.12.17 21:23:21',
        state: 'OS020',
      },
      {
        _id: 2,
        user_id: 4,
        products: [
          {
            _id: 3,
            seller_id: 2,
            state: 'OS010',
            name: '레고 클래식 라지 조립 박스 10698',
            image:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT24oMSB7knrHfC5hehAl6Uveo82gmK5QVqJg&usqp=CAU',
            quantity: 1,
            price: 48870,
          },
          {
            _id: 4,
            seller_id: 3,
            state: 'OS010',
            name: '레고 테크',
            image:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT24oMSB7knrHfC5hehAl6Uveo82gmK5QVqJg&usqp=CAU',
            quantity: 2,
            price: 90000,
            reply_id: 2,
            reply: {
              rating: 4,
              content: '배송이 좀 느려요.',
              createdAt: '2023.12.15 21:23:21',
            },
          },
          {
            _id: 4,
            seller_id: 3,
            state: 'OS010',
            name: ' 부가티 볼리드',
            image:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVeCj6YBnrra5lsjOGFCg0R5DGb8YRMOUvQw&usqp=CAU',
            quantity: 2,
            price: 90000,
            reply_id: 2,
            reply: {
              rating: 4,
              content: '배송이 좀 느려요.',
              createdAt: '2023.12.15 21:23:21',
            },
          },
        ],
        cost: {
          products: 138840,
          shippingFees: 3500,
          discount: {
            products: 13880,
            shippingFees: 3500,
          },
          total: 124960,
        },
        address: {
          name: '집',
          value: '서울시 강남구 역삼동 123',
        },
        createdAt: '2023.12.14 00:23:21',
        updatedAt: '2023.12.16 10:23:21',
        state: 'OS040',
      },
    ],
  };

  const orderState = (list) =>
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
          <TableContainer component={Paper}>
            <Table aria-label="결제내역">
              <TableHead>
                <TableRow>
                  <TableHeaderCell align="center" sx={{ width: '120px' }}>
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
              {dummyData.item.map((list) => (
                <TableBody>
                  {list.products.map((product) => (
                    <TableRow>
                      <TableCell align="center" sx={{ minWidth: '80px' }}>
                        {list.createdAt} <br />
                        <Typography variant="caption">
                          [주문번호 : {list._id}]
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <CardMedia
                          component="img"
                          height="150"
                          style={{ width: '150px', objectFit: 'cover' }}
                          image={product.image}
                          alt={product.name}
                        />
                      </TableCell>
                      <TableCell align="left"> {product.name}</TableCell>
                      <TableCell align="center">
                        {product.price.toLocaleString()}원
                      </TableCell>
                      <TableCell align="center">
                        {orderState(list.state)}
                      </TableCell>
                      <TableCell align="center">
                        <Button sx={{ padding: '0', margin: '0' }}>
                          상세보기 <ChevronRight />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          paddingX: '16px',
                        }}
                      >
                        <Typography variant="body2" fontWeight={700}>
                          총 결제 금액 :
                        </Typography>
                        <Typography variant="body2">
                          &nbsp;상품금액 {list.cost.products.toLocaleString()} +
                          배송비 {list.cost.shippingFees.toLocaleString()} =
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>
                          {list.cost.total.toLocaleString()}원
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
                    {orderState(list.state)}
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

const TableHeaderCell = styled(TableCell)({
  fontWeight: '700',
});
