import {
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Typography,
} from '@mui/material';
import formatDate from '../../lib/formatDate';
import { ORDER_STATE } from '../../constants';

export default function OrderListTable({ orderList }) {
  return (
    <>
      <TableContainer component={Paper}>
        <TableContainer aria-label="결제내역">
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
            {orderList.map((rows) => (
              <TableRow key={rows._id}>
                <TableCell align="center">
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(rows.createdAt)}
                  </Typography>
                  ({rows._id})
                </TableCell>
                <TableCell align="center">
                  {rows.products[0].name} 포함 총 {rows.products.length}건
                </TableCell>
                <TableCell align="center">{rows.products.length}</TableCell>
                <TableCell align="center">
                  {rows.cost.total.toLocaleString()}원<br /> (
                  {rows.cost.shippingFees.toLocaleString()}원)
                </TableCell>
                <TableCell align="center">
                  {ORDER_STATE.codes
                    .filter((state) => state.code === rows.state)
                    .map((stateValue) => (
                      <Typography key={stateValue.code} variant="body2">
                        {stateValue.value}
                      </Typography>
                    ))}
                </TableCell>
                <TableCell align="center">
                  <Button type="button" variant="outlined">
                    별점평가
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
      </TableContainer>
    </>
  );
}
