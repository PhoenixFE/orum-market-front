import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
} from '@mui/material';

const dummyUserOderList = [
  {
    _id: 1,
    user_id: 1,
    state: '0S010',
    products: [
      {
        _id: 1,
        name: '네파 푸퍼',
        images: 'imageUrl',
        quantity: 1,
        price: 12000,
      },
    ],
    cost: {
      products: 12000,
      shippingFees: 2500,
      total: 14500,
    },
    address: {
      name: '우리집',
      value: '서울시 강남구 어디동',
    },
    createdAt: '2023-11-29',
    updatedAt: '2023-11-29',
  },
  {
    _id: 2,
    user_id: 1,
    state: '0S010',
    products: [
      {
        _id: 2,
        name: '등산용 백팩',
        images: 'imageUrl',
        quantity: 1,
        price: 24000,
      },
    ],
    cost: {
      products: 24000,
      shippingFees: 3000,
      total: 27000,
    },
    address: {
      name: '우리집',
      value: '서울시 강남구 어디동',
    },
    createAt: '2023-11-29',
    updateAt: '2023-11-29',
  },
];

export default function BuyerOrdeList() {
  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="구매내역">
          <TableHead>
            <TableRow>
              <TableCell align="center">
                주문일자
                <br /> (주문번호)
              </TableCell>
              <TableCell align="center">이미지</TableCell>
              <TableCell align="center">상품명</TableCell>
              <TableCell align="center">수량</TableCell>
              <TableCell align="center">상품가격</TableCell>
              <TableCell align="center">주문처리상태</TableCell>
              <TableCell align="center">별점평가</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyUserOderList.map((rows) => (
              <TableRow key={rows._id}>
                <TableCell align="center">
                  {rows.createAt} <br /> ({rows._id})
                </TableCell>
                <TableCell align="center">{rows.products[0].images}</TableCell>
                <TableCell align="center">{rows.products[0].name}</TableCell>
                <TableCell align="center">
                  {rows.products[0].quantity}
                </TableCell>
                <TableCell align="center">{rows.products[0].price}</TableCell>
                <TableCell align="center">{rows.state}</TableCell>
                <TableCell align="center">
                  <Button type="button">별점등록</Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell align="right" colSpan={7}>
                총 가격{' '}
                {dummyUserOderList[0].cost.products +
                  ' + ' +
                  dummyUserOderList[0].cost.shippingFees +
                  ' = ' +
                  dummyUserOderList[0].cost.total +
                  '원'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
