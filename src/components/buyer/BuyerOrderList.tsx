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

  console.log('orderList:', orderList);

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
                <TableCell align="center">{rows.state}</TableCell>
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
