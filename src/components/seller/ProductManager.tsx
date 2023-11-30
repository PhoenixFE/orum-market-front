import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  ToggleButton,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from 'react';

const dummySellerProductList = [
  {
    item: {
      _id: 4,
      seller_id: 7,
      price: 8000,
      shippingFees: 3500,
      show: true,
      active: true,
      name: '등산용 양말',
      images: 'imiageURL',
      content: '내용',
      createdAt: '2023-11-29',
      updatedAt: '2023-11-29',
      extra: {
        category: ['H01', 'H0105'],
        quantity: 1,
        buyQuantity: 1,
        order: 0,
      },
    },
  },
  {
    item: {
      _id: 6,
      seller_id: 7,
      price: 35000,
      shippingFees: 3500,
      show: true,
      active: true,
      name: '바람막이',
      images: 'imiageURL',
      content: '내용',
      createdAt: '2023-11-29',
      updatedAt: '2023-11-29',
      extra: {
        category: ['H01', 'H0101'],
        quantity: 1,
        buyQuantity: 1,
        order: 0,
      },
    },
  },
  {
    item: {
      _id: 8,
      seller_id: 5,
      price: 20000,
      shippingFees: 2500,
      show: true,
      active: true,
      name: '등산용 바지',
      images: 'imiageURL',
      content: '내용',
      createdAt: '2023-11-29',
      updatedAt: '2023-11-29',
      extra: {
        category: ['H01', 'H0102'],
        quantity: 1,
        buyQuantity: 1,
        order: 0,
      },
    },
  },
  {
    item: {
      _id: 10,
      seller_id: 7,
      price: 40000,
      shippingFees: 3500,
      show: true,
      active: true,
      name: '등산용 배낭',
      images: 'imiageURL',
      content: '내용',
      createdAt: '2023-11-30',
      updatedAt: '2023-11-30',
      extra: {
        category: ['H01', 'H0105'],
        quantity: 1,
        buyQuantity: 1,
        order: 0,
      },
    },
  },
];

export default function ProductManager() {
  const _id = localStorage.getItem('_id');

  const [isShow, setIsShow] = useState(false);

  const test = dummySellerProductList.filter(
    (test) => test.item.seller_id === Number(_id),
  );
  console.log(test);

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
            {dummySellerProductList
              .filter((matchId) => matchId.item.seller_id === Number(_id))
              .map((rows) => (
                <TableRow key={rows.item._id}>
                  <TableCell align="center">
                    {rows.item.updatedAt} <br /> {rows.item._id}
                  </TableCell>
                  <TableCell align="center">
                    {rows.item.extra.category[1]}
                  </TableCell>
                  <TableCell align="center">{rows.item.images}</TableCell>
                  <TableCell align="center">{rows.item.name}</TableCell>
                  <TableCell align="center">
                    {rows.item.extra.quantity}
                  </TableCell>
                  <TableCell align="center">{rows.item.price}</TableCell>
                  <TableCell align="center">
                    <ToggleButton
                      value="check"
                      selected={isShow}
                      size={'small'}
                      onChange={() => {
                        setIsShow(!rows.item.show);
                      }}
                    >
                      <CheckIcon />
                    </ToggleButton>
                  </TableCell>
                  <TableCell>
                    <button type="button">수정하기</button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
