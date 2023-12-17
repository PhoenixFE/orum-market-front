import { Link } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

import OrderListTable from './OrderListTable';
import useGetOrderList from '../../hooks/useGetOrderList';

export default function BuyerOrdeList() {
  const orderList = useGetOrderList();

  if (orderList.length === 0) {
    return (
      <>
        <Typography variant="h3" sx={{ marginBottom: '1rem' }}>
          결제 내역이 없습니다.
        </Typography>
        <Link to={`/`}>
          <Button type="button" variant="contained" size="large">
            구매하러 가기
          </Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <Typography variant="h5" fontWeight={700}>
        내 주문 내역
      </Typography>
      <OrderListTable orderList={orderList} />
    </>
  );
}
