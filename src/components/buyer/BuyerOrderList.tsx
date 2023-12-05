import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { api } from '../../api/api';
import { IOrderItem } from '../../type';
import { Link } from 'react-router-dom';
import { ORDER_STATE } from '../../constants';

export default function BuyerOrdeList() {
  const [orderList, setOrderList] = useState<IOrderItem[]>([]);

  // 날짜 변환 함수
  function formatDate(dateString: string) {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  }

  useEffect(() => {
    const getOrderProductInfo = async () => {
      try {
        const response = await api.getOrderProductInfo();
        setOrderList(response.data.item);
      } catch (error) {
        console.log(error);
      }
    };
    getOrderProductInfo();
  }, []);

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
        </Table>
      </TableContainer>
    </>
  );
}
