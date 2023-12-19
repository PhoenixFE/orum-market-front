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
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  ToggleButton,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

import { api } from '../../api/api';
import { IProduct, IOrderItem } from '../../type';
import { CATEGORY, QUALITY, ORDER_STATE } from '../../constants/index';

export default function SellerOrderList() {
  const _id = localStorage.getItem('_id');

  const [productList, setProductList] = useState<IProduct[]>([]);
  const [sortedProductList, setSortedProductList] = useState<IProduct[]>([]);
  const [sortOrder, setSortOrder] = useState('최신순');
  const [isShow, setIsShow] = useState(false);
  const [orderList, setOrderList] = useState<IOrderItem[]>([]);

  const [productOrderStates, setProductOrderStates] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    fetchSellerProduct();
  }, []);

  function formatDate(dateString: string) {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  }
  const fetchSellerProduct = async () => {
    try {
      const response = await api.getOrderState();
      const getMatchItem = response.data.item;
      setProductList(getMatchItem);
    } catch (error) {
      console.log('판매 상품 조회 실패', error);
    }
  };
  console.log('판매상품 리스트', productList);

  useEffect(() => {
    const getOrderState = async () => {
      try {
        const response = await api.getOrderState();
        const orderState = response.data.item;
        const orderStatesMap: Record<string, string> = {};
        orderState.forEach((orderItem: IOrderItem) => {
          orderItem.products.forEach((product) => {
            console.log('orderItem', orderItem.state);
            orderStatesMap[product.name] = orderItem.state;
          });
        });

        setProductOrderStates(orderStatesMap);
        setOrderList(orderState);
      } catch (error) {
        console.log('주문상태오류', error);
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

  if (productList.length === 0) {
    return (
      <>
        <Typography variant="h3" sx={{ marginBottom: '1rem' }}>
          등록된 물품이 없습니다.
        </Typography>
        <Link to={`/user/${_id}/product-create`}>
          <Button type="button" variant="contained" size="large">
            물품 등록하러 가기
          </Button>
        </Link>
      </>
    );
  }

  const getOrderStateLabel = (productId) => {
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
  return (
    <>
      <Link to={`/user/${_id}/product-create`}>
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
          <Table aria-label="구매내역">
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
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedProductList.map((rows) => (
                <TableRow key={rows._id}>
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(rows.createdAt)}
                    </Typography>
                    ({rows._id})
                  </TableCell>

                  <TableCell align="center">
                    <img
                      src={`${rows.products[0].image.path}`}
                      alt="main-Image"
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '5px',
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Link to={`http://localhost:5173/product/${rows._id}`}>
                      {rows.products[0].name}
                    </Link>
                  </TableCell>
                  <TableCell align="center">
                    {rows.products[0].quantity.sort
                      ? QUALITY.find(
                          (quality) =>
                            quality.value === rows.products[0].quantity.sort,
                        )?.name
                      : QUALITY.find(
                          (quality) =>
                            quality.value === rows.products[0].quantity,
                        )?.name || 'Unknown Quality'}
                  </TableCell>
                  <TableCell align="center">
                    {rows.products[0].price.toLocaleString()}원
                  </TableCell>
                  <TableCell align="center">
                    {getOrderStateLabel(rows._id) || ''}
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
                      to={`/user/${rows._id}/product-update`}
                      state={{ productId: `${rows._id}` }}
                    >
                      <Button type="button" variant="contained">
                        수정하기
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
