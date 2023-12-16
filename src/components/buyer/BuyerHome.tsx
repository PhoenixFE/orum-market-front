import { Box, Button, Typography } from '@mui/material';
import BuyerFavorite from './BuyerFavorite';
import { Link } from 'react-router-dom';
import OrderListTable from './OrderListTable';
import useSetOrderList from '../../hooks/useSetOrderList';
import { useState } from 'react';

export const BuyerHome = () => {
  const [orderList, setOrderList] = useState([]);
  const id = localStorage.getItem('_id');
  useSetOrderList(setOrderList);
  const slicedOrderList = orderList.slice(0, 5);

  return (
    <>
      <h1>구매자 대시보드</h1>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'end',
        }}
      >
        <Typography variant="h5">내 주문 내역</Typography>
        <Link to={`/user/${id}/buyer-orderlist`}>
          <Button type="button">전체보기</Button>
        </Link>
      </Box>
      <OrderListTable orderList={slicedOrderList} />
      <br />
      <h1>찜한 상품</h1>
      <BuyerFavorite />
    </>
  );
};
