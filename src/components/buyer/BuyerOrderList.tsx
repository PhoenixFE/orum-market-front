import { Link } from 'react-router-dom';
import { Box, Button, Grid, Typography } from '@mui/material';

import OrderListTable from './OrderListTable';
import useGetOrderList from '../../hooks/useGetOrderList';

export default function BuyerOrdeList() {
  const orderList = useGetOrderList();

  if (orderList?.length === 0) {
    return (
      <>
        <Typography variant="h5" fontWeight={700}>
          내 주문 내역
        </Typography>
        <Grid item xs={12} style={{ height: '100%' }}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            style={{ height: '100%' }}
          >
            <Typography variant="h6" color="textSecondary">
              주문 내역이 없습니다.
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
      </>
    );
  }

  return (
    <>
      <Typography variant="h5" fontWeight={700} marginBottom={3}>
        내 주문 내역
      </Typography>
      <OrderListTable orderList={orderList} />
    </>
  );
}
