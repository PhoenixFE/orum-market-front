import { CssBaseline } from '@mui/material';
import { Box } from '@mui/system';

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [data, setData] = useState<{ item: ProductItem | undefined }>();
  axios
    .get('https://localhost:443/api/products/')
    .then(function (response) {
      // 성공 핸들링
      console.log(response);
    })

    .catch(function (error) {
      // 에러 핸들링
      console.log(error);
    })
    .finally(function () {
      // 항상 실행되는 영역
    });
  //axios 받아오기

  const { productId } = useParams(); //상품id

  interface ProductItem {
    //데이터 받아올때 쓰려고 만듦
    _id: number;
    name: string;
    price: number;
  }

  interface productResponce {
    ok: number;
    item: ProductItem[];
  }
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <h1>Orum Market</h1>
    </Box>
  );
}
