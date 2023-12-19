import { Link } from 'react-router-dom';
import {
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Box,
  Button,
  Grid,
  Typography,
  TableContainer,
  Table,
  useMediaQuery,
} from '@mui/material';

import OrderListTable from './OrderListTable';
import useGetOrderList from '../../hooks/useGetOrderList';

export default function BuyerOrdeList() {
  const orderList = useGetOrderList();
  const matches = useMediaQuery('(min-width:1200px)');

  const moveMainBtn = (
    <Grid item xs={12}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        style={{ height: '30%' }}
      >
        <Typography variant="h6" color="textSecondary" marginTop={3}>
          주문 내역이 없습니다.
        </Typography>
        <Link to={`/`}>
          <Button
            type="button"
            variant="outlined"
            size="medium"
            sx={{ marginTop: '6px', marginBottom: '20px' }}
          >
            상품 보러 가기
          </Button>
        </Link>
      </Box>
    </Grid>
  );

  const tableHeader = (
    <>
      {matches ? (
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
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {moveMainBtn}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <>{moveMainBtn}</>
      )}
    </>
  );

  return (
    <>
      <Typography variant="h5" fontWeight={700} marginBottom={3}>
        내 주문 내역
      </Typography>
      {orderList?.length === 0 ? (
        tableHeader
      ) : (
        <OrderListTable orderList={orderList} />
      )}
    </>
  );
}
