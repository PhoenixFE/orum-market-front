import {
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Typography,
  Table,
  Grid,
  Card,
  styled,
  Box,
  CardMedia,
  CardActionArea,
} from '@mui/material';
import formatDate from '../../lib/formatDate';
import { ORDER_STATE } from '../../constants';
import { useEffect } from 'react';
import { api } from '../../api/api';
import { Link } from 'react-router-dom';
import { ChevronRight, Close } from '@mui/icons-material';

export default function OrderListTable({ orderList }) {
  console.log('orderList', orderList);

  useEffect(() => {
    const test = async (ttt) => {
      const response = await api.getOrderProductDetail(ttt);
      console.log('받아온 값', response.data.item);
    };
    test(3);
  }, []);

  const getItemSize = () => {
    return { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 };
  };

  return (
    <>
      <Grid container sx={{ backgroundColor: 'red' }}>
        <Grid item {...getItemSize()} marginY={3}>
          <StyledCard>
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
                12월 18일 주문
              </Typography>
              <Link to={`/`}>
                <Button type="button" sx={{ padding: '10px 0' }}>
                  주문내역 더보기 <ChevronRight />
                </Button>
              </Link>
            </Box>
            <ProductImage />
            <ProductDetails>
              <Typography variant="h6">ddd</Typography>
              <Typography variant="h6" color="inherit" fontWeight={700}>
                ddd 원
              </Typography>
            </ProductDetails>
            <ProductActions>
              <Button variant="outlined" style={{ flexGrow: '1' }}>
                장바구니 담기
              </Button>
              <Button variant="outlined">
                <Close />
                삭제
              </Button>
            </ProductActions>
          </StyledCard>
        </Grid>
      </Grid>

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

const StyledCard = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  paddingBottom: '6px',
  border: '0.5px solid #efefef',
});

const ProductImage = styled(CardMedia)({
  height: '150px',
  backgroundSize: 'cover',
  backgroundColor: 'grey.50',
});

const ProductDetails = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  padding: '12px 4px 6px',
});

const ProductActions = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '6px',
  alignItems: 'center',
  padding: '4px',
  flexWrap: 'wrap',
});
