import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Container,
  Typography,
  TextField,
  FormLabel,
  Button,
} from '@mui/material';

import { api } from '../../api/api';
import { IUserInfo } from '../../type/index';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  width: 100%;
  gap: 0.5rem;
`;

export default function SellerInfo() {
  const userId = localStorage.getItem('_id');
  const [sellerInfoData, setSellerInfoData] = useState<IUserInfo>({
    _id: 0,
    email: '',
    name: '',
    address: '',
  });

  const handleChangeUserName = (newName: string) => {
    setSellerInfoData({
      ...sellerInfoData,
      name: newName,
    });
  };

  const handleUpdateUserInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.updateUserInfo(userId, sellerInfoData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userId) {
      console.log('ID가 유효하지 않습니다.');
      return;
    }
    const getSellerInfo = async () => {
      try {
        const response = await api.getUserInfo(userId);
        setSellerInfoData({
          ...sellerInfoData,
          _id: response.data.item._id,
          email: response.data.item.email,
          name: response.data.item.name,
        });
      } catch (error) {
        console.log(error);
      }
    };

    getSellerInfo();
  }, []);

  return (
    <Container>
      {sellerInfoData && (
        <>
          <Typography variant="h4">판매자 정보 수정</Typography>
          <Form onSubmit={handleUpdateUserInfo}>
            <FormLabel>이메일</FormLabel>
            <TextField
              type="email"
              value={sellerInfoData.email}
              variant="outlined"
              size="small"
              fullWidth
              required
              disabled
            />
            <FormLabel>이름</FormLabel>
            <TextField
              type="text"
              value={sellerInfoData.name}
              onChange={(e) => handleChangeUserName(e.target.value)}
              size="small"
              fullWidth
            />
            <Button type="submit" variant="contained" size="large">
              판매자 정보 수정하기
            </Button>
          </Form>
        </>
      )}
    </Container>
  );
}
