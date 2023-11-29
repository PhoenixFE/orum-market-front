import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  Container,
  Typography,
  TextField,
  FormLabel,
  Button,
} from '@mui/material';

import { api } from '../../api/api';
import AddressForm from '../address/AddressForm';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  width: 100%;
  gap: 0.5rem;
`;

export interface IBuyerInfo {
  _id: number;
  email: string;
  name: string;
  address?: string;
}

export default function BuyerInfo() {
  const userId = localStorage.getItem('_id');
  const [buyerInfoData, setBuyerInfoData] = useState<IBuyerInfo>({
    _id: 0,
    email: '',
    name: '',
    address: '',
  });

  const handleChangeUserName = (newName: string) => {
    setBuyerInfoData({
      ...buyerInfoData,
      name: newName,
    });
  };

  const handleChangeUserAddress = (newAddress: string) => {
    setBuyerInfoData({
      ...buyerInfoData,
      address: newAddress,
    });
  };

  const handleUpdateUserInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.updateUserInfo(userId, buyerInfoData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userId) {
      console.log('ID가 유효하지 않습니다.');
      return;
    }

    const getBuyerInfo = async () => {
      try {
        const response = await api.getUserInfo(userId);
        setBuyerInfoData({
          ...buyerInfoData,
          _id: response.data.item._id,
          email: response.data.item.email,
          name: response.data.item.name,
          address: response.data.item.address,
        });
      } catch (error) {
        console.log(error);
      }
    };

    getBuyerInfo();
  }, []);

  if (!buyerInfoData) {
    return <>사용자 정보를 받아오지 못했습니다.</>;
  }

  return (
    <Container>
      {buyerInfoData && (
        <>
          <Typography variant="h4">내 정보 수정</Typography>
          <Form onSubmit={handleUpdateUserInfo}>
            <FormLabel>이메일</FormLabel>
            <TextField
              type="email"
              value={buyerInfoData.email}
              variant="outlined"
              size="small"
              fullWidth
              required
              disabled
            />
            <FormLabel>이름</FormLabel>
            <TextField
              type="text"
              value={buyerInfoData.name}
              onChange={(e) => handleChangeUserName(e.target.value)}
              size="small"
              fullWidth
            />
            <FormLabel>기본 배송지</FormLabel>
            <AddressForm
              address={buyerInfoData.address || ''}
              handleChangeUserAddress={handleChangeUserAddress}
            />
            <Button type="submit" variant="contained" size="large">
              내 정보 수정하기
            </Button>
          </Form>
        </>
      )}
    </Container>
  );
}
