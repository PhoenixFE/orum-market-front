import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
  ToggleButton,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

import { api } from '../../api/api';
import { IProduct, IOrderItem } from '../../type';
import { QUALITY, ORDER_STATE } from '../../constants/index';
import formatDate from '../../lib/formatDate';
import SkeletonTable from './SkeletonTable';

export default function ProductManager() {
  const [productList, setProductList] = useState<IProduct[]>([]);
  const [sortedProductList, setSortedProductList] = useState<IProduct[]>([]);
  const [sortOrder, setSortOrder] = useState('최신순');
  const [isShow, setIsShow] = useState(false);
  const [orderList, setOrderList] = useState<IOrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getSellerProductInfo();
  }, []);

  const getSellerProductInfo = async () => {
    try {
      setIsLoading(true);
      const response = await api.getSellerProductInfo();
      const getMatchItem = response.data.item;
      setProductList(getMatchItem);
      setIsLoading(false);
    } catch (error) {
      console.log('판매 상품 조회 실패', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getOrderState = async () => {
      try {
        const response = await api.getOrderState();
        const orderState = response.data.item;
        // setProductList(orderState);
        setOrderList(orderState);
      } catch (error) {
        console.log('판매자의 주문상태 조회 실패', error);
      }
    };
    getOrderState();
  }, []);

  useEffect(() => {
    let sorted = [...productList];
    switch (sortOrder) {
      case '최신순':
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case '오래된순':
        sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case '가-하':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case '하-가':
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    setSortedProductList(sorted);
  }, [productList, sortOrder]);

  const getOrderStateLabel = (productId: number | undefined) => {
    const orderItem = orderList.find((order) =>
      order.products.some((product) => product._id === productId),
    );

    if (orderItem) {
      const orderStateCode = ORDER_STATE.codes.find(
        (code) => code.code === orderItem.state,
      );
      return orderStateCode ? orderStateCode.value : 'Unknown Order State';
    }

    return '판매중';
  };

  const deleteProduct = async (_id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(_id);
        setProductList(productList.filter((product) => product._id !== _id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <>
      <Link to={`/user/seller/products/new`}>
        <Button variant="contained">등록하기</Button>
      </Link>
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
            labelId="sort-label"
            id="sort-select"
            value={sortOrder}
            size="small"
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <MenuItem value="최신순">최신순</MenuItem>
            <MenuItem value="오래된순">오래된순</MenuItem>
            <MenuItem value="가-하">가격: 낮은 순</MenuItem>
            <MenuItem value="하-가">가격: 높은 순</MenuItem>
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
                <TableCell align="center">주문상태</TableCell>
                <TableCell align="center">공개여부</TableCell>
                <TableCell align="center">수정</TableCell>
                <TableCell align="center">삭제</TableCell>
              </TableRow>
            </TableHead>
            {isLoading ? (
              <SkeletonTable rows={5} columns={7} />
            ) : (
              <TableBody>
                {productList.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="subtitle1">
                        판매중인 상품이 존재하지 않습니다.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

                {sortedProductList.map((rows) => (
                  <TableRow key={rows._id}>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(rows.createdAt)}
                      </Typography>
                      ({rows._id})
                    </TableCell>

                    <TableCell align="center">
                      {rows.mainImages.length === 0 && (
                        <img
                          src="../../assets/no-image.jpg"
                          alt="no image"
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '5px',
                          }}
                        />
                      )}
                      {rows.mainImages.length > 1 && (
                        <img
                          src={`${rows.mainImages[0].path}`}
                          alt={`${rows.mainImages[0].id}`}
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '5px',
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Link to={`/products/${rows._id}`}>{rows.name}</Link>
                    </TableCell>
                    <TableCell align="center">
                      {rows.extra.sort
                        ? QUALITY.find(
                            (quality) => quality.value === rows.extra.sort,
                          )?.name
                        : QUALITY.find(
                            (quality) => quality.value === rows.quantity,
                          )?.name || 'Unknown Quality'}
                    </TableCell>
                    <TableCell align="center">
                      {rows.price.toLocaleString()}원
                    </TableCell>
                    <TableCell align="center">
                      {typeof rows._id === 'number'
                        ? getOrderStateLabel(rows._id)
                        : 'Invalid ID'}
                    </TableCell>
                    <TableCell align="center">
                      <ToggleButton
                        value="check"
                        selected={isShow}
                        size={'small'}
                        onChange={() => {
                          setIsShow(!rows.show);
                        }}
                      >
                        <CheckIcon />
                      </ToggleButton>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      ></Box>
                    </TableCell>
                    <TableCell align="center">
                      <Link
                        to={`/user/seller/products/${rows._id}/edit/`}
                        state={{ productId: `${rows._id}` }}
                      >
                        <Button type="button" variant="contained">
                          수정
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        type="button"
                        variant="text"
                        onClick={() => {
                          if (typeof rows._id === 'string') {
                            deleteProduct(rows._id);
                          }
                        }}
                      >
                        삭제
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
