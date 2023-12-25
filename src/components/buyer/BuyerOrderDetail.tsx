import {
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Table,
  useMediaQuery,
  Card,
  Box,
  CardMedia,
  CardContent,
  styled,
} from '@mui/material';
// import formatDate from '../../lib/formatDate';
import { ORDER_STATE } from '../../constants';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../../api/api';
import { IOrderItemDetail } from '../../type';

export default function OrderListTable() {
  const matches = useMediaQuery('(min-width:1200px)');
  const location = useLocation();
  const orderId = location.state.productId;
  const [orderDetail, setOrderDetail] = useState<IOrderItemDetail>();

  // 구매자 구매 목록 상세조회
  useEffect(() => {
    const fetchBuyerOrderList = async () => {
      try {
        const response = await api.getOrderProductDetail(orderId);
        setOrderDetail(response.data.item);
      } catch (error) {
        console.log('구매목록 조회에 실패했습니다.', error);
      }
    };
    fetchBuyerOrderList();
  }, []);

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
        </Box>
      ));

  return (
    <>
      <Typography variant="h5" fontWeight={700}>
        주문 상세 조회
      </Typography>

      <TableContainer>
        <Table aria-label="구매 상세 내역-주문정보" padding="none">
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={2}
                variant={'head'}
                sx={{
                  fontWeight: '700',
                  fontSize: '20px',
                  padding: '10px 0',
                }}
              >
                주문정보
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <BasicHeadCell>주문번호</BasicHeadCell>
              <TableCell>{orderDetail?._id}</TableCell>
            </TableRow>
            <TableRow>
              <BasicHeadCell>주문일자</BasicHeadCell>
              <TableCell>{orderDetail?.createdAt}</TableCell>
            </TableRow>
            <TableRow>
              <BasicHeadCell>주문상태</BasicHeadCell>
              <TableCell>{orderState(orderDetail?.state || '')}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <BasicTable aria-label="구매 상세 내역-결제정보" padding="none">
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={2}
                variant={'head'}
                sx={{
                  fontWeight: '700',
                  fontSize: '20px',
                  padding: '10px 0',
                }}
              >
                결제정보
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <BasicHeadCell>총 결제금액</BasicHeadCell>
              <TableCell>
                <Typography variant="body2" color={'red'} fontWeight={700}>
                  {orderDetail?.cost?.total.toLocaleString()}원
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <BasicHeadCell>상품금액</BasicHeadCell>
              <TableCell>
                {orderDetail?.cost?.products.toLocaleString()}원 (할인금액:
                &nbsp;
                {orderDetail?.cost?.discount.products.toLocaleString()}원)
              </TableCell>
            </TableRow>
            <TableRow>
              <BasicHeadCell>배송비</BasicHeadCell>
              <TableCell>
                {orderDetail?.cost?.shippingFees?.toLocaleString()}원 (할인금액:
                &nbsp;
                {orderDetail?.cost?.discount.shippingFees.toLocaleString()}원)
              </TableCell>
            </TableRow>
          </TableBody>
        </BasicTable>

        <BasicTable aria-label="구매 상세 내역-배송지정보" padding="none">
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={2}
                variant={'head'}
                sx={{
                  fontWeight: '700',
                  fontSize: '20px',
                  padding: '10px 0',
                }}
              >
                배송지정보
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <BasicHeadCell>수령인</BasicHeadCell>
              <TableCell>{orderDetail?.value?.receiver}</TableCell>
            </TableRow>
            <TableRow>
              <BasicHeadCell>배송주소</BasicHeadCell>
              <TableCell>
                {orderDetail?.value?.mainAddress} +
                {orderDetail?.value?.subAddress}
              </TableCell>
            </TableRow>
          </TableBody>
        </BasicTable>

        <BasicTable aria-label="결제내역">
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={4}
                variant={'head'}
                sx={{
                  fontWeight: '700',
                  fontSize: '20px',
                  padding: '10px 0',
                }}
              >
                주문 상품 정보
              </TableCell>
            </TableRow>
          </TableHead>
        </BasicTable>
        {matches ? (
          <Table aria-label="결제내역">
            <TableHead>
              <TableRow>
                <TableHeaderCell align="center" sx={{ width: '100px' }}>
                  이미지
                </TableHeaderCell>
                <TableHeaderCell align="center">상품명</TableHeaderCell>
                <TableHeaderCell align="center">상품금액</TableHeaderCell>
                <TableHeaderCell align="center">주문상태</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderDetail?.products?.map((list) => (
                <TableRow key={list._id}>
                  <TableCell align="center">
                    <CardMedia
                      component="img"
                      height="150"
                      style={{ width: '150px', objectFit: 'cover' }}
                      image={list.image.path}
                      alt={list.name}
                    />
                  </TableCell>

                  <TableCell align="left">{list.name}</TableCell>
                  <TableCell align="center">
                    {list.price.toLocaleString()}원
                  </TableCell>
                  <TableCell align="center">
                    {orderState(orderDetail.state)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <>
            <Card sx={{ marginBottom: '20px', boxShadow: 'none' }}>
              {orderDetail?.products?.map((list) => (
                <OrderProductList key={list._id}>
                  <CardMedia
                    component="img"
                    height="180"
                    style={{ width: '180px', objectFit: 'cover' }}
                    image={list.image.path}
                    alt={list.name}
                    sx={{ padding: '15px' }}
                  />
                  <CardContent
                    sx={{
                      padding: '15px 0 0 0 ',
                      margin: '0',
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight={700}
                      textOverflow={'ellipsis'}
                      marginTop={0.3}
                    >
                      {list.name}
                    </Typography>
                    <Typography variant="body1" marginTop={0.5}>
                      {list.price.toLocaleString()}원
                    </Typography>
                    {orderState(orderDetail.state)}
                  </CardContent>
                </OrderProductList>
              ))}
            </Card>
          </>
        )}
      </TableContainer>
    </>
  );
}

const OrderProductList = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  borderBottom: '1px solid #e2e2e2',
});

const TableHeaderCell = styled(TableCell)({
  fontWeight: '700',
});

const BasicHeadCell = styled(TableCell)({
  fontWeight: '700',
  width: '100px',
  padding: '16px 0',
});

const BasicTable = styled(Table)({
  marginTop: '35px',
});
