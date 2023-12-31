import { useState } from 'react';
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
import { Link } from 'react-router-dom';
import { ChevronRight } from '@mui/icons-material';
import formatDate from '../../lib/formatDate';
import { ORDER_STATE } from '../../constants';
import { IOrderItem } from '../../type';
import RatingModal from './modal/RatingModal';
import { api } from '../../api/api';

export default function OrderListTable({
  orderList,
}: {
  orderList: IOrderItem[];
}) {
  const matches = useMediaQuery('(min-width:1200px)');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [replies, setReplies] = useState({
    order_id: 0,
    product_id: 0,
    rating: 0,
    content: '',
  });

  const orderState = (list: string, order_id: number, product_id: number) =>
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

          {stateValue.value === '배송 완료' ? (
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleModalOpen(product_id, order_id)}
            >
              별점후기
            </Button>
          ) : (
            ''
          )}
        </Box>
      ));

  const handleMoveTo = () => {
    window.scrollTo(0, 0);
  };

  const handleModalOpen = (product_id: number, order_id: number) => {
    setIsModalOpen(true);
    setReplies({
      ...replies,
      order_id: order_id,
      product_id: product_id,
    });
  };

  const handleCloseBtn = () => {
    setIsModalOpen(false);
    setRatingValue(0);
  };

  const submitRating = async () => {
    try {
      const updateReplies = {
        ...replies,
        rating: ratingValue,
        content: 'done',
      };

      await api.addRating(updateReplies);
      setIsModalOpen(false);
      alert('후기가 등록되었습니다!');
    } catch (error) {
      console.log('후기 등록에 실패했습니다.', error);
    }
  };

  return (
    <>
      <RatingModal
        open={isModalOpen}
        handleClose={() => handleCloseBtn()}
        ratingValue={ratingValue}
        setRatingValue={setRatingValue}
        handleCloseBtn={handleCloseBtn}
        submitRating={submitRating}
      />
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
                      <TableCell align="left">{product.name}</TableCell>
                      <TableCell align="center">
                        {product.price.toLocaleString()}원
                      </TableCell>
                      <TableCell align="center">
                        {orderState(list.state, list._id, product._id)}
                      </TableCell>
                      <TableCell align="center">
                        <Link
                          to={`/user/order-list/${list._id}`}
                          onClick={handleMoveTo}
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
                    <TableCell colSpan={6} sx={{ padding: '0' }}>
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
                            ? ' 배송비 무료'
                            : ` 배송비 ${list.cost.shippingFees.toLocaleString()}`}{' '}
                          - 할인금액&nbsp;
                          {list.cost.discount.products.toLocaleString()} ={' '}
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
          {/* 해상도 1200px 이하 */}
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
                  to={`/user/order-list/${list._id}`}
                  onClick={handleMoveTo}
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
                      주문번호: {list._id}
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
                    {orderState(list.state, list._id, product._id)}
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
                        : ` 배송비 ${list.cost.shippingFees.toLocaleString()}`}{' '}
                      - 할인금액 {list.cost.discount.products.toLocaleString()}
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
