import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  ToggleButton,
  Typography,
  Box,
  Button,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useEffect, useState } from 'react';

import { api } from '../../api/api';
import { IProduct } from '../../type';
import { CATEGORY } from '../../constants/index';

export default function ProductManager() {
  const _id = localStorage.getItem('_id');

  const [productList, setProductList] = useState<IProduct[]>([]);
  const [isShow, setIsShow] = useState(false);

  // 날짜 변환 함수
  function formatDate(dateString: string) {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  }

  useEffect(() => {
    const fetchSellerProductData = async () => {
      try {
        const response = await api.getProductList();
        const getMatchItem = response.data.item.filter(
          (id: IProduct) => id.seller_id === Number(_id),
        );
        setProductList(getMatchItem);
      } catch (error) {
        console.log('상품 목록을 가져오는데 실패했습니다', error);
      }
    };
    fetchSellerProductData();
  }, []);

  console.log('받아온 데이터:', productList);

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="구매내역">
          <TableHead>
            <TableRow>
              <TableCell align="center">
                등록일자
                <br /> (등록번호)
              </TableCell>
              <TableCell align="center">카테고리</TableCell>
              <TableCell align="center">이미지</TableCell>
              <TableCell align="center">상품명</TableCell>
              <TableCell align="center">수량</TableCell>
              <TableCell align="center">가격</TableCell>
              <TableCell align="center">공개여부</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productList.map((rows) => (
              <TableRow key={rows._id}>
                <TableCell align="center">
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(rows.createdAt)}
                  </Typography>
                  ({rows._id})
                </TableCell>
                <TableCell align="center">
                  {CATEGORY.depth2
                    .filter(
                      (category) => category.dbCode === rows.extra.category[1],
                    )
                    .map((categoryName) => (
                      <Typography key={categoryName.id} variant="body2">
                        {categoryName.name}
                      </Typography>
                    ))}
                </TableCell>
                <TableCell align="center">
                  <img
                    src={`${rows.mainImages[0]}`}
                    alt="main-Image"
                    style={{ width: '80px' }}
                  />
                </TableCell>
                <TableCell align="center">{rows.name}</TableCell>
                <TableCell align="center">{rows.quantity}</TableCell>
                <TableCell align="center">
                  {rows.price.toLocaleString()}원
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
                      gap: 1,
                    }}
                  >
                    <Button type="button" variant="contained">
                      상세보기
                    </Button>
                    <Button type="button" variant="contained">
                      수정하기
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
