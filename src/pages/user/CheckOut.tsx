import { useState } from 'react';
import { useCartStore } from '../../lib/store';
import { api } from '../../api/api';
import { Container, TextField, Button, Typography } from '@mui/material';
import { ICartStore } from '../../type';

export default function CheckOut() {
  const { items, clearCart } = useCartStore() as ICartStore;
  const [address, setAddress] = useState({ name: '', value: '' });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePurchase = async () => {
    try {
      const orderData = {
        products: items.map((item) => ({
          _id: item._id,
          quantity: item.quantity,
        })),
        address: address,
      };

      await api.checkOut(orderData);
      alert('주문이 완료되었습니다.');
      clearCart();
    } catch (error) {
      console.error('주문 실패:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4">구매하기</Typography>
      <TextField
        label="배송지 이름"
        name="name"
        value={address.name}
        onChange={handleAddressChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="배송지 주소"
        name="value"
        value={address.value}
        onChange={handleAddressChange}
        fullWidth
        margin="normal"
      />
      <Button onClick={handlePurchase} variant="contained" color="primary">
        구매하기
      </Button>
    </Container>
  );
}
