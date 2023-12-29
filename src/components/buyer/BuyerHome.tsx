import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  Typography,
  styled,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { ChevronRight } from '@mui/icons-material';
import OrderListTable from './OrderListTable';
import useGetOrderList from '../../hooks/useGetOrderList';
import useGetBookmark from '../../hooks/useGetBookmark';
import BookmarkListTable from './BookmarkListTable';
import getState from '../../lib/getState';

export const BuyerHome = () => {
  const orderList = useGetOrderList();
  const slicedOrderList = orderList.slice(0, 5);
  const bookmarkList = useGetBookmark();
  const sliceBookmarkList = bookmarkList.slice(-5);

  const getStateData = getState(orderList);

  let emptyListMessage = '';

  const emptyList = (listType: string) => {
    if (listType === 'order') {
      emptyListMessage = '주문내역이 없습니다.';
    } else if (listType === 'favorite') {
      emptyListMessage = '찜한 상품이 없습니다.';
    } else {
      emptyListMessage = '';
    }

    return (
      <Grid item xs={12} style={{ height: '30%' }}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          style={{ height: '100%' }}
        >
          <Typography variant="body1" color="textSecondary">
            {emptyListMessage}
          </Typography>
          <Link to={`/`}>
            <Button
              type="button"
              variant="outlined"
              size="medium"
              sx={{ marginTop: '6px' }}
            >
              상품 보러 가기
            </Button>
          </Link>
        </Box>
      </Grid>
    );
  };

  return (
    <>
      <Typography variant="h5" fontWeight={700}>
        구매자 대시보드
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'end',
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          marginTop={2}
          marginBottom={1}
        >
          최근 주문 내역
        </Typography>
        <Link to="order-list">
          <Button type="button" sx={{ padding: '10px 0' }}>
            주문내역 더보기 <ChevronRight />
          </Button>
        </Link>
      </Box>

      <OrderStateBox>
        <>
          {getStateData.map((state) => (
            <Grid
              container
              height={'90px'}
              sx={{ flexGrow: 1, width: '100%' }}
              key={state.id}
            >
              <Grid item xs padding={1}>
                <OrderStateDetail gap={0.5}>
                  <Typography variant="body1" paddingLeft={1}>
                    {state.title}
                  </Typography>

                  <Avatar sx={{ bgcolor: '#ef5b2a' }} aria-label="recipe">
                    {state.count}
                  </Avatar>
                </OrderStateDetail>
              </Grid>
              <Divider orientation="vertical"></Divider>
            </Grid>
          ))}
        </>
      </OrderStateBox>

      {orderList?.length === 0 ? (
        <>{emptyList('order')}</>
      ) : (
        <OrderListTable orderList={slicedOrderList} />
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'end',
          marginTop: '36px',
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          찜한 상품
        </Typography>
        <Link to={`/user/favorites`}>
          <Button type="button" sx={{ padding: '6px 0' }}>
            찜한 상품 더보기 <ChevronRight />
          </Button>
        </Link>
      </Box>
      {bookmarkList?.length === 0 ? (
        <>{emptyList('favorite')}</>
      ) : (
        <>
          <Grid container spacing={4} rowSpacing={4}>
            <BookmarkListTable myBookmarkList={sliceBookmarkList} />
          </Grid>
        </>
      )}
    </>
  );
};

const OrderStateBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  marginBottom: '20px',
  marginTop: '10px',
});

const OrderStateDetail = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
});
