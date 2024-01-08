import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from '@mui/material';
import { useState } from 'react';

import { api } from '../../api/api';
import { IOrderItem } from '../../type';
import {
  QUALITY,
  ORDER_STATE,
  SORT_OPTIONS_DASHBOARD,
} from '../../constants/index';
import formatDate from '../../lib/formatDate';
import SkeletonTable from './SkeletonTable';
import { useSort } from '../../hooks/useSort';
import { useSearchStore } from '../../lib/store';

export default function SellerOrderManager() {
  const { searchResult } = useSearchStore();
  const [sortedOrderList, setSortedOrderList] = useState<IOrderItem[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('latest');
  const [orderList, setOrderList] = useState<IOrderItem[]>([]);

  const [sortedProducts, setCurrentSortOrder, isLoading] = useSort(
    searchResult,
    'latest',
  ) as any;

  const onSortChange = (sortValue: string) => {
    setSortOrder(sortValue);
    setCurrentSortOrder(sortValue);
  };

  const getQualityName = (quantity: number) => {
    const qualityItem = QUALITY.find((q) => q.value === quantity);
    return qualityItem ? qualityItem.name : 'Unknown Quality';
  };

  const handleOrderStateChange = (
    _id: number,
    product_id: number,
    selectedOrderState: string,
  ) => {
    const updatedOrderList: IOrderItem[] = orderList.map((order) => {
      if (order.products.some((product) => product._id === product_id)) {
        return {
          ...order,
          state: selectedOrderState,
        };
      }
      return order;
    });
    setOrderList(updatedOrderList);
    setSortedOrderList(updatedOrderList);
  };

  const updateOderState = async (_id: number) => {
    try {
      const selectedProduct = sortedOrderList.find(
        (product) => product._id === _id,
      );

      if (selectedProduct) {
        await api.updateOrderState(
          _id,
          selectedProduct.products[0]._id,
          selectedProduct.state,
        );

        alert('해당 상품의 배송 상태가 수정되었습니다.');
      } else {
        console.log('상품을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.log('상품 배송상태 수정 오류', error);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 2,
        }}
      >
        <FormControl>
          <InputLabel id="sort-label">정렬</InputLabel>
          <Select
            labelId="sort-select-label"
            id="sort-select"
            value={sortOrder}
            size="small"
            sx={{ fontSize: '0.9rem', borderRadius: 0 }}
            onChange={(event) => onSortChange(event.target.value as string)}
          >
            {SORT_OPTIONS_DASHBOARD.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TableContainer component={Paper}>
          <Table aria-label="판매내역">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  등록일자
                  <br /> (등록번호)
                </TableCell>
                <TableCell align="center">이미지</TableCell>
                <TableCell align="center">상품명</TableCell>
                <TableCell align="center">품질</TableCell>
                <TableCell align="center">가격</TableCell>
                <TableCell align="center">배송료</TableCell>
                <TableCell align="center">배송상태</TableCell>
                <TableCell align="center"></TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            {sortedProducts.length === 0 && !isLoading && (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography variant="body2" sx={{ marginBottom: '1rem' }}>
                      주문 건이 존재하지 않습니다. 분발하세요.
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
            {isLoading && <SkeletonTable rows={5} columns={9} />}
            {sortedProducts.map((orderItem: IOrderItem) => (
              <TableBody key={orderItem._id}>
                {orderItem.products.map((productItem) => (
                  <TableRow key={productItem._id}>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(orderItem.createdAt)}
                      </Typography>
                      ({orderItem._id})
                    </TableCell>

                    <TableCell align="center">
                      <img
                        key={productItem.image.id}
                        src={productItem.image.path}
                        alt={'File Preview'}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '5px',
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">{productItem.name}</TableCell>
                    <TableCell align="center">
                      {' '}
                      {getQualityName(productItem.quantity)}
                    </TableCell>
                    <TableCell align="center">
                      {productItem.price.toLocaleString()}원
                    </TableCell>
                    <TableCell align="center">
                      {orderItem.cost.shippingFees.toLocaleString()}원
                    </TableCell>

                    <TableCell align="center">
                      <Select
                        label="주문 상태"
                        value={productItem.state}
                        onChange={(e) =>
                          handleOrderStateChange(
                            orderItem._id,
                            productItem._id,
                            e.target.value,
                          )
                        }
                      >
                        {ORDER_STATE.codes.map((state) => (
                          <MenuItem key={state.code} value={state.code}>
                            {state.value}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        type="button"
                        variant="contained"
                        onClick={() => updateOderState(orderItem._id)}
                      >
                        수정하기
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      ></Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ))}
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
