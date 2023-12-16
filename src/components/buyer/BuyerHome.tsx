import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import OrderListTable from './OrderListTable';
import useGetOrderList from '../../hooks/useGetOrderList';
import useGetBookmark from '../../hooks/useGetBookmark';
import BookmarkListTable from './BookmarkListTable';

export const BuyerHome = () => {
  const id = localStorage.getItem('_id');
  const orderList = useGetOrderList();
  const slicedOrderList = orderList.slice(0, 5);
  const bookmarkList = useGetBookmark();
  const sliceBookmarkList = bookmarkList.slice(-5);

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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'end',
        }}
      >
        <Typography variant="h5">찜한 상품</Typography>
        <Link to={`/user/${id}/buyer-favorite`}>
          <Button type="button">전체보기</Button>
        </Link>
      </Box>
      <BookmarkListTable myBookmarkList={sliceBookmarkList} />
    </>
  );
};
